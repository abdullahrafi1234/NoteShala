# NoteShala — সম্পূর্ণ Project Documentation

> **NoteShala** হলো একটি React + TypeScript দিয়ে বানানো Docs/Notes Viewer App। এটি 6-Month Next Level Web Development Bootcamp এর সব notes সুন্দরভাবে দেখানোর জন্য তৈরি করা হয়েছে।

**Live Link:** https://noteshala-78deb.web.app/
**GitHub:** https://github.com/abdullahrafi1234/NoteShala

---

## 📁 Project Structure

```json
src/
├── components/
│   ├── docs/
│   │   ├── mission-0/          ← Mission 0 এর markdown files
│   │   ├── mission-1/          ← Mission 1 এর markdown files
│   │   ├── mission-2/
│   │   ├── mission-3/
│   │   ├── BackToTop.tsx       ← Page এর উপরে scroll করার button
│   │   ├── Breadcrumb.tsx      ← Navigation breadcrumb
│   │   ├── DocContent.tsx      ← Doc page এর main content
│   │   ├── LiveTimer.tsx       ← Real-time reading timer
│   │   ├── MarkdownRenderer.tsx← Markdown কে HTML এ render করে
│   │   ├── MissionCard.tsx     ← Welcome page এর mission card
│   │   ├── MobileSidebar.tsx   ← Mobile এ sidebar (Sheet)
│   │   ├── OverallStats.tsx    ← Progress stats card
│   │   ├── SearchDialog.tsx    ← Search modal
│   │   ├── Sidebar.tsx         ← Desktop sidebar
│   │   ├── TableOfContents.tsx ← Right side TOC
│   │   ├── WelcomePage.tsx     ← /docs home page
│   │   ├── cardTheme.ts        ← Mission card এর icon theme
│   │   ├── interfaces.ts       ← TypeScript interfaces
│   │   └── loader.ts           ← Markdown file loader
│   ├── home/
│   │   ├── HeroSection.tsx     ← Home page hero
│   │   └── TechStackSection.tsx← Tech stack cards
│   └── layout/
│       └── Navbar.tsx          ← Top navigation bar
├── hooks/
│   └── useReadingStats.ts      ← Reading time tracking hook
├── pages/
│   ├── Docs.tsx                ← /docs route
│   ├── Index.tsx               ← / route (home)
│   └── NotFound.tsx            ← 404 page
├── App.tsx                     ← Routes setup
├── main.tsx                    ← App entry point
└── index.css                   ← Global styles + Tailwind
```

---

## 🚀 Tech Stack

| Technology          | কেন ব্যবহার করা হয়েছে                |
| ------------------- | ------------------------------------- |
| React 18            | UI framework                          |
| TypeScript          | Type safety                           |
| Vite                | Fast build tool                       |
| Tailwind CSS        | Styling                               |
| shadcn/ui           | UI components (Button, Dialog, Sheet) |
| react-router-dom v6 | Client-side routing                   |
| react-markdown      | Markdown render                       |
| shiki               | VS Code-style syntax highlighting     |
| next-themes         | Dark/Light mode                       |
| lucide-react        | Icons                                 |
| Firebase            | Hosting                               |

---

## 📄 File-by-File Documentation

---

### `main.tsx` — App Entry Point

```tsx
import { ThemeProvider } from "next-themes";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <App />
  </ThemeProvider>,
);
```

**কী করে:**

- `createRoot` দিয়ে React app কে `#root` div এ mount করে
- `ThemeProvider` দিয়ে পুরো app কে wrap করা হয়েছে যাতে dark/light mode কাজ করে
- `attribute="class"` মানে theme বদলালে `<html>` tag এ `class="dark"` বা `class="light"` যোগ হবে
- `defaultTheme="dark"` — app সবসময় dark mode এ শুরু হবে
- `enableSystem={false}` — OS এর theme follow করবে না

---

### `App.tsx` — Routes Setup

