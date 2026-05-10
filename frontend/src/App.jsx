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

function Avatar({ name, size = 40, className = "", url = "" }) {
  const n = name || "?";
  const colors = ["#7c3aed","#a855f7","#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6"];
  const color = colors[n.charCodeAt(0) % colors.length];
  if (url) {
    return (
      <div className={`hm-avatar ${className}`} style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, boxShadow: `0 2px 8px ${color}44` }}>
        <img src={url} alt={n} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div className={`hm-avatar ${className}`} style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}99)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, boxShadow: `0 2px 8px ${color}44` }}>
      {n.charAt(0).toUpperCase()}
    </div>
  );
}

function SkillBadge({ skill, highlight = false, theme }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, background: highlight ? (theme?.accent + "18") : theme?.cardAlt, color: highlight ? theme?.accent : theme?.muted, border: `1px solid ${highlight ? theme?.accent + "44" : theme?.border}`, margin: "2px 3px 2px 0" }}>
      {skill.trim()}
    </span>
  );
}

function MatchBar({ percent, theme }) {
  const color = percent >= 80 ? "#10b981" : percent >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: theme?.muted, letterSpacing: 1, fontWeight: 600 }}>MATCH SCORE</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{percent}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: theme?.cardAlt, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${percent}%`, borderRadius: 99, background: `linear-gradient(90deg, ${color}88, ${color})`, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function Toast({ toast }) {
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`, color: toast.type === "error" ? "#dc2626" : "#16a34a", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 24px #00000018" }}>
      {toast.msg}
    </div>
  );
}

