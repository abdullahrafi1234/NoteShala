import { DocCategory } from "../interfaces";

export const category: DocCategory = {
  id: "mission-Final",
  title: "Mission-5: NoteShala Application",
  icon: "",
  order: 1,
  sections: [
    {
      id: "NoteShala",
      title: "NoteShala",
      order: 1,
      markdownFile: "NoteShala.md",
      categoryId: "mission-5",
    },
    // {
    //   id: "js-data-transform",
    //   title: "Module-2: JavaScript Data Transformation and Aggregation",
    //   order: 1,
    //   markdownFile: "module-2.md",
    //   categoryId: "mission-1",
    // },
    // {
    //   id: "Data-Structures-that-Actually-Matter",
    //   title: "Module-3: Data Structures that Actually Matter",
    //   order: 1,
    //   markdownFile: "module-3.md",
    //   categoryId: "mission-1",
    // },
  ],
};