```tsx
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/:sectionId" element={<Docs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

**কী করে:**

- `QueryClientProvider` — TanStack Query এর জন্য (future use)
- `TooltipProvider` — shadcn tooltip কাজ করার জন্য
- `Toaster` + `Sonner` — notification toast এর জন্য
- Routes:
  - `/` → Home page
  - `/docs` → Docs home (Welcome page)
  - `/docs/:sectionId` → Specific section (same Docs component, params দিয়ে আলাদা করা)
  - `*` → 404 page
- `future` flags — React Router v7 এ migrate হওয়ার আগেই warnings বন্ধ করতে

---

### `index.css` — Global Styles

**কী আছে:**

**১. CSS Variables (Design Tokens)**

```css
:root {
  --background: 210 25% 4%; /* Dark navy background */
  --primary: 190 95% 50%; /* Cyan accent color */
  --card: 210 25% 8%; /* Card background */
}
```

সব color Tailwind এর `hsl()` format এ define করা হয়েছে। এতে `bg-background`, `text-primary` এভাবে use করা যায়।

**২. Light Mode Variables**

```css
.light {
  --background: 210 20% 98%;
  --primary: 190 95% 35%;
}
```

`next-themes` dark/light toggle করলে `<html class="light">` হয়, তখন এই variables apply হয়।

**৩. Custom Components**

```css
.prose-docs { ... }        /* Markdown content styling */
.sidebar-item { ... }      /* Sidebar link styling */
.sidebar-item-active { ... }/* Active sidebar link */
.gradient-text { ... }     /* Cyan gradient text effect */
```

**৪. Animations**

```css
@keyframes fadeIn { ... }
@keyframes fadeInUp { ... }
@keyframes slideInLeft { ... }
.highlight-heading { animation: highlight-glow-cyan ... }
```

Search result এ navigate করলে heading টা cyan glow করে — এটা `highlight-glow-cyan` animation।

**৫. Custom Scrollbar**

```css
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  @apply bg-muted rounded-full;
}
```

---

### `interfaces.ts` — TypeScript Types

```typescript
export interface DocSection {
  id: string; // unique ID (e.g., "raw-node-js")
  title: string; // display title
  order: number; // sort order
  markdownFile: string; // filename (e.g., "raw-node-js.md")
  categoryId: string; // parent category ID
  content?: string; // markdown content (runtime এ add হয়)
}

export interface DocCategory {
  id: string; // e.g., "mission-0"
  title: string; // e.g., "Mission-0: Be A Web Developer"
  icon: string; // emoji icon
  order: number;
  sections: DocSection[];
}
```

**কেন দরকার:**

- TypeScript এ type safety নিশ্চিত করে
- IDE autocompletion পাওয়া যায়
- Bug আগেই ধরা পড়ে

---

### `loader.ts` — Data Loading System

**এটাই Project এর সবচেয়ে গুরুত্বপূর্ণ file।**

```typescript
// Meta files load — প্রতিটা mission এর meta.ts
const metaModules = import.meta.glob("./mission-*/meta.ts", { eager: true });

// Markdown files load as raw string
const mdModules = import.meta.glob("./mission-*/*.md", {
  eager: true,
  as: "raw",
});
```

**কীভাবে কাজ করে:**

১. `import.meta.glob` — Vite এর একটি special feature। এটা দিয়ে pattern match করে multiple file একসাথে import করা যায়।

২. `eager: true` — Build time এ সব file load হয়ে যাবে, runtime এ আলাদা করে fetch লাগবে না। এতে app instant load হয়।

৩. `as: "raw"` — Markdown file গুলো string হিসেবে import হবে (parsed নয়)।

৪. Loop এ প্রতিটা category এর sections এ content যোগ করা হয়:

```typescript
const mdPath = `./${category.id}/${sec.markdownFile}`;
const content = (mdModules[mdPath] as string) ?? "# Content Not Found";
return { ...sec, content, categoryId: category.id };
```

৫. Sort করা হয় `order` field দিয়ে।

**Export functions:**

```typescript
export const docsData = categories;           // সব data
export const getAllSections = () => ...;       // সব section flat list
export const getSectionById = (id) => ...;    // ID দিয়ে section খোঁজা
export const getCategoryById = (id) => ...;   // ID দিয়ে category খোঁজা
```

**Data structure (mission folder):**

```
mission-0/
├── meta.ts          ← category info + sections list
├── raw-node-js.md   ← actual content
└── node-js-anatomy.md
```

`meta.ts` এ থাকে:

```typescript
export const category: DocCategory = {
  id: "mission-0",
  title: "Mission-0: Be A Web Developer",
  icon: "🌐",
  order: 0,
  sections: [
    {
      id: "raw-node-js",
      title: "Raw Node.js Basic to Advanced",
      order: 1,
      markdownFile: "raw-node-js.md",
    },
  ],
};
```

---

### `Docs.tsx` — Documentation Page

**এই file টা পুরো docs section এর main controller।**

```tsx
const Docs = () => {
  const { sectionId } = useParams();
  const { stats, startTimeRef, pausedRef } = useReadingStats(sectionId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar /> {/* Left sidebar */}
        <div className="flex-1 flex">
          <div className="flex-1">
            <MobileSidebar /> {/* Mobile only */}
            <Breadcrumb /> {/* Navigation trail */}
            <LiveTimer /> {/* Reading timer */}
            {/* Reading time badge */}
            {sectionId ? <DocContent /> : <WelcomePage />}
          </div>
          <TableOfContents /> {/* Right TOC (xl screens) */}
        </div>
      </div>
      <BackToTop />
    </div>
  );
};
```

**গুরুত্বপূর্ণ logic:**

- `sectionId` থাকলে → `DocContent` দেখায়
- `sectionId` না থাকলে → `WelcomePage` দেখায়
- `estimateReadingTime()` — word count দিয়ে reading time calculate করে (200 words/min)
- `getTheme(i)` — প্রতিটা section এর জন্য theme color বের করে

---

### `DocContent.tsx` — Section Content Viewer

**কী করে:**

- URL থেকে `sectionId` নেয়
- সেই section এর markdown content দেখায়
- Bookmark add/remove করে
- Previous/Next navigation দেখায়
- `localStorage` এ last visited আর read sections save করে

**Bookmark system:**

```typescript
const BOOKMARK_KEY = "noteshala_bookmarks";

