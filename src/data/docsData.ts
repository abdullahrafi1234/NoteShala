// src/data/docsContent.ts  (বা docsData.ts)

export interface DocSection {
  id: string;
  title: string;
  content: string;
  category: string;
  order: number;
}

export interface DocCategory {
  id: string;
  title: string;
  icon: string;
  order: number;
  sections: DocSection[];
}

export const docsData: DocCategory[] = [
  {
    id: "mission-1",
    title: "Mission 1: Be A Critical Thinker With JS",
    icon: "🧠",
    order: 1,
    sections: [
      {
        id: "intro-critical-thinking",
        title: "Module 1: Introduction to Critical Thinking",
        category: "mission-1",
        order: 1,
        content: `# Introduction to Critical Thinking

Welcome to Mission 1! This module focuses on developing critical thinking skills through JavaScript.

## Why Critical Thinking Matters

... (তোমার full markdown content এখানে paste করো)
`,
      },
      // অন্য sections add করো
    ],
  },
  // অন্য missions add করো
];

// এই functions গুলো export করতেই হবে!
export const getAllSections = (): DocSection[] => {
  return docsData.flatMap((category) => category.sections);
};

export const getSectionById = (id: string): DocSection | undefined => {
  return getAllSections().find((section) => section.id === id);
};

// যদি আরও functions থাকে (getCategoryById, searchDocs ইত্যাদি) সেগুলোও export করো
