import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";

export default function Chat({ joinedTeams, currentUser, profile, theme, allTeams, onBack }) {
  const [activeTeam, setActiveTeam] = useState(null);
  const [activeTeamData, setActiveTeamData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [members, setMembers] = useState([]);
  const [coLeaders, setCoLeaders] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const bottomRef = useRef(null);

  function safeArr(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; }
    catch { return raw.split(",").map(s => s.trim()).filter(Boolean); }
  }

  const myTeams = allTeams.filter(function(t) {
    const mems = safeArr(t.members);
    return mems.includes(profile?.name) || joinedTeams.includes(t.id);
  });

  useEffect(function() {
    if (myTeams.length > 0 && !activeTeam) {
      setActiveTeam(myTeams[0]);
      setActiveTeamData(myTeams[0]);
    }
  }, [allTeams]);

  useEffect(function() {
    if (!activeTeam) return;
    fetchMessages();
    refreshTeamData(activeTeam.id);
    const channel = supabase
      .channel("chat-" + activeTeam.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: "team_id=eq." + activeTeam.id },
        function(payload) {
          setMessages(function(prev) { return [...prev, payload.new]; });
          markSeen(payload.new);
        })
      .subscribe();
    return function() { supabase.removeChannel(channel); };
  }, [activeTeam]);

  useEffect(function() {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function refreshTeamData(teamId) {
    const { data } = await supabase.from("teams").select("*").eq("id", teamId).single();
    if (data) {
      setActiveTeamData(data);
      setMembers(safeArr(data.members));
      setCoLeaders(safeArr(data.co_leaders));
    }
  }

  async function fetchMessages() {
    const { data } = await supabase.from("messages").select("*")
      .eq("team_id", activeTeam.id).order("created_at", { ascending: true });
    setMessages(data || []);
  }

  async function markSeen(msg) {
    if (!msg || !profile) return;
    const seenBy = msg.seen_by ? (Array.isArray(msg.seen_by) ? msg.seen_by : JSON.parse(msg.seen_by)) : [];
    if (!seenBy.includes(profile.name)) {
      seenBy.push(profile.name);
      await supabase.from("messages").update({ seen_by: JSON.stringify(seenBy) }).eq("id", msg.id);
    }
  }

  async function sendMessage() {
    if (!newMsg.trim() || !activeTeam || !profile) return;
    await supabase.from("messages").insert([{
      team_id: activeTeam.id,
      user_name: profile.name,
      message: newMsg.trim(),
      seen_by: JSON.stringify([profile.name])
    }]);
    setNewMsg("");
  }

  // ── Leader Actions ──────────────────────────────────────────────────────────
  async function handleMakeCoLeader(memberName) {
    const updated = [...coLeaders, memberName];
    await supabase.from("teams").update({ co_leaders: JSON.stringify(updated) }).eq("id", activeTeam.id);
    setCoLeaders(updated);
    await refreshTeamData(activeTeam.id);
  }

  async function handleRemoveCoLeader(memberName) {
    const updated = coLeaders.filter(c => c !== memberName);
    await supabase.from("teams").update({ co_leaders: JSON.stringify(updated) }).eq("id", activeTeam.id);
    setCoLeaders(updated);
    await refreshTeamData(activeTeam.id);
  }

  async function handleKickMember(memberName) {
    const updatedMembers = members.filter(m => m !== memberName);
    const updatedCoLeaders = coLeaders.filter(c => c !== memberName);
    const kicked = safeArr(activeTeamData?.kicked_members);
    kicked.push(memberName);
    await supabase.from("teams").update({
      members: JSON.stringify(updatedMembers),
      co_leaders: JSON.stringify(updatedCoLeaders),
      kicked_members: JSON.stringify(kicked)
    }).eq("id", activeTeam.id);
    await refreshTeamData(activeTeam.id);
  }

  function getInitials(name) { return (name || "?")[0].toUpperCase(); }
  function formatTime(ts) {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  function isSeen(msg) {
    const s = msg.seen_by ? (Array.isArray(msg.seen_by) ? msg.seen_by : JSON.parse(msg.seen_by || "[]")) : [];
    return s.filter(n => n !== msg.user_name).length > 0;
  }

  const colors = ["#7c3aed","#10b981","#3b82f6","#f59e0b","#ec4899","#06b6d4"];
  function getColor(name) { return colors[(name || "?").charCodeAt(0) % colors.length]; }

  const isLeader = activeTeamData?.creator_id === currentUser?.id;
  const isCoLeader = coLeaders.includes(profile?.name);
  const canManage = isLeader; // only leader can manage

  if (myTeams.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 48 }}>💬</div>
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Join a team to start chatting!</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 120px)", minHeight: 500, borderRadius: 16, overflow: "hidden", border: "1px solid #ede9fe" }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 230, background: "#1e1333", display: "flex", flexDirection: "column", flexShrink: 0 }}>

        {/* Header */}
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #ffffff10", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={function() { if (onBack) onBack(); }}
            style={{ background: "#ffffff15", border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "#c4b5fd", flexShrink: 0 }}>
            ←
          </button>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>My Teams</div>
            <div style={{ color: "#a78bfa", fontSize: 10 }}>{myTeams.length} joined</div>
          </div>
        </div>

        {/* Teams list */}
        <div style={{ padding: "10px 0", borderBottom: "1px solid #ffffff10" }}>
          <div style={{ padding: "0 10px 6px", color: "#6d5a9e", fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>TEAMS</div>
          {myTeams.map(function(t) {
            const isActive = activeTeam?.id === t.id;
            return (
              <div key={t.id} onClick={function() { setActiveTeam(t); setActiveTeamData(t); refreshTeamData(t.id); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, margin: "2px 8px", cursor: "pointer", background: isActive ? "#7c3aed33" : "transparent" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: getColor(t.team_name), flexShrink: 0 }} />
                <span style={{ color: isActive ? "#fff" : "#c4b5fd", fontSize: 12, fontWeight: isActive ? 700 : 500 }}>{t.team_name}</span>
              </div>
            );
          })}
        </div>

        {/* Leaderboard toggle */}
        {activeTeam && (
          <div style={{ padding: "10px 10px 0" }}>
            <button onClick={() => setShowLeaderboard(!showLeaderboard)}
              style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid #7c3aed44", background: showLeaderboard ? "#7c3aed33" : "transparent", color: "#a78bfa", fontSize: 11, fontWeight: 700, cursor: "pointer", textAlign: "left", letterSpacing: 0.5 }}>
              {showLeaderboard ? "💬 Show Chat" : "🏆 Leaderboard"}
            </button>
          </div>
        )}

        {/* Members / Leaderboard */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {activeTeam && (
            <>
              <div style={{ padding: "10px 10px 6px", color: "#6d5a9e", fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>
                MEMBERS — {members.length}
              </div>

              {/* Leader first */}
              {members.map(function(m, i) {
                const mIsLeader = activeTeamData?.created_by === m;
                const mIsCoLeader = coLeaders.includes(m);
                const isMe = m === profile?.name;

                let roleBadge = null;
                if (mIsLeader) roleBadge = { label: "👑 Leader", color: "#f59e0b" };
                else if (mIsCoLeader) roleBadge = { label: "⭐ Co-Leader", color: "#818cf8" };

                return (
                  <div key={i} style={{ padding: "6px 12px", margin: "2px 6px", borderRadius: 10, background: isMe ? "#7c3aed11" : "transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: getColor(m), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 10, flexShrink: 0 }}>
                        {getInitials(m)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: isMe ? "#fff" : "#a78bfa", fontSize: 11, fontWeight: isMe ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {m} {isMe && <span style={{ color: "#6d5a9e", fontSize: 9 }}>(you)</span>}
                        </div>
                        {roleBadge && (
                          <div style={{ fontSize: 9, color: roleBadge.color, fontWeight: 700, marginTop: 1 }}>{roleBadge.label}</div>
                        )}
                      </div>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                    </div>

                    {/* Leader controls — only show for non-leader members */}
                    {canManage && !mIsLeader && (
                      <div style={{ display: "flex", gap: 4, marginTop: 5, marginLeft: 36 }}>
                        {mIsCoLeader ? (
                          <button onClick={() => handleRemoveCoLeader(m)}
                            style={{ fontSize: 9, padding: "2px 7px", borderRadius: 6, border: "1px solid #818cf844", background: "#818cf811", color: "#818cf8", cursor: "pointer" }}>
                            − Co-Leader
                          </button>
                        ) : (
                          <button onClick={() => handleMakeCoLeader(m)}
                            style={{ fontSize: 9, padding: "2px 7px", borderRadius: 6, border: "1px solid #818cf844", background: "#818cf811", color: "#818cf8", cursor: "pointer" }}>
                            + Co-Leader
                          </button>
                        )}
                        <button onClick={() => { if (window.confirm("Kick " + m + "?")) handleKickMember(m); }}
                          style={{ fontSize: 9, padding: "2px 7px", borderRadius: 6, border: "1px solid #ef444444", background: "#ef444411", color: "#fca5a5", cursor: "pointer" }}>
                          Kick
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ── Main Area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff" }}>
        {activeTeam && (
          <>
            {/* Header */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #ede9fe", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${getColor(activeTeam.team_name)}, #a855f7)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>
                {getInitials(activeTeam.team_name)}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{activeTeam.team_name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>
                  {activeTeam.required_skills}
                  {isLeader && <span style={{ marginLeft: 6, color: "#f59e0b", fontWeight: 700 }}>· 👑 You are Leader</span>}
                  {isCoLeader && !isLeader && <span style={{ marginLeft: 6, color: "#818cf8", fontWeight: 700 }}>· ⭐ Co-Leader</span>}
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 99, color: "#16a34a", fontSize: 11, fontWeight: 600 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                {members.length} members
              </div>
            </div>

            {/* Leaderboard view */}
            {showLeaderboard ? (
              <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#faf9ff" }}>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 16 }}>🏆 Team Leaderboard</h3>
                {members.map(function(m, i) {
                  const mIsLeader = activeTeamData?.created_by === m;
                  const mIsCoLeader = coLeaders.includes(m);
                  let position = i + 1;
                  let roleLabel = "Member";
                  let roleColor = "#64748b";
                  let roleBg = "#f1f5f9";
                  let medal = "👤";

                  if (mIsLeader) { roleLabel = "Leader"; roleColor = "#f59e0b"; roleBg = "#fef3c7"; medal = "👑"; }
                  else if (mIsCoLeader) { roleLabel = "Co-Leader"; roleColor = "#7c3aed"; roleBg = "#ede9fe"; medal = "⭐"; }
                  else if (position === 2) medal = "🥈";
                  else if (position === 3) medal = "🥉";

                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 14, marginBottom: 10, background: mIsLeader ? "#fef9e7" : mIsCoLeader ? "#f5f3ff" : "#fff", border: `1px solid ${mIsLeader ? "#f59e0b33" : mIsCoLeader ? "#7c3aed22" : "#e2e8f0"}` }}>
                      <span style={{ fontSize: 22, width: 30, textAlign: "center" }}>{medal}</span>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: getColor(m), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                        {getInitials(m)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{m}</div>
                        <div style={{ fontSize: 11, color: roleColor, fontWeight: 600 }}>{roleLabel}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: roleBg, color: roleColor }}>
                        #{position}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Chat view */
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16, background: "#faf9ff" }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 40 }}>
                    No messages yet. Say hello! 👋
                  </div>
                )}
                {messages.map(function(msg) {
                  const isMe = msg.user_name === profile?.name;
                  const seen = isSeen(msg);
                  const senderIsLeader = activeTeamData?.created_by === msg.user_name;
                  const senderIsCoLeader = coLeaders.includes(msg.user_name);
                  return (
                    <div key={msg.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: isMe ? "row-reverse" : "row" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: getColor(msg.user_name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>
                        {getInitials(msg.user_name)}
                      </div>
                      <div style={{ maxWidth: "65%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexDirection: isMe ? "row-reverse" : "row" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: isMe ? "#7c3aed" : getColor(msg.user_name) }}>
                            {isMe ? "You" : msg.user_name}
                          </span>
                          {senderIsLeader && <span style={{ fontSize: 9 }}>👑</span>}
                          {senderIsCoLeader && !senderIsLeader && <span style={{ fontSize: 9 }}>⭐</span>}
                          <span style={{ fontSize: 10, color: "#94a3b8" }}>{formatTime(msg.created_at)}</span>
                        </div>
                        <div style={{ padding: "10px 14px", borderRadius: isMe ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: isMe ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#fff", color: isMe ? "#fff" : "#0f172a", fontSize: 13, lineHeight: 1.5, border: isMe ? "none" : "1px solid #ede9fe" }}>
                          {msg.message}
                        </div>
                        {isMe && (
                          <div style={{ textAlign: "right", fontSize: 10, color: seen ? "#7c3aed" : "#94a3b8", marginTop: 3 }}>
                            {seen ? "✓✓ Seen" : "✓ Sent"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}

            {/* Input — only show in chat view */}
            {!showLeaderboard && (
              <div style={{ padding: "14px 20px", borderTop: "1px solid #ede9fe", background: "#fff", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8f7ff", border: "1.5px solid #ede9fe", borderRadius: 12, padding: "10px 14px" }}>
                  <span style={{ fontSize: 20 }}>😊</span>
                  <input
                    value={newMsg}
                    onChange={function(e) { setNewMsg(e.target.value); }}
                    onKeyDown={function(e) { if (e.key === "Enter") sendMessage(); }}
                    placeholder={"Message " + activeTeam.team_name + "..."}
                    style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, color: "#0f172a", outline: "none" }}
                  />
                  <button onClick={sendMessage}
                    style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "#fff", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ➤
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}