function getBookmarks(): string[] {
  const raw = localStorage.getItem(BOOKMARK_KEY);
  return raw ? JSON.parse(raw) : [];
}

const toggleBookmark = () => {
  const bookmarks = getBookmarks();
  const updated = isBookmarked
    ? bookmarks.filter((id) => id !== section.id) // remove
    : [...bookmarks, section.id]; // add
  saveBookmarks(updated);
  setIsBookmarked(!isBookmarked);
};
```

**Progress tracking:**

```typescript
useEffect(() => {
  // Last visited save
  localStorage.setItem(
    "lastVisited",
    JSON.stringify({ id, title, categoryId }),
  );

  // Read sections save
  const readSections = JSON.parse(localStorage.getItem("readSections") || "[]");
  if (!readSections.includes(section.id)) {
    readSections.push(section.id);
    localStorage.setItem("readSections", JSON.stringify(readSections));
  }
}, [section?.id]);
```

**Toast notification:**
Bookmark add/remove করলে bottom-right এ 2 সেকেন্ডের জন্য toast দেখায়।

---

### `SearchDialog.tsx` — Search System

**কীভাবে কাজ করে:**

১. সব section এর content থেকে searchable items extract করে:

- `#` `##` `###` headings → priority 1, 2, 3
- `**bold**` text → priority 4
- Normal text → priority 5

২. Search query দিলে `.includes()` দিয়ে filter করে priority অনুযায়ী sort করে।

৩. Result click করলে:

- Heading হলে → `navigate("/docs/sectionId#slug")` + scroll + highlight
- Bold/Normal হলে → `navigate("/docs/sectionId")`

````typescript
const extractAll = (section: DocSection): SearchResult[] => {
  for (const line of lines) {
    // Heading match
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);

    // Bold match
    const boldMatches = [...trimmed.matchAll(/\*\*(.*?)\*\*/g)];

    // Normal text (code block বাদ)
    const isCode = trimmed.startsWith("```");
  }
};
````

**Keyboard shortcut:** `Ctrl+K` বা `Cmd+K` দিয়ে search open হয়।

**Slug:** Heading text কে URL-safe id তে convert করে:

```typescript
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");
```

---

### `MarkdownRenderer.tsx` — Markdown Display

**কী করে:**

- `react-markdown` দিয়ে markdown string কে React component এ convert করে
- `shiki` দিয়ে code block এ VS Code-style syntax highlighting (Dracula theme)
- প্রতিটা heading এ `id` যোগ করে (TOC আর Search এর জন্য)
- Copy button যোগ করে প্রতিটা code block এ

**Code block:**

