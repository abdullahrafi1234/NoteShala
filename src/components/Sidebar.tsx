"use client";
import { useState } from "react";

export default function Sidebar({
  setActiveSection,
  searchQuery,
  setSearchQuery,
}) {
  const [openMission, setOpenMission] = useState(null);

  return (
    <div>
      <input
        placeholder="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button onClick={() => setOpenMission("mission-1")}>Mission 1</button>

      {openMission === "mission-1" && (
        <button onClick={() => setActiveSection("intro-critical-thinking")}>
          Intro to Critical Thinking
        </button>
      )}
    </div>
  );
}
