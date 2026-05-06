import { useState } from "react";

const SKILL_MAP = {
  "frontend": ["React", "TypeScript", "CSS", "HTML", "JavaScript", "Tailwind"],
  "backend": ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs", "Docker"],
  "ml": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy"],
  "fullstack": ["React", "Node.js", "MongoDB", "Express", "Git", "Docker"],
  "android": ["Kotlin", "Java", "Android SDK", "Firebase", "REST APIs", "Git"],
  "ios": ["Swift", "Xcode", "UIKit", "Firebase", "REST APIs", "Git"],
  "devops": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform"],
  "data": ["Python", "SQL", "Pandas", "Tableau", "Machine Learning", "Excel"],
  "blockchain": ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "React", "Node.js"],
  "design": ["Figma", "Adobe XD", "UI/UX", "Prototyping", "CSS", "Tailwind"],
  "python": ["Python", "Django", "Flask", "PostgreSQL", "REST APIs", "Docker"],
  "react": ["React", "TypeScript", "Redux", "Tailwind", "Git", "REST APIs"],
  "node": ["Node.js", "Express", "MongoDB", "JWT", "REST APIs", "Docker"],
  "cloud": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform"],
  "security": ["Cybersecurity", "Ethical Hacking", "Python", "Linux", "Network Security", "OWASP"],
};

function getSkills(role) {
  const r = role.toLowerCase();
  for (const key of Object.keys(SKILL_MAP)) {
    if (r.includes(key)) return SKILL_MAP[key];
  }
  return ["JavaScript", "Python", "Git", "REST APIs", "Docker", "SQL"];
}

export default function AISuggest({ onSelect, theme }) {
  const [role, setRole] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function getSuggestions() {
    if (!role.trim()) return;
    setSuggestions(getSkills(role));
  }

  return (
    <div style={{ background: theme.card, border: "1px solid #6366f144", borderRadius: 16, padding: 20, marginBottom: 16 }}>
      <h3 style={{ fontWeight: 700, fontSize: 14, color: theme.text, margin: "0 0 12px" }}>Smart Skill Suggestions</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Your role (e.g. Frontend Developer, ML Engineer)"
          value={role}
          onChange={function(e) { setRole(e.target.value); }}
          onKeyDown={function(e) { if (e.key === "Enter") getSuggestions(); }}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: theme.cardAlt, border: "1px solid " + theme.border, color: theme.text, fontSize: 13, outline: "none" }}
        />
        <button onClick={getSuggestions}
          style={{ padding: "10px 16px", borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
          ✨ Suggest
        </button>
      </div>
      {suggestions.length > 0 && (
        <div>
          <p style={{ fontSize: 11, color: theme.muted, marginBottom: 8 }}>Click to add skills:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {suggestions.map(function(skill, i) {
              return (
                <span key={i} onClick={function() { onSelect(skill); }}
                  style={{ padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: "#6366f122", color: "#818cf8", border: "1px solid #6366f144", cursor: "pointer" }}>
                  + {skill}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}