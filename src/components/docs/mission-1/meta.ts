import { DocCategory } from "../interfaces";

export const category: DocCategory = {
  id: "mission-1",
  title: "Mission 1: Be A Critical Thinker With JS",
  icon: "🧠",
  order: 1,
  sections: [
    {
      id: "intro-critical-thinking",
      title: "Module 1: Introduction to Critical Thinking and Data Structures",
      order: 1,
      markdownFile: "module-1.md",
      categoryId: "mission-1",
      content: "Module nai",
    },
    {
      id: "js-data-transform",
      title: "Module 2: JavaScript Data Transformation and Aggregation",
      order: 1,
      markdownFile: "module-2.md",
      categoryId: "mission-1",
    },
    {
      id: "3",
      title: "Module 3: Data Structures that Actually Matter",
      order: 1,
      markdownFile: "module-3.md",
      categoryId: "mission-1",
    },
    // অন্য গুলো
  ],
};
