# 🎵 Shalala — Note Taking App

Shalala একটি সহজ এবং দ্রুত note-taking অ্যাপ। তোমার যেকোনো চিন্তা, আইডিয়া বা কাজের তালিকা এখানে লিখে রাখো।

---

## 🚀 কীভাবে শুরু করবে (Getting Started)

### ১. Prerequisites

শুরু করার আগে নিচের জিনিসগুলো তোমার কম্পিউটারে থাকতে হবে:

- [Node.js](https://nodejs.org/) — version 18 বা তার উপরে
- [npm](https://www.npmjs.com/) অথবা [yarn](https://yarnpkg.com/)

Node.js ইন্সটল আছে কিনা চেক করতে terminal-এ লেখো:

```bash
node -v
npm -v
```

---

### ২. Project Clone করো

```bash
git clone https://github.com/your-username/shalala.git
cd shalala
```

---

### ৩. Dependencies Install করো

```bash
# npm দিয়ে
npm install

# অথবা yarn দিয়ে
yarn install
```

---

### ৪. App চালাও

```bash
# npm দিয়ে
npm run dev

# অথবা yarn দিয়ে
yarn dev
```

এরপর browser-এ যাও: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Production Build

```bash
# Build তৈরি করো
npm run build

# Build preview দেখো
npm run start
```

---

## 📁 Project Structure

```

```

├── 📁 .firebase
├── 📁 public
│ └── 🖼️ N-logo.png
├── 📁 src
│ ├── 📁 components
│ │ ├── 📁 docs
│ │ │ ├── 📁 mission-0
│ │ │ │ ├── 📝 Basic-Express-js.md
│ │ │ │ ├── 📄 meta.ts
│ │ │ │ ├── 📝 node-js-anatomy.md
│ │ │ │ ├── 📝 raw-node-js.md
│ │ │ │ └── 📝 uptime-monitoring-api-raw-node.md
│ │ │ ├── 📁 mission-1
│ │ │ │ ├── 📄 meta.ts
│ │ │ │ ├── 📝 module-1.md
│ │ │ │ ├── 📝 module-2.md
│ │ │ │ └── 📝 module-3.md
│ │ │ ├── 📁 mission-2
│ │ │ │ ├── 📄 meta.ts
│ │ │ │ ├── 📝 module-5.md
│ │ │ │ ├── 📝 module-6.md
│ │ │ │ └── 📝 module-7.md
│ │ │ ├── 📁 mission-3
│ │ │ │ ├── 📄 meta.ts
│ │ │ │ └── 📝 module-9.md
│ │ │ ├── 📄 DocContent.tsx
│ │ │ ├── 📄 DocsViewer.tsx
│ │ │ ├── 📄 MarkdownRenderer.tsx
│ │ │ ├── 📄 MobileSidebar.tsx
│ │ │ ├── 📄 SearchDialog.tsx
│ │ │ ├── 📄 Sidebar.tsx
│ │ │ ├── 📄 interfaces.ts
│ │ │ ├── 📄 loader.ts
│ │ │ └── 📄 page.tsx
│ │ ├── 📁 home
│ │ │ ├── 📄 HeroSection.tsx
│ │ │ ├── 📄 TechStackCard.tsx
│ │ │ └── 📄 TechStackSection.tsx
│ │ ├── 📁 layout
│ │ │ └── 📄 Navbar.tsx
│ │ ├── 📁 ui
│ │ │ ├── 📄 accordion.tsx
│ │ │ ├── 📄 alert-dialog.tsx
│ │ │ ├── 📄 alert.tsx
│ │ │ ├── 📄 aspect-ratio.tsx
│ │ │ ├── 📄 avatar.tsx
│ │ │ ├── 📄 badge.tsx
│ │ │ ├── 📄 breadcrumb.tsx
│ │ │ ├── 📄 button.tsx
│ │ │ ├── 📄 calendar.tsx
│ │ │ ├── 📄 card.tsx
│ │ │ ├── 📄 carousel.tsx
│ │ │ ├── 📄 chart.tsx
│ │ │ ├── 📄 checkbox.tsx
│ │ │ ├── 📄 collapsible.tsx
│ │ │ ├── 📄 command.tsx
│ │ │ ├── 📄 context-menu.tsx
│ │ │ ├── 📄 dialog.tsx
│ │ │ ├── 📄 drawer.tsx
│ │ │ ├── 📄 dropdown-menu.tsx
│ │ │ ├── 📄 form.tsx
│ │ │ ├── 📄 hover-card.tsx
│ │ │ ├── 📄 input-otp.tsx
│ │ │ ├── 📄 input.tsx
│ │ │ ├── 📄 label.tsx
│ │ │ ├── 📄 menubar.tsx
│ │ │ ├── 📄 navigation-menu.tsx
│ │ │ ├── 📄 pagination.tsx
│ │ │ ├── 📄 popover.tsx
│ │ │ ├── 📄 progress.tsx
│ │ │ ├── 📄 radio-group.tsx
│ │ │ ├── 📄 resizable.tsx
│ │ │ ├── 📄 scroll-area.tsx
│ │ │ ├── 📄 select.tsx
│ │ │ ├── 📄 separator.tsx
│ │ │ ├── 📄 sheet.tsx
│ │ │ ├── 📄 sidebar.tsx
│ │ │ ├── 📄 skeleton.tsx
│ │ │ ├── 📄 slider.tsx
│ │ │ ├── 📄 sonner.tsx
│ │ │ ├── 📄 switch.tsx
│ │ │ ├── 📄 table.tsx
│ │ │ ├── 📄 tabs.tsx
│ │ │ ├── 📄 textarea.tsx
│ │ │ ├── 📄 toast.tsx
│ │ │ ├── 📄 toaster.tsx
│ │ │ ├── 📄 toggle-group.tsx
│ │ │ ├── 📄 toggle.tsx
│ │ │ ├── 📄 tooltip.tsx
│ │ │ └── 📄 use-toast.ts
│ │ ├── 📄 DocsLayout.tsx
│ │ ├── 📄 NavLink.tsx
│ │ └── 📄 Sidebar.tsx
│ ├── 📁 data
│ │ └── 📄 docsData.ts
│ ├── 📁 hooks
│ │ ├── 📄 use-mobile.tsx
│ │ └── 📄 use-toast.ts
│ ├── 📁 lib
│ │ ├── 📄 docsLoader.ts
│ │ └── 📄 utils.ts
│ ├── 📁 pages
│ │ ├── 📄 Docs.tsx
│ │ ├── 📄 Index.tsx
│ │ └── 📄 NotFound.tsx
│ ├── 📁 utils
│ │ └── 📄 loadMarkdown.ts
│ ├── 🎨 App.css
│ ├── 📄 App.tsx
│ ├── 🎨 index.css
│ ├── 📄 main.tsx
│ └── 📄 vite-env.d.ts
├── ⚙️ .firebaserc
├── ⚙️ .gitignore
├── 📝 Readme.md
├── 📄 bun.lockb
├── ⚙️ components.json
├── 📄 eslint.config.js
├── ⚙️ firebase.json
├── 🌐 index.html
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.js
├── 📄 tailwind.config.ts
├── ⚙️ tsconfig.app.json
├── ⚙️ tsconfig.json
├── ⚙️ tsconfig.node.json
└── 📄 vite.config.ts

````

---

## ⚙️ Environment Variables

Root folder-এ `.env.local` নামে একটা file তৈরি করো এবং নিচের মতো লেখো:

```env
NEXT_PUBLIC_APP_NAME=Shalala
````

> ⚠️ `.env.local` ফাইল কখনো GitHub-এ push করবে না।

---

## 🤝 কীভাবে Contribute করবে

তুমি চাইলে এই প্রজেক্টে কাজ করতে পারো! নিচের ধাপগুলো follow করো:

1. Repository টা **Fork** করো
2. নতুন একটা branch তৈরি করো:
   ```bash
   git checkout -b feature/tomar-feature-er-naam
   ```
3. কাজ শেষে commit করো:
   ```bash
   git commit -m "Add: কী করলে সেটা লেখো"
   ```
4. Branch টা push করো:
   ```bash
   git push origin feature/tomar-feature-er-naam
   ```
5. GitHub-এ গিয়ে **Pull Request** খোলো

---

## 🐛 কোনো সমস্যা হলে

কোনো bug পেলে বা কোনো সাজেশন থাকলে [GitHub Issues](https://github.com/your-username/shalala/issues) এ জানাও।

---

## 📄 License

এই প্রজেক্টটি [MIT License](LICENSE) এর অধীনে।

---

<p align="center">Made with ❤️ — Shalala</p>
