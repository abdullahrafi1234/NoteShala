"use client";
import DocsLayout from "@/components/DocsLayout";
import { useState } from "react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DocsLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  );
}
