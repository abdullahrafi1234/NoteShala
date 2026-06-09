import { DocCategory } from "../interfaces";

export const category: DocCategory = {
  id: "mission-3",
  title: "Mission-3: Be A Node Express Expert",
  icon: "",
  order: 1,
  sections: [
    {
      id: "How-The-Web-Works",
      title: "Module-9: How The Web Works",
      order: 1,
      markdownFile: "module-9.md",
      categoryId: "mission-3",
    },
    {
      id: "CRUD-Operations-with-Express-TypeScript-PostgresSQL",
      title: "CRUD Operations with Express TypeScript PostgresSQL",
      order: 1,
      markdownFile: "module-12.md",
      categoryId: "mission-3",
    },
    // {
    //   id: "Raw-Node.js-Anatomy",
    //   title: "Raw Node.js Anatomy",
    //   order: 1,
    //   markdownFile: "node-js-anatomy.md",
    //   categoryId: "mission-3",
    // },
  ],
};