```typescript
const CodeBlock = ({ language, children }) => {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    codeToHtml(children, { lang: language, theme: "dracula" }).then(setHtml);
  }, [children, language]);

  // Copy button — hover এ দেখায়, click এ clipboard এ copy
  // Language badge — top-left এ দেখায়
};
```

**Custom heading render:**

```typescript
h2({ children }) {
  const id = slugify(String(children));
  return <h2 id={id} className="... scroll-mt-20">{children}</h2>;
}
```

`scroll-mt-20` — scroll করে heading এ আসলে navbar এর নিচে দেখাবে।

**Supported elements:**
h1, h2, h3, p, ul, ol, li, blockquote, a, table, thead, th, td, pre, code

---

### `Sidebar.tsx` — Desktop Navigation

**Features:**

- সব Mission আর Section list দেখায়
- Active section highlight করে
- Category collapse/expand করা যায়
- Bookmark করা sections আলাদাভাবে উপরে দেখায়
- Sticky — scroll করলেও সাথে থাকে

```typescript
// Bookmark sync
useEffect(() => {
  const load = () => setBookmarks(getBookmarks());
  load();
  window.addEventListener("storage", load); // অন্য tab এ change হলেও update
  return () => window.removeEventListener("storage", load);
}, []);
```

**Bookmark section:**

- Default এ 1টা দেখায়, "more ↓" click করলে সব দেখায়
- Bookmark icon দিয়ে section marked থাকলে সেই section এর পাশেও icon দেখায়

---

### `MobileSidebar.tsx` — Mobile Navigation

Desktop Sidebar এর mobile version। `shadcn/ui` এর `Sheet` component use করে — left side থেকে slide করে আসে।

**Desktop Sidebar এর সাথে পার্থক্য:**

- `Sheet` (slide panel) ব্যবহার করে, `aside` নয়
- Link click করলে Sheet বন্ধ হয়ে যায়
- `lg:hidden` — শুধু mobile/tablet এ দেখায়

---

### `TableOfContents.tsx` — On-Page Navigation

**কী করে:**

- Current page এর সব `#`, `##`, `###` heading গুলো list করে
- Scroll করলে active heading highlight হয়
- Click করলে সেই heading এ smooth scroll করে

**IntersectionObserver:**

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length > 0) setActiveId(visible[0].target.id);
  },
  { rootMargin: "-80px 0px -60% 0px" },
);
```

`rootMargin` — viewport এর উপরে 80px বাদ দিয়ে, নিচের 60% বাদ দিয়ে — মাঝের অংশে যে heading আছে সেটা active হয়।

**300ms delay:** Content render হওয়ার আগে observer চললে heading element পাওয়া যায় না, তাই একটু wait করা হয়।

---

### `WelcomePage.tsx` — Docs Home

`/docs` route এ গেলে এই page দেখায়।

**কী আছে:**

- Hero section — "Ready to build today?" badge + tagline
- `OverallStats` — progress percentage আর total reading time
- Mission cards grid — প্রতিটা mission এর জন্য `MissionCard`

```typescript
const totalSections = useMemo(
  () => docsData.reduce((sum, cat) => sum + cat.sections.length, 0),
  [],
);
```

**Mount animation:**

```typescript
useEffect(() => {
  const t = setTimeout(() => setMounted(true), 60);
  return () => clearTimeout(t);
}, []);
```

60ms delay দিয়ে mounted করলে CSS animation trigger হয়।

---

### `MissionCard.tsx` — Mission Card Component

**কী দেখায়:**

- Icon (theme অনুযায়ী unique)
- Mission title
- Section list (default 3টা, "more" click করলে বাকিগুলো)
- Top gradient strip (cyan/teal color family)
- Hover করলে radial glow effect
- Corner arrow (hover এ দেখায়)

**See more/less:**

```typescript
const [showAll, setShowAll] = useState(false);
const visibleSections = showAll
  ? category.sections
  : category.sections.slice(0, 3);
const hiddenCount = totalSections - 3;
```

Button click এ `e.preventDefault()` দেওয়া হয়েছে কারণ পুরো card একটা `Link`, button click করলে যেন navigate না হয়।

**Visited section tracking:**

- Visited section এর dot রঙিন হয়
- Last visited section highlighted হয়

---

### `useReadingStats.ts` — Reading Statistics Hook

**কী track করে:**

- `totalMinutes` — মোট কতক্ষণ পড়েছেন
- `visitedSections` — কোন কোন section পড়া হয়েছে
- `lastVisited` — সর্বশেষ কোন section পড়েছেন

**কীভাবে কাজ করে:**

```typescript
// Section change হলে timer reset
startTimeRef.current = Date.now();
pausedRef.current = 0;

