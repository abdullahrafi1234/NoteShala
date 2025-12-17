// export const loadMarkdownContent = async (
//   markdownPath: string
// ): Promise<string> => {
//   try {
//     const fullPath = `/src/docs/${markdownPath}?raw`; // path adjust করো if needed
//     const content = await import(/* @vite-ignore */ fullPath);
//     return content.default as string;
//   } catch (err) {
//     return "Error loading content";
//   }
// };
export const loadMarkdownContent = async (path: string): Promise<string> => {
  try {
    // path like './mission-1/module-1.md'
    const content = await import(/* @vite-ignore */ `${path}?raw`);
    return content.default as string;
  } catch (err) {
    console.error("Load failed:", path, err);
    return "# Error Loading Content\nFile not found.";
  }
};
