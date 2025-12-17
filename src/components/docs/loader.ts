// src/docs/loader.ts (full updated code)

import { DocCategory } from "./interfaces";

// Meta files load
const metaModules = import.meta.glob("./mission-*/meta.ts", { eager: true });

// Markdown files load as raw string
const mdModules = import.meta.glob("./mission-*/*.md", {
  eager: true,
  as: "raw",
});

const categories: DocCategory[] = [];

for (const path in metaModules) {
  const module = metaModules[path] as { category: DocCategory };
  const category = { ...module.category }; // deep copy

  category.sections = category.sections.map((sec) => {
    // Exact path construct করো যা glob key-এর সাথে match করবে
    // Example: './mission-1/module-1.md'
    // const mdPath = `./mission-${category.order}/${sec.markdownFile}`;
    const mdPath = `./${category.id}/${sec.markdownFile}`;

    const content =
      (mdModules[mdPath] as string) ??
      "# Content Not Found\n\nFile path: " + mdPath;

    return {
      ...sec,
      content, // content add করো
      categoryId: category.id,
    };
  });

  categories.push(category);
}

// Sort by order
categories.sort((a, b) => a.order - b.order);
categories.forEach((cat) => cat.sections.sort((a, b) => a.order - b.order));

export const docsData = categories;

export const getAllSections = () => docsData.flatMap((cat) => cat.sections);

export const getSectionById = (id: string) =>
  getAllSections().find((sec) => sec.id === id);

export const getCategoryById = (id: string) =>
  docsData.find((cat) => cat.id === id);
