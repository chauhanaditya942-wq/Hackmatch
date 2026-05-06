import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";

export default function Chat({ team, userName, onClose, theme }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    // 1. Defining fetchMessages inside to avoid dependency issues
    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("team_id", team.id)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    }

    fetchMessages();

    const channel = supabase
      .channel("team-chat-" + team.id)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `team_id=eq.${team.id}`, // Using template literal for cleaner code
        },
        function (payload) {
          setMessages(function (prev) {
            // Preventing duplicate messages if Supabase fires twice
            const exists = prev.find(m => m.id === payload.new.id);
            if (exists) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return function () {
      supabase.removeChannel(channel);
    };
    // 2. Added team.id explicitly and kept it simple
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team.id]); 

  useEffect(function () {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function sendMessage() {
    if (!newMsg.trim()) return;
    try {
      await supabase.from("messages").insert([
        {
          team_id: team.id,
          user_name: userName,
          message: newMsg.trim(),
        },
      ]);
      setNewMsg("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 20,
        width: 320,
        height: 420,
        background: theme.card,
        border: "1px solid #6366f144",
        borderRadius: "16px 16px 0 0",
        display: "flex",
        flexDirection: "column",
        zIndex: 999,
        boxShadow: "0 -4px 30px #00000066",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #ffffff0f",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: "16px 16px 0 0",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>
          💬 {team.team_name}
        </span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: theme.muted,
              fontSize: 13,
              marginTop: 20,
            }}
          >
            No messages yet. Say hello! 👋
          </p>
        )}
        {messages.map(function (m) {
          const isMe = m.user_name === userName;
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
              }}
            >
              {!isMe && (
                <span
                  style={{
                    fontSize: 10,
                    color: theme.muted,
                    marginBottom: 2,
                  }}
                >
                  {m.user_name}
                </span>
              )}
              <div
                style={{
                  maxWidth: "80%",
                  padding: "8px 12px",
                  borderRadius: isMe
                    ? "12px 12px 2px 12px"
                    : "12px 12px 12px 2px",
                  background: isMe ? "#6366f1" : theme.cardAlt,
                  color: isMe ? "#fff" : theme.text,
                  fontSize: 13,
                }}
              >
                {m.message}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: 12,
          borderTop: "1px solid #ffffff0f",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={newMsg}
          onChange={function (e) { setNewMsg(e.target.value); }}
          onKeyDown={function (e) { if (e.key === "Enter") sendMessage(); }}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 8,
            background: theme.cardAlt,
            border: "1px solid #ffffff0f",
            color: theme.text,
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            background: "#6366f1",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}