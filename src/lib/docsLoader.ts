// src/lib/docsLoader.ts

import { docsData } from "@/data/docsData";

export const getSectionById = (id: string) => {
  return docsData
    .flatMap((category) => category.sections)
    .find((section) => section.id === id);
};
