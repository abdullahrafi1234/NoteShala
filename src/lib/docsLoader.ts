// // src/lib/docsLoader.ts

// import { docsData } from "@/data/docsData";

// export const getSectionById = (id: string) => {
//   return docsData
//     .flatMap((category) => category.sections)
//     .find((section) => section.id === id);
// };

import { DocCategory, DocSection } from "../components/docs/interfaces";

// Glob দিয়ে সব meta.ts automatically import করো
const metaModules = import.meta.glob("./*/meta.ts", { eager: true });

const categories: DocCategory[] = [];

for (const path in metaModules) {
  const module = metaModules[path] as { category: DocCategory };
  const category = module.category;

  // sections-এ categoryId set করো (যদি না থাকে)
  category.sections.forEach((sec) => {
    sec.categoryId = category.id;
  });

  categories.push(category);
}

// Order অনুযায়ী sort করো
categories.sort((a, b) => a.order - b.order);
categories.forEach((cat) => cat.sections.sort((a, b) => a.order - b.order));

export const docsData = categories;

export const getAllSections = (): DocSection[] => {
  return docsData.flatMap((cat) => cat.sections);
};

export const getSectionById = (id: string): DocSection | undefined => {
  return getAllSections().find((sec) => sec.id === id);
};

export const getCategoryById = (id: string): DocCategory | undefined => {
  return docsData.find((cat) => cat.id === id);
};
