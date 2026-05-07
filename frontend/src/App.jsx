import AISuggest from "./AISuggest";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Chat from "./chat";

function getMatchPercent(userSkills, requiredSkills) {
  if (!userSkills || !requiredSkills) return 0;
  const u = userSkills.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  const r = requiredSkills.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  if (!r.length) return 0;
  return Math.round((r.filter(s => u.includes(s)).length / r.length) * 100);
}

function safeMembers(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; }
    catch { return raw.split(",").map(s => s.trim()).filter(Boolean); }
  }
  return [];
}

function Avatar({ name, size = 40 }) {
  const n = name || "?";
  const colors = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444"];
  const color = colors[n.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0 }}>
      {n.charAt(0).toUpperCase()}
    </div>
  );
}

function SkillBadge({ skill, highlight = false }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, background: highlight ? "#6366f122" : "#ffffff0a", color: highlight ? "#818cf8" : "#94a3b8", border: `1px solid ${highlight ? "#6366f144" : "#ffffff14"}`, margin: "2px 3px 2px 0" }}>
      {skill.trim()}
    </span>
  );
}

function MatchBar({ percent }) {
  const color = percent >= 80 ? "#10b981" : percent >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "#64748b" }}>MATCH</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{percent}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 99, background: "#ffffff0f", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${percent}%`, borderRadius: 99, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
    </div>
  );
}

function Toast({ toast }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#ef444422" : "#10b98122", border: `1px solid ${toast.type === "error" ? "#ef4444" : "#10b981"}`, color: toast.type === "error" ? "#fca5a5" : "#6ee7b7", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 500 }}>
      {toast.msg}
    </div>
  );
}

// ── Smart Suggestions Modal ───────────────────────────────────────────────────
function SuggestionsModal({ team, users, invites, onInvite, onClose, theme }) {
  const members = safeMembers(team.members);

  // Find top matching users who are not already members
  const suggestions = users
    .filter(u => !members.includes(u.name))
    .map(u => ({ user: u, percent: getMatchPercent(u.skills, team.required_skills) }))
    .filter(m => m.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 10);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#000000cc" }}
      onClick={onClose}>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 480, maxHeight: "80vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: theme.text, margin: 0 }}>Suggested Members</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.muted, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        <p style={{ fontSize: 13, color: theme.muted, marginBottom: 20 }}>
          Top users matching <b style={{ color: theme.text }}>{team.team_name}</b>'s required skills
        </p>

        {suggestions.length === 0 && (
          <div style={{ textAlign: "center", color: theme.muted, padding: 32, fontSize: 13 }}>
            No matching users found right now.
          </div>
        )}

        {suggestions.map(({ user, percent }) => {
          const alreadyInvited = invites.some(inv => inv.team_id === team.id && inv.user_id === user.id);
          const color = percent >= 80 ? "#10b981" : percent >= 50 ? "#f59e0b" : "#ef4444";
          return (
            <div key={user.id} style={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={user.name || "?"} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{user.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{percent}% match</span>
                  </div>
                  <div style={{ marginTop: 4 }}>
                    {user.skills?.split(",").map((s, i) => {
                      const required = team.required_skills?.toLowerCase().split(",").map(x => x.trim()) || [];
                      return <SkillBadge key={i} skill={s} highlight={required.includes(s.trim().toLowerCase())} />;
                    })}
                  </div>
                </div>
              </div>

              {/* Match bar */}
              <div style={{ marginTop: 8, height: 3, borderRadius: 99, background: "#ffffff0f", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${percent}%`, borderRadius: 99, background: `linear-gradient(90deg, ${color}88, ${color})`, transition: "width 0.8s ease" }} />
              </div>

              {/* Invite button */}
              <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                {alreadyInvited ? (
                  <span style={{ fontSize: 11, color: "#f59e0b", background: "#f59e0b11", border: "1px solid #f59e0b33", borderRadius: 99, padding: "4px 12px", fontWeight: 600 }}>
                    ⏳ Invite Sent
                  </span>
                ) : (
                  <button onClick={() => onInvite(user, team)} style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #6366f144", background: "#6366f111", color: "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    ✉️ Send Invite
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Invites Notification Panel ────────────────────────────────────────────────
function InvitePanel({ invites, teams, currentUser, profile, onAccept, onDecline, onClose, theme }) {
  const myInvites = invites.filter(inv => inv.user_id === profile?.id && inv.status === "pending");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#000000cc" }}
      onClick={onClose}>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 420, maxHeight: "80vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: theme.text, margin: 0 }}>Team Invites</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.muted, fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        {myInvites.length === 0 && (
          <div style={{ textAlign: "center", color: theme.muted, padding: 32, fontSize: 13 }}>No pending invites</div>
        )}

        {myInvites.map(inv => (
          <div key={inv.id} style={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, marginBottom: 10 }}>
            <p style={{ fontSize: 14, color: theme.text, marginBottom: 4 }}>
              <b>{inv.invited_by}</b> invited you to join
            </p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#818cf8", marginBottom: 12 }}>
              {inv.team_name}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onAccept(inv)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #10b98144", background: "#10b98111", color: "#6ee7b7", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                ✓ Accept
              </button>
              <button onClick={() => onDecline(inv)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #ef444444", background: "#ef444411", color: "#fca5a5", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                ✗ Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ["Home", "People", "Teams", "Create"];

export default function App() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [invites, setInvites] = useState([]);
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");
  const [authSkills, setAuthSkills] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [searchSkills, setSearchSkills] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamSkills, setTeamSkills] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSkills, setEditSkills] = useState("");
  const [editName, setEditName] = useState("");
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  // Smart suggestions state
  const [suggestTeam, setSuggestTeam] = useState(null);
  const [showInvites, setShowInvites] = useState(false);

  const theme = darkMode ? dark : light;

  useEffect(() => {
    supabase.auth.getSession().then(function({ data }) {
      if (data.session) {
        setCurrentUser(data.session.user);
        fetchProfile(data.session.user.id);
      }
    });
    supabase.auth.onAuthStateChange(function(event, session) {
      if (session) {
        setCurrentUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setProfile(null);
      }
    });
    fetchData();
  }, []);

  const showToast = function(msg, type) {
    setToast({ msg, type: type || "success" });
    setTimeout(function() { setToast(null); }, 3000);
  };

  async function fetchProfile(uid) {
    const { data } = await supabase.from("users").select("*").eq("auth_id", uid).single();
    if (data) setProfile(data);
  }

  async function fetchData() {
    const { data: u } = await supabase.from("users").select("*");
    const { data: t } = await supabase.from("teams").select("*");
    const { data: inv } = await supabase.from("invites").select("*");
    setUsers(u || []);
    setTeams(t || []);
    setInvites(inv || []);
  }

  async function handleRegister() {
    if (!authEmail || !authPass || !authName || !authSkills) return showToast("Please fill all fields", "error");
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signUp({ email: authEmail, password: authPass });
    if (error) { setAuthLoading(false); return showToast(error.message, "error"); }
    const { data: newProfile } = await supabase.from("users").insert([{ name: authName.trim(), email: authEmail.toLowerCase().trim(), skills: authSkills.trim(), auth_id: data.user.id }]).select().single();
    setAuthLoading(false);
    setProfile(newProfile);
    showToast("Welcome " + authName + "! 🚀");
    fetchData();
  }

  async function handleLogin() {
    if (!authEmail || !authPass) return showToast("Please fill all fields", "error");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPass });
    setAuthLoading(false);
    if (error) return showToast(error.message, "error");
    showToast("Welcome back! 👋");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setJoinedTeams([]);
    showToast("Logged out!");
  }

  async function saveProfile() {
    if (!editName || !editSkills) return showToast("Fields cannot be empty", "error");
    const { data: updated } = await supabase.from("users").update({ name: editName, skills: editSkills }).eq("auth_id", currentUser.id).select().single();
    if (!updated) return showToast("Update failed", "error");
    setProfile(updated);
    setEditMode(false);
    fetchData();
    showToast("Profile updated! ✅");
  }

  async function handleCreateTeam() {
    if (!currentUser) return showToast("Please login first", "error");
    if (!teamName || !teamSkills) return showToast("Please fill all fields", "error");
    setCreating(true);
    const { error } = await supabase.from("teams").insert([{ team_name: teamName.trim(), required_skills: teamSkills.trim(), description: teamDesc.trim(), created_by: profile?.name || "Anonymous", creator_id: currentUser.id, members: JSON.stringify([profile?.name || "Anonymous"]) }]);
    setCreating(false);
    if (error) return showToast("Error: " + error.message, "error");
    showToast("Team created! 🎉");
    setTeamName(""); setTeamSkills(""); setTeamDesc("");
    fetchData();
    setTab(2);
  }

  async function handleJoinTeam(team) {
    if (!currentUser) return showToast("Please login first", "error");
    if (joinedTeams.includes(team.id)) return showToast("Already joined!", "error");
    const members = safeMembers(team.members);
    if (members.includes(profile?.name)) { setJoinedTeams(function(p) { return [...p, team.id]; }); return showToast("Already a member!", "error"); }
    members.push(profile?.name || "Anonymous");
    const { error } = await supabase.from("teams").update({ members: JSON.stringify(members) }).eq("id", team.id);
    if (error) return showToast("Error joining", "error");
    setJoinedTeams(function(p) { return [...p, team.id]; });
    showToast("Joined " + team.team_name + "! 🙌");
    fetchData();
  }

  // ── Send Invite ─────────────────────────────────────────────────────────────
  async function handleSendInvite(user, team) {
    const alreadyInvited = invites.some(inv => inv.team_id === team.id && inv.user_id === user.id);
    if (alreadyInvited) return showToast("Invite already sent!", "error");
    const { error } = await supabase.from("invites").insert([{
      team_id: team.id,
      team_name: team.team_name,
      invited_by: profile?.name || "Anonymous",
      user_id: user.id,
      user_name: user.name,
      status: "pending",
    }]);
    if (error) return showToast("Error sending invite", "error");
    showToast("Invite sent to " + user.name + "! ✉️");
    fetchData();
  }

  // ── Accept Invite ───────────────────────────────────────────────────────────
  async function handleAcceptInvite(invite) {
    const team = teams.find(t => t.id === invite.team_id);
    if (!team) return showToast("Team not found", "error");
    const members = safeMembers(team.members);
    if (!members.includes(profile?.name)) members.push(profile?.name);
    await supabase.from("teams").update({ members: JSON.stringify(members) }).eq("id", team.id);
    await supabase.from("invites").update({ status: "accepted" }).eq("id", invite.id);
    setJoinedTeams(p => [...p, team.id]);
    showToast("Joined " + invite.team_name + "! 🎉");
    fetchData();
  }

  // ── Decline Invite ──────────────────────────────────────────────────────────
  async function handleDeclineInvite(invite) {
    await supabase.from("invites").update({ status: "declined" }).eq("id", invite.id);
    showToast("Invite declined");
    fetchData();
  }

  function getTopMatches(skillStr) {
    return teams.map(function(t) { return { team: t, percent: getMatchPercent(skillStr, t.required_skills) }; }).filter(function(m) { return m.percent > 0; }).sort(function(a, b) { return b.percent - a.percent; }).slice(0, 5);
  }

  const activeSkills = profile?.skills || searchSkills;
  const topMatches = activeSkills ? getTopMatches(activeSkills) : [];
  const filteredUsers = users.filter(function(u) { return u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.skills?.toLowerCase().includes(userSearch.toLowerCase()); });
  const filteredTeams = teams.filter(function(t) { return t.team_name?.toLowerCase().includes(teamSearch.toLowerCase()) || t.required_skills?.toLowerCase().includes(teamSearch.toLowerCase()); });

  // Count pending invites for current user
  const pendingInviteCount = invites.filter(inv => inv.user_id === profile?.id && inv.status === "pending").length;

  if (!currentUser) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "sans-serif" }}>
        {toast && <Toast toast={toast} />}
        <div style={{ width: "100%", maxWidth: 400, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "36px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontWeight: 800, fontSize: 24, color: theme.text }}>HackMatch</span>
            <button onClick={function() { setDarkMode(function(d) { return !d; }); }} style={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: theme.text, fontSize: 13 }}>
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
          <p style={{ color: theme.muted, fontSize: 14, marginBottom: 24 }}>Find your hackathon team</p>
          <div style={{ display: "flex", background: theme.cardAlt, borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {["login", "register"].map(function(m) {
              return (
                <button key={m} onClick={function() { setAuthMode(m); }} style={{ flex: 1, padding: 8, border: "none", borderRadius: 8, cursor: "pointer", background: authMode === m ? "#6366f1" : "transparent", color: authMode === m ? "#fff" : theme.muted, fontSize: 14, fontWeight: 500 }}>
                  {m === "login" ? "Login" : "Register"}
                </button>
              );
            })}
          </div>
          {authMode === "register" && (
            <>
              <input placeholder="Full Name" value={authName} onChange={function(e) { setAuthName(e.target.value); }} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} />
              <input placeholder="Skills (e.g. React, ML, Node)" value={authSkills} onChange={function(e) { setAuthSkills(e.target.value); }} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} />
            </>
          )}
          <input placeholder="Email" type="email" value={authEmail} onChange={function(e) { setAuthEmail(e.target.value); }} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} />
          <input placeholder="Password" type="password" value={authPass} onChange={function(e) { setAuthPass(e.target.value); }} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} />
          <button onClick={authMode === "login" ? handleLogin : handleRegister} disabled={authLoading} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {authLoading ? "Loading..." : authMode === "login" ? "Login" : "Create Account"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "sans-serif", color: theme.text }}>
      {toast && <Toast toast={toast} />}

      {/* Smart Suggestions Modal */}
      {suggestTeam && (
        <SuggestionsModal
          team={suggestTeam}
          users={users}
          invites={invites}
          onInvite={handleSendInvite}
          onClose={() => setSuggestTeam(null)}
          theme={theme}
        />
      )}

      {/* Invites Panel */}
      {showInvites && (
        <InvitePanel
          invites={invites}
          teams={teams}
          currentUser={currentUser}
          profile={profile}
          onAccept={handleAcceptInvite}
          onDecline={handleDeclineInvite}
          onClose={() => setShowInvites(false)}
          theme={theme}
        />
      )}

      <header style={{ borderBottom: `1px solid ${theme.border}`, background: theme.card, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: theme.text }}>HackMatch</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={function() { setDarkMode(function(d) { return !d; }); }} style={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: theme.text, fontSize: 12 }}>
              {darkMode ? "Light" : "Dark"}
            </button>

            {/* Invite notification bell */}
            <button onClick={() => setShowInvites(true)} style={{ position: "relative", background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>
              🔔
              {pendingInviteCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", borderRadius: 99, fontSize: 9, fontWeight: 700, padding: "2px 5px", lineHeight: 1 }}>
                  {pendingInviteCount}
                </span>
              )}
            </button>

            <Avatar name={profile?.name || "U"} size={32} />
            <span style={{ fontSize: 13, color: theme.muted }}>{profile?.name}</span>
            <button onClick={handleLogout} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.muted, fontSize: 12, cursor: "pointer" }}>Logout</button>
          </div>
        </div>
      </header>

      <nav style={{ maxWidth: 720, margin: "0 auto", padding: "12px 20px", display: "flex", gap: 6 }}>
        {TABS.map(function(t, i) {
          return (
            <button key={i} onClick={function() { setTab(i); }} style={{ padding: "8px 16px", borderRadius: 99, border: `1px solid ${tab === i ? theme.border : "transparent"}`, background: tab === i ? theme.cardAlt : "transparent", color: tab === i ? theme.text : theme.muted, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              {t}
            </button>
          );
        })}
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "16px 20px 60px" }}>

        {/* ── HOME ── */}
        {tab === 0 && (
          <div>
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20, marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <Avatar name={profile?.name} size={56} />
                <div style={{ flex: 1 }}>
                  {editMode ? (
                    <>
                      <input value={editName} onChange={function(e) { setEditName(e.target.value); }} placeholder="Name" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
                      <input value={editSkills} onChange={function(e) { setEditSkills(e.target.value); }} placeholder="Skills" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
                      <AISuggest theme={theme} onSelect={function(skill) { setEditSkills(function(prev) { return prev ? prev + ", " + skill : skill; }); }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={saveProfile} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", cursor: "pointer", fontSize: 13 }}>Save</button>
                        <button onClick={function() { setEditMode(false); }} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.muted, cursor: "pointer", fontSize: 13 }}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ fontWeight: 700, fontSize: 18, color: theme.text, margin: "0 0 4px 0" }}>{profile?.name}</h2>
                        <button onClick={function() { setEditMode(true); setEditName(profile?.name || ""); setEditSkills(profile?.skills || ""); }} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.muted, fontSize: 12, cursor: "pointer" }}>Edit</button>
                      </div>
                      <p style={{ color: theme.muted, fontSize: 12, margin: "0 0 8px" }}>{profile?.email || currentUser?.email}</p>
                      <div>{profile?.skills?.split(",").map(function(s, i) { return <SkillBadge key={i} skill={s} highlight />; })}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <h3 style={{ fontWeight: 700, fontSize: 13, color: theme.muted, margin: "24px 0 12px", letterSpacing: 1, textTransform: "uppercase" }}>Top Team Matches</h3>
            {topMatches.length === 0 && <div style={{ textAlign: "center", color: theme.muted, padding: 32, background: theme.card, borderRadius: 16 }}>No matches found. Update your skills!</div>}
            {topMatches.map(function(m) {
              const members = safeMembers(m.team.members);
              const alreadyIn = joinedTeams.includes(m.team.id) || members.includes(profile?.name);
              return (
                <div key={m.team.id} style={{ background: theme.card, border: "1px solid #6366f122", borderRadius: 16, padding: 20, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 16, color: theme.text, margin: "0 0 4px" }}>{m.team.team_name}</h3>
                      {m.team.description && <p style={{ fontSize: 13, color: theme.muted, margin: "0 0 6px" }}>{m.team.description}</p>}
                      <p style={{ fontSize: 11, color: theme.muted, marginBottom: 6 }}>by {m.team.created_by || "Anonymous"} · {members.length} members</p>
                      <div>{m.team.required_skills?.split(",").map(function(s, i) { return <SkillBadge key={i} skill={s} />; })}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 10 }}>
                      <button onClick={function() { handleJoinTeam(m.team); }} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${alreadyIn ? "#10b98144" : "#6366f144"}`, background: alreadyIn ? "#10b98111" : "#6366f111", color: alreadyIn ? "#6ee7b7" : "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        {alreadyIn ? "Joined" : "Join"}
                      </button>
                      <button onClick={function() { setActiveChat(m.team); }} style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #6366f144", background: "#6366f111", color: "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>💬 Chat</button>
                    </div>
                  </div>
                  <MatchBar percent={m.percent} />
                </div>
              );
            })}

            <h3 style={{ fontWeight: 700, fontSize: 13, color: theme.muted, margin: "24px 0 12px", letterSpacing: 1, textTransform: "uppercase" }}>Stats</h3>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ label: "Users", value: users.length, icon: "👥" }, { label: "Teams", value: teams.length, icon: "🏆" }, { label: "Best Match", value: (topMatches[0]?.percent ?? 0) + "%", icon: "⚡" }].map(function(s, i) {
                return (
                  <div key={i} style={{ flex: 1, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 26 }}>{s.icon}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: theme.text }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: theme.muted, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PEOPLE ── */}
        {tab === 1 && (
          <div>
            <input style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: theme.card, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} placeholder="Search by name or skill..." value={userSearch} onChange={function(e) { setUserSearch(e.target.value); }} />
            {filteredUsers.map(function(u) {
              return (
                <div key={u.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20, marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <Avatar name={u.name} size={44} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h3 style={{ fontWeight: 700, fontSize: 15, color: theme.text, margin: "0 0 4px" }}>{u.name}</h3>
                        {u.auth_id === currentUser?.id && <span style={{ fontSize: 10, background: "#6366f122", color: "#818cf8", border: "1px solid #6366f144", borderRadius: 99, padding: "2px 8px" }}>You</span>}
                      </div>
                      <div>{u.skills?.split(",").map(function(s, i) { return <SkillBadge key={i} skill={s} />; })}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TEAMS ── */}
        {tab === 2 && (
          <div>
            <input style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: theme.card, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} placeholder="Search teams..." value={teamSearch} onChange={function(e) { setTeamSearch(e.target.value); }} />
            {filteredTeams.map(function(t) {
              const members = safeMembers(t.members);
              const match = getMatchPercent(profile?.skills || "", t.required_skills);
              const alreadyIn = joinedTeams.includes(t.id) || members.includes(profile?.name);
              const isLeader = t.creator_id === currentUser?.id;
              return (
                <div key={t.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: theme.text, margin: 0 }}>{t.team_name}</h3>
                        {isLeader && <span style={{ fontSize: 10, background: "#f59e0b22", color: "#fcd34d", border: "1px solid #f59e0b44", borderRadius: 99, padding: "2px 8px", fontWeight: 600 }}>Leader</span>}
                      </div>
                      {t.description && <p style={{ fontSize: 13, color: theme.muted, margin: "0 0 6px" }}>{t.description}</p>}
                      <p style={{ fontSize: 11, color: theme.muted, marginBottom: 8 }}>by {t.created_by || "Anonymous"} · {members.length} members</p>
                      <div style={{ marginBottom: 8 }}>{t.required_skills?.split(",").map(function(s, i) { return <SkillBadge key={i} skill={s} />; })}</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {members.map(function(m, i) { return <span key={i} style={{ fontSize: 11, color: theme.muted, background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 99, padding: "2px 8px" }}>{m}</span>; })}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 12 }}>
                      {match > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: match >= 80 ? "#10b981" : match >= 50 ? "#f59e0b" : "#ef4444" }}>{match}% match</span>}
                      <button onClick={function() { handleJoinTeam(t); }} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${alreadyIn ? "#10b98144" : "#6366f144"}`, background: alreadyIn ? "#10b98111" : "#6366f111", color: alreadyIn ? "#6ee7b7" : "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        {alreadyIn ? "Joined" : "Join"}
                      </button>
                      <button onClick={function() { setActiveChat(t); }} style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #6366f144", background: "#6366f111", color: "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>💬 Chat</button>

                      {/* Find Members button — only visible to team leader */}
                      {isLeader && (
                        <button onClick={function() { setSuggestTeam(t); }} style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #f59e0b44", background: "#f59e0b11", color: "#fcd34d", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                          ✨ Find Members
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CREATE ── */}
        {tab === 3 && (
          <div>
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, color: theme.text, margin: "0 0 6px" }}>Create a Team</h2>
              <p style={{ fontSize: 13, color: theme.muted, margin: "0 0 20px" }}>Create your team and find the best candidates</p>
              <input placeholder="Team Name" value={teamName} onChange={function(e) { setTeamName(e.target.value); }} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} />
              <input placeholder="Required Skills (e.g. React, Node, ML)" value={teamSkills} onChange={function(e) { setTeamSkills(e.target.value); }} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} />
              <textarea placeholder="Description (optional)" value={teamDesc} onChange={function(e) { setTeamDesc(e.target.value); }} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: theme.cardAlt, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 16, boxSizing: "border-box", height: 80, resize: "none" }} />
              <button onClick={handleCreateTeam} disabled={creating} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                {creating ? "Creating..." : "Create Team"}
              </button>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 13, color: theme.muted, margin: "0 0 12px", letterSpacing: 1, textTransform: "uppercase" }}>Find People by Skill</h3>
            <input style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: theme.card, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} placeholder="Type a skill..." value={searchSkills} onChange={function(e) { setSearchSkills(e.target.value); }} />
            {searchSkills && users.filter(function(u) { return u.skills?.toLowerCase().includes(searchSkills.toLowerCase()); }).map(function(u) {
              return (
                <div key={u.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20, marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <Avatar name={u.name} size={40} />
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 15, color: theme.text, margin: "0 0 4px" }}>{u.name}</h3>
                      <div>{u.skills?.split(",").map(function(s, i) { return <SkillBadge key={i} skill={s} highlight={s.toLowerCase().includes(searchSkills.toLowerCase())} />; })}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeChat && <Chat team={activeChat} userName={profile?.name || "Anonymous"} onClose={function() { setActiveChat(null); }} theme={theme} />}
      </main>
    </div>
  );
}

const dark = { bg: "#080810", card: "#0f0f1e", cardAlt: "#ffffff08", border: "#ffffff0f", text: "#e2e8f0", muted: "#64748b" };
const light = { bg: "#f1f5f9", card: "#ffffff", cardAlt: "#f8fafc", border: "#e2e8f0", text: "#0f172a", muted: "#64748b" };