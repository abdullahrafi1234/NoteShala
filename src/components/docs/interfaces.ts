export interface DocSection {
  id: string;
  title: string;
  order: number;
  markdownFile: string; // e.g., "module-1.md"
  categoryId: string;
  markdownPath?: string; // runtime-এ add হবে
  content?: string;
}

export interface DocCategory {
  id: string;
  title: string;
  icon: string;
  order: number;
  sections: DocSection[];
}