function SuggestionsModal({ team, users, invites, onInvite, onClose, theme }) {
  const members = safeMembers(team.members);
  const suggestions = users
    .filter(u => !members.includes(u.name))
    .map(u => ({ user: u, percent: getMatchPercent(u.skills, team.required_skills) }))
    .filter(m => m.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 10);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#0f172acc", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: 28, width: "100%", maxWidth: 480, maxHeight: "80vh", overflowY: "auto", boxShadow: "0 24px 64px #7c3aed18" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h2 style={{ fontWeight: 800, fontSize: 18, color: theme.text, margin: 0 }}>Suggested Members</h2>
          <button onClick={onClose} style={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 8, width: 32, height: 32, color: theme.muted, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <p style={{ fontSize: 13, color: theme.muted, marginBottom: 20 }}>Top users matching <b style={{ color: theme.accent }}>{team.team_name}</b>'s skills</p>
        {suggestions.length === 0 && <div style={{ textAlign: "center", color: theme.muted, padding: 32, fontSize: 13 }}>No matching users found.</div>}
        {suggestions.map(function({ user, percent }) {
          const alreadyInvited = invites.some(inv => inv.team_id === team.id && inv.user_id === user.id);
          const color = percent >= 80 ? "#10b981" : percent >= 50 ? "#f59e0b" : "#ef4444";
          return (
            <div key={user.id} style={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 16, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar className="hm-avatar" name={user.name} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>{user.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color, background: color + "15", border: `1px solid ${color}44`, borderRadius: 99, padding: "2px 10px" }}>{percent}%</span>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    {user.skills?.split(",").map(function(s, i) {
                      const req = team.required_skills?.toLowerCase().split(",").map(x => x.trim()) || [];
                      return <SkillBadge key={i} skill={s} highlight={req.includes(s.trim().toLowerCase())} theme={theme} />;
                    })}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10, height: 4, borderRadius: 99, background: theme.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${percent}%`, borderRadius: 99, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
              </div>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                {alreadyInvited ? (
                  <span style={{ fontSize: 11, color: "#f59e0b", background: "#f59e0b11", border: "1px solid #f59e0b33", borderRadius: 99, padding: "4px 12px", fontWeight: 600 }}>⏳ Invite Sent</span>
                ) : (
                  <button onClick={() => onInvite(user, team)} style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${theme.accent}44`, background: theme.accent + "11", color: theme.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✉️ Send Invite</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InvitePanel({ invites, teams, currentUser, profile, onAccept, onDecline, onClose, theme }) {
  const myInvites = invites.filter(inv => inv.user_id === profile?.id && inv.status === "pending");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#0f172acc", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: 28, width: "100%", maxWidth: 420, maxHeight: "80vh", overflowY: "auto", boxShadow: "0 24px 64px #7c3aed18" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontWeight: 800, fontSize: 18, color: theme.text, margin: 0 }}>Team Invites</h2>
          <button onClick={onClose} style={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 8, width: 32, height: 32, color: theme.muted, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {myInvites.length === 0 && <div style={{ textAlign: "center", color: theme.muted, padding: 32, fontSize: 13 }}>No pending invites</div>}
        {myInvites.map(inv => (
          <div key={inv.id} style={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 16, marginBottom: 10 }}>
            <p style={{ fontSize: 13, color: theme.muted, marginBottom: 4 }}><b style={{ color: theme.text }}>{inv.invited_by}</b> invited you to join</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: theme.accent, marginBottom: 14 }}>{inv.team_name}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onAccept(inv)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "1px solid #10b98144", background: "#10b98111", color: "#10b981", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✓ Accept</button>
              <button onClick={() => onDecline(inv)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "1px solid #ef444444", background: "#ef444411", color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✗ Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ["Home", "People", "Teams", "My Teams", "Create"];

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
  const [darkMode, setDarkMode] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [suggestTeam, setSuggestTeam] = useState(null);
  const [showInvites, setShowInvites] = useState(false);
const [editBio, setEditBio] = useState("");
const [editExperience, setEditExperience] = useState("");
const [editGithub, setEditGithub] = useState("");
const [editLinkedin, setEditLinkedin] = useState("");
  const theme = darkMode ? dark : light;

  useEffect(() => {
    supabase.auth.getSession().then(function({ data }) {
      if (data.session) { setCurrentUser(data.session.user); fetchProfile(data.session.user.id); }
    });
    supabase.auth.onAuthStateChange(function(event, session) {
      if (session) { setCurrentUser(session.user); fetchProfile(session.user.id); }
      else { setCurrentUser(null); setProfile(null); }
    });
    fetchData();
  }, []);

  const showToast = function(msg, type) {
    setToast({ msg, type: type || "success" });
    setTimeout(function() { setToast(null); }, 3000);
  };

 async function fetchProfile(uid) {
  const { data } = await supabase.from("users").select("*").eq("auth_id", uid).single();
  if (data) {
    setProfile(data);
  } else {
    const sessionData = await supabase.auth.getSession();
    const user = sessionData.data.session?.user;
    if (user) {
      const { data: newProfile } = await supabase.from("users").insert([{
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        email: user.email,
        skills: "",
        auth_id: uid,
      }]).select().single();
      if (newProfile) setProfile(newProfile);
    }
  }
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
async function handleAvatarUpload(file) {
  if (!file || !currentUser) return;
  const ext = file.name.split(".").pop();
  const path = `${currentUser.id}.${ext}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
  if (error) return showToast("Upload failed", "error");
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const { data: updated } = await supabase.from("users").update({ avatar_url: data.publicUrl }).eq("auth_id", currentUser.id).select().single();
  if (updated) { setProfile(updated); showToast("Photo updated! 📸"); }
}
 async function saveProfile() {
  if (!editName || !editSkills) return showToast("Fields cannot be empty", "error");
  const { data: updated } = await supabase.from("users").update({
    name: editName,
    skills: editSkills,
    bio: editBio,
    experience: editExperience,
    github: editGithub,
    linkedin: editLinkedin,
  }).eq("auth_id", currentUser.id).select().single();
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
    if (members.includes(profile?.name)) { setJoinedTeams(p => [...p, team.id]); return showToast("Already a member!", "error"); }
    members.push(profile?.name || "Anonymous");
    const { error } = await supabase.from("teams").update({ members: JSON.stringify(members) }).eq("id", team.id);
    if (error) return showToast("Error joining", "error");
    setJoinedTeams(p => [...p, team.id]);
    showToast("Joined " + team.team_name + "! 🙌");
    fetchData();
  }

  async function handleSendInvite(user, team) {
    const alreadyInvited = invites.some(inv => inv.team_id === team.id && inv.user_id === user.id);
    if (alreadyInvited) return showToast("Invite already sent!", "error");
    const { error } = await supabase.from("invites").insert([{ team_id: team.id, team_name: team.team_name, invited_by: profile?.name || "Anonymous", user_id: user.id, user_name: user.name, status: "pending" }]);
    if (error) return showToast("Error sending invite", "error");
    showToast("Invite sent to " + user.name + "! ✉️");
    fetchData();
  }

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

  async function handleDeclineInvite(invite) {
    await supabase.from("invites").update({ status: "declined" }).eq("id", invite.id);
    showToast("Invite declined");
    fetchData();
  }

  function getTopMatches(skillStr) {
    return teams.map(t => ({ team: t, percent: getMatchPercent(skillStr, t.required_skills) })).filter(m => m.percent > 0).sort((a, b) => b.percent - a.percent).slice(0, 5);
  }

  const activeSkills = profile?.skills || searchSkills;
  const topMatches = activeSkills ? getTopMatches(activeSkills) : [];
  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.skills?.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredTeams = teams.filter(t => t.team_name?.toLowerCase().includes(teamSearch.toLowerCase()) || t.required_skills?.toLowerCase().includes(teamSearch.toLowerCase()));
  const pendingInviteCount = invites.filter(inv => inv.user_id === profile?.id && inv.status === "pending").length;

  const inputStyle = { width: "100%", padding: "11px 16px", borderRadius: 12, background: theme.cardAlt, border: `1.5px solid ${theme.border}`, color: theme.text, fontSize: 14, boxSizing: "border-box", outline: "none", transition: "border 0.2s" };
  const cardStyle = { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 20, marginBottom: 12, boxShadow: "0 2px 12px #7c3aed08" };
  const primaryBtn = { padding: "10px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${theme.accent}, #a855f7)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 16px ${theme.accent}33` };
  const ghostBtn = { padding: "9px 18px", borderRadius: 10, border: `1.5px solid ${theme.border}`, background: "transparent", color: theme.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" };
  const joinBtn = (joined) => ({ padding: "7px 16px", borderRadius: 9, border: `1px solid ${joined ? "#10b98144" : theme.accent + "44"}`, background: joined ? "#10b98111" : theme.accent + "11", color: joined ? "#10b981" : theme.accent, fontSize: 12, fontWeight: 700, cursor: "pointer" });

  if (!currentUser) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', sans-serif" }}>
        {toast && <Toast toast={toast} />}
        <div style={{ width: "100%", maxWidth: 420, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: "40px 36px", boxShadow: "0 24px 64px #7c3aed14" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div>
              <span style={{ fontWeight: 900, fontSize: 26, color: theme.text, letterSpacing: "-0.5px" }}>Hack</span>
              <span style={{ fontWeight: 900, fontSize: 26, color: theme.accent, letterSpacing: "-0.5px" }}>Match</span>
            </div>
            <button onClick={() => setDarkMode(d => !d)} style={{ ...ghostBtn, padding: "6px 14px", fontSize: 12 }}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
          <p style={{ color: theme.muted, fontSize: 14, marginBottom: 28 }}>Find your perfect hackathon team ⚡</p>

          <div style={{ display: "flex", background: theme.cardAlt, borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setAuthMode(m)} style={{ flex: 1, padding: "9px", border: "none", borderRadius: 9, cursor: "pointer", background: authMode === m ? theme.accent : "transparent", color: authMode === m ? "#fff" : theme.muted, fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}>
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          {authMode === "register" && (
            <>
              <input placeholder="Full Name" value={authName} onChange={e => setAuthName(e.target.value)} className="hm-input" style={{ ...inputStyle, marginBottom: 12 }} />
              <input placeholder="Skills (e.g. React, ML, Node)" value={authSkills} onChange={e => setAuthSkills(e.target.value)} className="hm-input" style={{ ...inputStyle, marginBottom: 12 }} />
            </>
          )}
          <input placeholder="Email" type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="hm-input" style={{ ...inputStyle, marginBottom: 12 }} />
          <input placeholder="Password" type="password" value={authPass} onChange={e => setAuthPass(e.target.value)} className="hm-input" style={{ ...inputStyle, marginBottom: 20 }} />
          <button onClick={authMode === "login" ? handleLogin : handleRegister} disabled={authLoading} style={{ ...primaryBtn, width: "100%", padding: "13px", fontSize: 15 }}>
            {authLoading ? "Loading..." : authMode === "login" ? "Login →" : "Create Account →"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
  <div style={{ flex: 1, height: 1, background: theme.border }} />
  <span style={{ color: theme.muted, fontSize: 12 }}>or</span>
  <div style={{ flex: 1, height: 1, background: theme.border }} />
</div>

<button
  onClick={async function() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
  }}
  style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1.5px solid ${theme.border}`, background: theme.cardAlt, color: theme.text, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
>
  <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="Google" />
  Continue with Google
</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', sans-serif", color: theme.text }}>
      {toast && <Toast toast={toast} />}
      {suggestTeam && <SuggestionsModal team={suggestTeam} users={users} invites={invites} onInvite={handleSendInvite} onClose={() => setSuggestTeam(null)} theme={theme} />}
      {showInvites && <InvitePanel invites={invites} teams={teams} currentUser={currentUser} profile={profile} onAccept={handleAcceptInvite} onDecline={handleDeclineInvite} onClose={() => setShowInvites(false)} theme={theme} />}

      <header style={{ borderBottom: `1px solid ${theme.border}`, background: theme.card, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px #7c3aed08" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "13px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontWeight: 900, fontSize: 20, color: theme.text, letterSpacing: "-0.5px" }}>Hack</span>
            <span style={{ fontWeight: 900, fontSize: 20, color: theme.accent, letterSpacing: "-0.5px" }}>Match</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setDarkMode(d => !d)} style={{ ...ghostBtn, padding: "6px 12px", fontSize: 12 }}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setShowInvites(true)} style={{ position: "relative", ...ghostBtn, padding: "6px 12px", fontSize: 16 }}>
              🔔
              {pendingInviteCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", borderRadius: 99, fontSize: 9, fontWeight: 700, padding: "2px 5px" }}>{pendingInviteCount}</span>}
            </button>
            <Avatar className="hm-avatar" name={profile?.name || "U"} size={32} />
            <span style={{ fontSize: 13, color: theme.muted, fontWeight: 500 }}>{profile?.name}</span>
            <button onClick={handleLogout} style={{ ...ghostBtn, padding: "6px 14px", fontSize: 12 }}>Logout</button>
          </div>
        </div>
      </header>

      <nav style={{ maxWidth: 760, margin: "0 auto", padding: "14px 24px 0", display: "flex", gap: 2, borderBottom: `1px solid ${theme.border}`, background: theme.card }}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ padding: "9px 18px", border: "none", background: "transparent", color: tab === i ? theme.accent : theme.muted, fontSize: 13, fontWeight: tab === i ? 700 : 500, cursor: "pointer", borderBottom: `2px solid ${tab === i ? theme.accent : "transparent"}`, marginBottom: -1, borderRadius: "8px 8px 0 0", transition: "all 0.2s" }}>
            {t}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 24px 80px" }}>

        {tab === 0 && (
          <div>
            <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${theme.card}, ${theme.cardAlt})` }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
  <Avatar className="hm-avatar" name={profile?.name} size={58} url={profile?.avatar_url || ""} />
  <label style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}>
    📷
    <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleAvatarUpload(e.target.files[0]); }} />
  </label>
</div>
                <div style={{ flex: 1 }}>
                  {editMode ? (
                    <>
                      <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" className="hm-input" style={{ ...inputStyle, marginBottom: 10 }} />
                      <input value={editSkills} onChange={e => setEditSkills(e.target.value)} placeholder="Skills" className="hm-input" style={{ ...inputStyle, marginBottom: 10 }} />
                      <input value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Bio (e.g. Full stack dev from Delhi)" className="hm-input" style={{ ...inputStyle, marginBottom: 10 }} />
<select value={editExperience} onChange={e => setEditExperience(e.target.value)} className="hm-input" style={{ ...inputStyle, marginBottom: 10 }}>
  <option value="">Select Experience Level</option>
  <option value="Beginner">Beginner (0-1 years)</option>
  <option value="Intermediate">Intermediate (1-3 years)</option>
  <option value="Advanced">Advanced (3+ years)</option>
  <option value="Expert">Expert (5+ years)</option>
</select>
<input value={editGithub} onChange={e => setEditGithub(e.target.value)} placeholder="GitHub URL" className="hm-input" style={{ ...inputStyle, marginBottom: 10 }} />
<input value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)} placeholder="LinkedIn URL" className="hm-input" style={{ ...inputStyle, marginBottom: 10 }} />
                      <AISuggest theme={theme} onSelect={skill => setEditSkills(prev => prev ? prev + ", " + skill : skill)} />
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button onClick={saveProfile} className="hm-btn-primary hm-ripple" style={primaryBtn}>Save</button>
                        <button onClick={() => setEditMode(false)} className="hm-btn-ghost" className="hm-btn-ghost" style={ghostBtn}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h2 style={{ fontWeight: 800, fontSize: 19, color: theme.text, margin: "0 0 3px" }}>{profile?.name}</h2>
                          <p style={{ color: theme.muted, fontSize: 12, margin: "0 0 10px" }}>{profile?.email || currentUser?.email}</p>
                          {profile?.experience && <span style={{ fontSize: 11, background: theme.accent + "18", color: theme.accent, border: `1px solid ${theme.accent}44`, borderRadius: 99, padding: "2px 10px", fontWeight: 700, marginRight: 6 }}>{profile.experience}</span>}
{profile?.bio && <p style={{ fontSize: 13, color: theme.muted, margin: "8px 0" }}>{profile.bio}</p>}
<div style={{ display: "flex", gap: 8, marginTop: 6 }}>
  {profile?.github && <a href={profile.github} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: theme.accent, textDecoration: "none", fontWeight: 600 }}>GitHub →</a>}
  {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: theme.accent, textDecoration: "none", fontWeight: 600 }}>LinkedIn →</a>}
</div>
                        </div>
                        <button onClick={() => { setEditMode(true); setEditName(profile?.name || ""); setEditSkills(profile?.skills || "");
                          setEditBio(profile?.bio || "");
setEditExperience(profile?.experience || "");
setEditGithub(profile?.github || "");
setEditLinkedin(profile?.linkedin || "");
                         }} className="hm-btn-ghost" style={ghostBtn}>Edit Profile</button>
                      </div>
                      <div>{profile?.skills?.split(",").map((s, i) => <SkillBadge key={i} skill={s} highlight theme={theme} />)}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "24px 0 14px" }}>
              <h3 style={{ fontWeight: 700, fontSize: 12, color: theme.muted, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Top Team Matches</h3>
              <span style={{ fontSize: 11, color: theme.muted }}>{topMatches.length} found</span>
            </div>

            {topMatches.length === 0 && <div style={{ ...cardStyle, textAlign: "center", color: theme.muted, padding: 40 }}>No matches yet — update your skills! 🎯</div>}
            {topMatches.map(m => {
              const members = safeMembers(m.team.members);
              const alreadyIn = joinedTeams.includes(m.team.id) || members.includes(profile?.name);
              return (
                <div key={m.team.id} style={{ ...cardStyle, border: `1px solid ${theme.accent}22`, background: `linear-gradient(135deg, ${theme.card}, ${theme.cardAlt})` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 800, fontSize: 16, color: theme.text, margin: "0 0 3px" }}>{m.team.team_name}</h3>
                      {m.team.description && <p style={{ fontSize: 13, color: theme.muted, margin: "0 0 6px" }}>{m.team.description}</p>}
                      <p style={{ fontSize: 11, color: theme.muted, marginBottom: 8 }}>by {m.team.created_by || "Anonymous"} · {members.length} members</p>
                      <div>{m.team.required_skills?.split(",").map((s, i) => <SkillBadge key={i} skill={s} theme={theme} />)}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 12 }}>
                      <button onClick={() => handleJoinTeam(m.team)} style={joinBtn(alreadyIn)}>{alreadyIn ? "✓ Joined" : "Join"}</button>
                      <button onClick={() => setActiveChat(m.team)} style={{ ...joinBtn(false), borderColor: theme.accent + "44" }}>💬 Chat</button>
                    </div>
                  </div>
                  <MatchBar percent={m.percent} theme={theme} />
                </div>
              );
            })}

            <h3 style={{ fontWeight: 700, fontSize: 12, color: theme.muted, margin: "28px 0 14px", letterSpacing: 1.5, textTransform: "uppercase" }}>Platform Stats</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[{ label: "Users", value: users.length, icon: "👥" }, { label: "Teams", value: teams.length, icon: "🏆" }, { label: "Best Match", value: (topMatches[0]?.percent ?? 0) + "%", icon: "⚡" }].map((s, i) => (
                <div key={i} style={{ ...cardStyle, textAlign: "center", padding: 20, marginBottom: 0 }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: theme.accent, letterSpacing: "-1px" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: theme.muted, letterSpacing: 1, fontWeight: 600, marginTop: 2 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 1 && (
          <div>
            <input className="hm-input" className="hm-input" style={{ ...inputStyle, marginBottom: 16 }} placeholder="🔍 Search by name or skill..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
            {filteredUsers.length === 0 && <div style={{ ...cardStyle, textAlign: "center", color: theme.muted, padding: 40 }}>No users found</div>}
            {filteredUsers.map(u => (
              <div key={u.id} className="hm-card" className="hm-card" style={cardStyle}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <Avatar className="hm-avatar" name={u.name} size={46} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 15, color: theme.text, margin: 0 }}>{u.name}</h3>
                      {u.auth_id === currentUser?.id && <span style={{ fontSize: 10, background: theme.accent + "18", color: theme.accent, border: `1px solid ${theme.accent}44`, borderRadius: 99, padding: "2px 10px", fontWeight: 700 }}>You</span>}
                    </div>
                    <div>{u.skills?.split(",").map((s, i) => <SkillBadge key={i} skill={s} theme={theme} />)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 2 && (
          <div>
            <input className="hm-input" className="hm-input" style={{ ...inputStyle, marginBottom: 16 }} placeholder="🔍 Search teams or skills..." value={teamSearch} onChange={e => setTeamSearch(e.target.value)} />
            {filteredTeams.length === 0 && <div style={{ ...cardStyle, textAlign: "center", color: theme.muted, padding: 40 }}>No teams found</div>}
            {filteredTeams.map(t => {
              const members = safeMembers(t.members);
              const match = getMatchPercent(profile?.skills || "", t.required_skills);
              const alreadyIn = joinedTeams.includes(t.id) || members.includes(profile?.name);
              const isLeader = t.creator_id === currentUser?.id;
              return (
                <div key={t.id} className="hm-card" className="hm-card" style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <h3 style={{ fontWeight: 800, fontSize: 16, color: theme.text, margin: 0 }}>{t.team_name}</h3>
                        {isLeader && <span style={{ fontSize: 10, background: "#f59e0b18", color: "#f59e0b", border: "1px solid #f59e0b44", borderRadius: 99, padding: "2px 8px", fontWeight: 700 }}>👑 Leader</span>}
                      </div>
                      {t.description && <p style={{ fontSize: 13, color: theme.muted, margin: "0 0 6px" }}>{t.description}</p>}
                      <p style={{ fontSize: 11, color: theme.muted, marginBottom: 8 }}>by {t.created_by || "Anonymous"} · {members.length} members</p>
                      <div style={{ marginBottom: 8 }}>{t.required_skills?.split(",").map((s, i) => <SkillBadge key={i} skill={s} theme={theme} />)}</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {members.map((m, i) => <span key={i} style={{ fontSize: 11, color: theme.muted, background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 99, padding: "2px 8px" }}>{m}</span>)}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 12 }}>
                      {match > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: match >= 80 ? "#10b981" : match >= 50 ? "#f59e0b" : "#ef4444", background: (match >= 80 ? "#10b981" : match >= 50 ? "#f59e0b" : "#ef4444") + "15", borderRadius: 99, padding: "2px 10px" }}>{match}%</span>}
                      <button onClick={() => handleJoinTeam(t)} style={joinBtn(alreadyIn)}>{alreadyIn ? "✓ Joined" : "Join"}</button>
                      <button onClick={() => setActiveChat(t)} style={{ ...joinBtn(false) }}>💬 Chat</button>
                      {isLeader && <button onClick={() => setSuggestTeam(t)} style={{ padding: "7px 16px", borderRadius: 9, border: "1px solid #f59e0b44", background: "#f59e0b11", color: "#f59e0b", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✨ Find Members</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 3 && (
          <Chat joinedTeams={joinedTeams} currentUser={currentUser} profile={profile} theme={theme} allTeams={teams} />
        )}

        {tab === 4 && (
          <div>
            <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${theme.card}, ${theme.cardAlt})` }}>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: theme.text, margin: "0 0 6px" }}>Create a Team</h2>
              <p style={{ fontSize: 13, color: theme.muted, margin: "0 0 24px" }}>Build your dream team and win together 🏆</p>
              <input placeholder="Team Name" value={teamName} onChange={e => setTeamName(e.target.value)} className="hm-input" className="hm-input" style={{ ...inputStyle, marginBottom: 12 }} />
              <input placeholder="Required Skills (e.g. React, Node, ML)" value={teamSkills} onChange={e => setTeamSkills(e.target.value)} className="hm-input" className="hm-input" style={{ ...inputStyle, marginBottom: 12 }} />
              <textarea placeholder="Description (optional)" value={teamDesc} onChange={e => setTeamDesc(e.target.value)} className="hm-input" className="hm-input" style={{ ...inputStyle, height: 90, resize: "none", marginBottom: 20, paddingTop: 12 }} />
              <button onClick={handleCreateTeam} disabled={creating} style={{ ...primaryBtn, width: "100%", padding: "14px", fontSize: 15 }}>
                {creating ? "Creating..." : "🚀 Create Team"}
              </button>
            </div>

            <h3 style={{ fontWeight: 700, fontSize: 12, color: theme.muted, margin: "24px 0 14px", letterSpacing: 1.5, textTransform: "uppercase" }}>Find People by Skill</h3>
            <input className="hm-input" className="hm-input" style={{ ...inputStyle, marginBottom: 16 }} placeholder="🔍 Type a skill..." value={searchSkills} onChange={e => setSearchSkills(e.target.value)} />
            {searchSkills && users.filter(u => u.skills?.toLowerCase().includes(searchSkills.toLowerCase())).map(u => (
              <div key={u.id} className="hm-card" className="hm-card" style={cardStyle}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <Avatar className="hm-avatar" className="hm-avatar" name={u.name} size={42} />
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 14, color: theme.text, margin: "0 0 6px" }}>{u.name}</h3>
                    <div>{u.skills?.split(",").map((s, i) => <SkillBadge key={i} skill={s} highlight={s.toLowerCase().includes(searchSkills.toLowerCase())} theme={theme} />)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeChat && <Chat team={activeChat} userName={profile?.name || "Anonymous"} onClose={() => setActiveChat(null)} theme={theme} />}
      </main>
    </div>
  );
}

const dark = {
  bg: "#0a0118", card: "#130727", cardAlt: "#1e0f35", border: "#3b1f6a",
  text: "#f1e8ff", muted: "#8b6aaa", accent: "#a855f7", accentBg: "#2d1052", accentBorder: "#7c3aed44",
};

const light = {
  bg: "#f8f5ff", card: "#ffffff", cardAlt: "#f3f0ff", border: "#ede9fe",
  text: "#0f172a", muted: "#7c6a94", accent: "#7c3aed", accentBg: "#f3f0ff", accentBorder: "#ddd6fe",
};