import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";

export default function Chat({ joinedTeams, currentUser, profile, theme, allTeams }) {
  const [activeTeam, setActiveTeam] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [members, setMembers] = useState([]);
  const bottomRef = useRef(null);

  function safeMembers(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; }
    catch { return raw.split(",").map(function(s) { return s.trim(); }).filter(Boolean); }
  }

  const myTeams = allTeams.filter(function(t) {
    const mems = safeMembers(t.members);
    return mems.includes(profile?.name) || joinedTeams.includes(t.id);
  });

  useEffect(function() {
    if (myTeams.length > 0 && !activeTeam) setActiveTeam(myTeams[0]);
  }, [allTeams]);

  useEffect(function() {
    if (!activeTeam) return;
    fetchMessages();
    setMembers(safeMembers(activeTeam.members));
    const channel = supabase
      .channel("chat-" + activeTeam.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: "team_id=eq." + activeTeam.id },
        function(payload) {
          setMessages(function(prev) { return [...prev, payload.new]; });
          markSeen(payload.new);
        }
      )
      .subscribe();
    return function() { supabase.removeChannel(channel); };
  }, [activeTeam]);

  useEffect(function() {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMessages() {
    const { data } = await supabase.from("messages").select("*").eq("team_id", activeTeam.id).order("created_at", { ascending: true });
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

  function getInitials(name) {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  }

  function formatTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function isSeen(msg) {
    const seenBy = msg.seen_by ? (Array.isArray(msg.seen_by) ? msg.seen_by : JSON.parse(msg.seen_by || "[]")) : [];
    return seenBy.filter(function(n) { return n !== msg.user_name; }).length > 0;
  }

  const colors = ["#7c3aed", "#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#06b6d4"];

  function getColor(name) {
    if (!name) return colors[0];
    return colors[name.charCodeAt(0) % colors.length];
  }

  if (myTeams.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 48 }}>💬</div>
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Join a team to start chatting!</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 120px)", minHeight: 500, borderRadius: 16, overflow: "hidden", border: "1px solid #ede9fe" }}>
      <div style={{ width: 220, background: "#1e1333", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 14px", borderBottom: "1px solid #ffffff10" }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>My Teams</div>
          <div style={{ color: "#a78bfa", fontSize: 10, marginTop: 2 }}>{myTeams.length} joined</div>
        </div>

        <div style={{ padding: "12px 0", flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "0 10px 6px", color: "#6d5a9e", fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>TEAMS</div>
          {myTeams.map(function(t) {
            const isActive = activeTeam?.id === t.id;
            return (
              <div key={t.id} onClick={function() { setActiveTeam(t); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, margin: "2px 8px", cursor: "pointer", background: isActive ? "#7c3aed33" : "transparent" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: getColor(t.team_name), flexShrink: 0 }} />
                <span style={{ color: isActive ? "#fff" : "#c4b5fd", fontSize: 12, fontWeight: isActive ? 700 : 500 }}>{t.team_name}</span>
              </div>
            );
          })}

          {activeTeam && (
            <>
              <div style={{ padding: "16px 10px 6px", color: "#6d5a9e", fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>
                MEMBERS — {members.length}
              </div>
              {members.map(function(m, i) {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, margin: "2px 8px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: getColor(m), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 10, flexShrink: 0 }}>
                      {getInitials(m)}
                    </div>
                    <span style={{ color: "#a78bfa", fontSize: 12 }}>{m}</span>
                    {activeTeam.leader_id === profile?.auth_id && (
                      <span style={{ fontSize: 9, color: "#f59e0b", marginLeft: "auto" }}>👑</span>
                    )}
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", marginLeft: "auto" }} />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff" }}>
        {activeTeam && (
          <>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #ede9fe", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${getColor(activeTeam.team_name)}, #a855f7)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>
                {getInitials(activeTeam.team_name)}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{activeTeam.team_name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{activeTeam.required_skills}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 99, color: "#16a34a", fontSize: 11, fontWeight: 600 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                {members.length} members
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16, background: "#faf9ff" }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 40 }}>
                  No messages yet. Say hello! 👋
                </div>
              )}
              {messages.map(function(msg) {
                const isMe = msg.user_name === profile?.name;
                const seen = isSeen(msg);
                return (
                  <div key={msg.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: isMe ? "row-reverse" : "row" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: getColor(msg.user_name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                      {getInitials(msg.user_name)}
                    </div>
                    <div style={{ maxWidth: "65%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexDirection: isMe ? "row-reverse" : "row" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: isMe ? "#7c3aed" : getColor(msg.user_name) }}>{isMe ? "You" : msg.user_name}</span>
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

            <div style={{ padding: "14px 20px", borderTop: "1px solid #ede9fe", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8f7ff", border: "1.5px solid #ede9fe", borderRadius: 12, padding: "10px 14px" }}>
                <span style={{ fontSize: 20, cursor: "pointer" }}>😊</span>
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
          </>
        )}
      </div>
    </div>
  );
}