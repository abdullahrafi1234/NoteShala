# Module 9: How The Web Works

---

## 9-1 How the Web Works?

**ওয়েব (World Wide Web)** হলো ইন্টারনেটের উপর চলা একটি সিস্টেম, যেখানে বিভিন্ন **ওয়েবসাইট, ওয়েবপেজ, ছবি, ভিডিও ও ডেটা** সংরক্ষিত থাকে এবং আমরা ব্রাউজারের মাধ্যমে সেগুলো দেখি।

---

### The key elements of web working

1. 👤 **User**
2. 🌐 **Browser** (Chrome, Firefox, Edge)
3. 🌍 **ISP** (Internet Service Provider)
4. 🖥️ **Server**
5. 📡 **Internet (Global Network)**

---

## 🔄 Step by Step: How to web work?

### 1️⃣ আপনি URL লিখেন

```
www.google.com
```

এবং Enter চাপলেন।

### 2️⃣ Browser Request পাঠায়

Browser একটি **HTTP/HTTPS Request** তৈরি করে সার্ভারের কাছে পাঠায়।

> Browser বলে: “এই ওয়েবসাইটের ডেটা চাই” 📩

### 3️⃣ Request যায় ISP হয়ে

আপনার Request আগে যায় আপনার **ISP (যেমন: WiFi / Mobile Data)** এর কাছে।

ISP আপনাকে ইন্টারনেটের সাথে যুক্ত করে।

### 4️⃣ DNS নামকে IP তে রূপান্তর করে

Server নাম (google.com) কম্পিউটার বোঝে না।

DNS এটাকে রূপান্তর করে →

```
google.com → 142.250.000.000
```

### 5️⃣ Server Response পাঠায়

Server আপনার Request পেয়ে Response পাঠায়:

- HTML
- CSS
- JavaScript
- Images

### 6️⃣ Browser Page Render করে

Browser এই ফাইলগুলো নিয়ে:

- Structure বানায় (HTML)
- Style দেয় (CSS)
- Interactive করে (JavaScript)

## 📦 Client vs Server

### 🧍 Client (Frontend)

- Browser
- HTML, CSS, JavaScript
- User যা দেখে

### 🖥️ Server (Backend)

- Database
- Logic
- API

## 🔐 HTTP vs HTTPS

| বিষয়         | HTTP | HTTPS |
| ------------ | ---- | ----- |
| Security     | ❌   | ✅    |
| Data Encrypt | No   | Yes   |
| Trusted      | No   | Yes   |

---

## 🗺️ Simple Flow Diagram (Text)

```tsx
User
 ↓
Browser
 ↓
ISP
 ↓
Internet
 ↓
Server
 ↓
Response Back
```