// Tab hide হলে timer pause
const handleVisibilityChange = () => {
  if (document.hidden) {
    hiddenAtRef.current = Date.now(); // pause শুরু
  } else {
    pausedRef.current += Date.now() - hiddenAtRef.current; // pause time যোগ
  }
};

// Section leave হলে actual time save
return () => {
  const activeMs = Date.now() - startTimeRef.current - pausedRef.current;
  const activeMinutes = Math.floor(activeMs / 60000);
  if (activeMinutes >= 1) {
    // save to localStorage
  }
};
```

**`useRef` কেন `useState` নয়:**
`startTimeRef` আর `pausedRef` এ `useRef` ব্যবহার করা হয়েছে কারণ এগুলো বদলালে component re-render হওয়া উচিত না।

---

### `LiveTimer.tsx` — Real-time Reading Timer

**কেন আলাদা component:**
`setInterval` প্রতি সেকেন্ডে state update করে। এটা `Docs.tsx` এ থাকলে পুরো page প্রতি সেকেন্ডে re-render হতো এবং page কাঁপত। আলাদা component এ রাখলে শুধু timer টাই re-render হয়।

```typescript
const interval = setInterval(() => {
  if (!document.hidden) {
    const activeMs = Date.now() - startTimeRef.current - pausedRef.current;
    setLiveSeconds(Math.floor(activeMs / 1000));
  }
}, 1000);
```

**Display format:**

```typescript
const label = hours > 0 ? `${hours}h ${mins}m ${secs}s` : `${mins}m ${secs}s`;
```

---

### `OverallStats.tsx` — Progress Statistics

Welcome page এ দেখায় — কতটুকু পড়া হয়েছে।

**কী দেখায়:**

- Complete percentage
- Total reading time
- Progress bar (violet → pink → amber gradient)

```typescript
const percent = Math.min(
  100,
  Math.round((stats.visitedSections.length / totalSections) * 100),
);
```

---

### `Navbar.tsx` — Navigation Bar

**Features:**

- Logo (NoteShala)
- Docs icon — rainbow gradient SVG, hover করলে "Documentation" tooltip
- Dark/Light mode toggle
- Search button (Ctrl+K shortcut show করে)
- GitHub + LinkedIn links
- Mobile: Theme toggle + Search + Hamburger menu

**Docs icon এ active state:**

```typescript
{isDocsPage && (
  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
)}
```

Docs page এ থাকলে icon এ একটা animated pulse dot দেখায়।

**Tooltip:**

```typescript
const [showTooltip, setShowTooltip] = useState(false);
// onMouseEnter → showTooltip true
// onMouseLeave → showTooltip false
```

---

### `Index.tsx` — Home Page

**Sections:**

1. `HeroSection` — title, typing animation, tagline, CTA button
2. Stats section — Missions count, Topics count, 6 Months (counter animation)
3. Progress section — কতটুকু পড়া হয়েছে (localStorage থেকে)
4. Continue Reading — last visited section (localStorage থেকে)
5. `TechStackSection` — tech stack cards (skill-icons.dev থেকে colored icons)
6. Footer

**Counter animation:**

```typescript
const useCounter = (target: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
  }, [target, duration]);
  return count;
};
```

---

### `HeroSection.tsx` — Hero Component

**Typing Animation:**

```typescript
useEffect(() => {
  const word = typingWords[wordIndex];
  const speed = isDeleting ? 80 : 120; // delete faster

  const timeout = setTimeout(() => {
    if (!isDeleting) {
      setCurrentWord(word.slice(0, currentWord.length + 1)); // type
      if (currentWord.length + 1 === word.length) {
        setTimeout(() => setIsDeleting(true), 1200); // pause then delete
      }
    } else {
      setCurrentWord(word.slice(0, currentWord.length - 1)); // delete
      if (currentWord.length === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % typingWords.length); // next word
      }
    }
  }, speed);
}, [currentWord, isDeleting, wordIndex]);
```

Words: TypeScript, Node.js, Express, Golang, Next.js, PostgreSQL, Prisma, Docker, Nginx

---

### `Breadcrumb.tsx` — Navigation Trail

```
Docs → Mission-0: Be A Web Developer → Raw Node.js Basic to Advanced
```

```typescript
for (const cat of docsData) {
  const section = cat.sections.find((s) => s.id === sectionId);
  if (section) {
    categoryTitle = cat.title;
    sectionTitle = section.title;
    break;
  }
}
```

"Docs" link → `/docs` এ navigate করে।

---

### `BackToTop.tsx` — Scroll to Top Button

```typescript
useEffect(() => {
  const handleScroll = () => setVisible(window.scrollY > 300);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

300px scroll করলে button দেখায়। Click করলে `window.scrollTo({ top: 0, behavior: "smooth" })`.

CSS transition দিয়ে smooth appear/disappear:

```typescript
visible
  ? "opacity-100 translate-y-0"
  : "opacity-0 translate-y-4 pointer-events-none";
```

---

### `cardTheme.ts` — Icon Theme

Mission card এ unique icon দেওয়ার জন্য।

```typescript
const ICONS = [
  BrainCircuit,
  Atom,
  Rocket,
  FlaskConical,
  Globe,
  TreePine,
  Code2,
  Sparkles,
  Shield,
  Cpu,
];

export function getTheme(index: number) {
  return { ...CARD_THEME, Icon: ICONS[index % ICONS.length] };
}
```

`index % ICONS.length` — 10টার বেশি mission হলেও cycle করবে।

---

## 🗄️ localStorage Data Structure

App টি browser এর `localStorage` এ data save করে:

| Key                          | Value       | কী আছে                                       |
| ---------------------------- | ----------- | -------------------------------------------- |
| `noteshala_reading_stats_v2` | JSON object | totalMinutes, visitedSections[], lastVisited |
| `noteshala_bookmarks`        | JSON array  | bookmark করা section IDs                     |
| `lastVisited`                | JSON object | id, title, categoryId                        |
| `readSections`               | JSON array  | পড়া section IDs                             |

---

## 🎨 Design System

**Colors (Dark Mode):**

- Background: `hsl(210 25% 4%)` — very dark navy
- Primary: `hsl(190 95% 50%)` — cyan/teal
- Card: `hsl(210 25% 8%)` — dark card

**Typography:**

- Body: Plus Jakarta Sans
- Code: JetBrains Mono

**Animations:**

- `fadeIn`, `fadeInUp`, `slideInLeft`, `scaleIn`
- `highlight-glow-cyan` — search navigate করলে heading highlight
- Mission card hover — `translate-y-2 scale-[1.015]`

---

## 🔄 Data Flow

```
meta.ts files ──→ loader.ts ──→ docsData[]
                                    │
                                    ├──→ Sidebar (navigation)
                                    ├──→ SearchDialog (search)
                                    ├──→ WelcomePage (mission cards)
                                    └──→ DocContent (content display)
                                              │
                                              └──→ MarkdownRenderer
                                                        │
                                                        └──→ shiki (highlight)
```

---

## 📱 Responsive Design

| Breakpoint      | Layout                             |
| --------------- | ---------------------------------- |
| Mobile (`< lg`) | MobileSidebar (Sheet), no TOC      |
| Tablet (`lg`)   | Desktop Sidebar visible            |
| Desktop (`xl`)  | Sidebar + Content + TOC (3 column) |

---

## 🚀 Deployment

Firebase Hosting এ deploy করা হয়েছে।

```bash
# Build
npm run build

# Deploy
firebase deploy
```

`firebase.json` config:

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

`rewrites` — SPA এর জন্য সব route `/index.html` এ redirect করে।

---

## 📝 নতুন Content যোগ করার পদ্ধতি

**নতুন Section যোগ:**

1. `.md` file বানান: `src/components/docs/mission-X/new-topic.md`
2. `meta.ts` এ section add করুন:

```typescript
{ id: "new-topic", title: "New Topic", order: 5, markdownFile: "new-topic.md" }
```

3. `git push` → Firebase auto deploy

**নতুন Mission যোগ:**

1. নতুন folder বানান: `src/components/docs/mission-X/`
2. `meta.ts` বানান category info দিয়ে
3. `.md` files যোগ করুন

---

_NoteShala — Learning, Building, and Documenting — One Stack at a Time. 🚀_
