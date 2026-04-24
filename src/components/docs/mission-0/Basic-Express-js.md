# Basic Express.js

---

## 1. Express কী?

Express হলো **Node.js এর একটা web framework**। Node.js দিয়ে web server বানানো যায়, কিন্তু সেটা অনেক কঠিন এবং বেশি code লিখতে হয়। Express সেই কাজটাকে সহজ করে দেয় — routing, request handle করা, response পাঠানো, middleware ব্যবহার করা এই সব কিছু Express দিয়ে অনেক সহজে করা যায়।

---

## 2. Basic Server Setup

```javascript
var express = require("express");
var app = express();

app.use(express.json()); // JSON body parse করার জন্য

app.get("/", (req, res) => {
  res.send("This is home page");
});

app.post("/", (req, res) => {
  console.log(req.body); // POST এ আসা JSON data
  res.send("This is home page with post method");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
```

- `require("express")` — Express library import করা
- `express()` — App instance তৈরি
- `app.listen(3000)` — Port 3000 এ server চালু করা

---

## 3. Body Parser Middleware

Client থেকে আসা data parse করতে middleware লাগে। কোন format এ data আসবে তার উপর নির্ভর করে middleware বেছে নিতে হয়।

```javascript
app.use(express.json()); // Content-Type: application/json
app.use(express.raw()); // Content-Type: application/octet-stream → Buffer
app.use(express.text()); // Content-Type: text/plain → String
app.use(express.urlencoded()); // Content-Type: application/x-www-form-urlencoded (HTML form)
```

| Middleware             | Data Type  | `req.body` এ যা পাবে |
| ---------------------- | ---------- | -------------------- |
| `express.json()`       | JSON       | JavaScript object    |
| `express.raw()`        | Binary     | Buffer               |
| `express.text()`       | Plain text | String               |
| `express.urlencoded()` | Form data  | JavaScript object    |

> ⚠️ কোনো middleware active না থাকলে সেই format এর data আসলে `req.body` হবে `undefined`

---

## 4. Static File Serving

```javascript
app.use(express.static(`${__dirname}/public/`, { index: "home.html" }));
```

- `express.static()` — নির্দিষ্ট folder এর files সরাসরি browser এ serve করে
- `__dirname` — Current file এর directory এর full path
- `{ index: "home.html" }` — Default file হিসেবে `index.html` এর বদলে `home.html` serve হবে

```javascript
project/
├── server.js
└── public/
    ├── home.html     ← / এ গেলে এটা serve হবে
    ├── about.html    ← /about.html এ গেলে এটা serve হবে
    └── style.css     ← /style.css এ গেলে এটা serve হবে
```

---

## 5. Express Router

বড় project এ routes আলাদা file এ রাখতে `express.Router()` ব্যবহার করা হয়।

```javascript
// adminRouter.js
const express = require("express");
const adminRouter = express.Router();

adminRouter.get("/", (req, res) => res.send("Dashboard"));
adminRouter.get("/login", (req, res) => res.send("Login"));

module.exports = adminRouter;

// server.js
const adminRouter = require("./adminRouter");
app.use("/admin", adminRouter); // /admin prefix যোগ হবে
```

### Router Options

```javascript
const router = express.Router({
  caseSensitive: true, // /Home আর /home আলাদা route হবে (default: false)
});
```

|                 | `app.get()`    | `router.get()`                   |
| --------------- | -------------- | -------------------------------- |
| কোথায় লেখা হয় | `server.js` এ  | আলাদা router file এ              |
| কাজ             | সরাসরি কাজ করে | `app.use()` দিয়ে mount করতে হয় |
| উদ্দেশ্য        | ছোট project    | বড় project এ code organize করতে |

---

## 6. Sub-Application (app mounting)

```javascript
const app = express();
const admin = express();

admin.on("mount", function (parent) {
  console.log("Admin Mounted");
  console.log(parent); // parent app টি refer করে
});

admin.get("/dashboard", (req, res) => {
  res.send("Welcome to the admin dashboard");
});

app.use("/admin", admin); // admin কে /admin path এ mount করা হলো
```

- `admin.on("mount", callback)` — যখন admin app টি parent app এ mount হয়, তখন এই callback fire হয়
- `parent` — main `app` object টিকে refer করে

---

## 7. app.locals

```javascript
app.locals.title = "My app"; // পুরো app জুড়ে accessible

// যেকোনো handler থেকে access করা যাবে
const handle = (req, res) => {
  console.log(req.app.locals.title); // "My app"
  res.send("This is home page");
};
```

- `app.locals` — Global object যেখানে data রাখলে পুরো application থেকে access করা যায়
- `req.app` — যেকোনো handler বা middleware থেকে main `app` object access করার উপায়

---

## 8. Route Methods

```javascript
app.get("/", (req, res) => {}); // GET
app.post("/", (req, res) => {}); // POST
app.put("/", (req, res) => {}); // PUT
app.delete("/", (req, res) => {}); // DELETE
app.all("/", (req, res) => {}); // সব HTTP method handle করে
```

### app.route() — Chaining

একই path এ বিভিন্ন method চেইন করা যায়:

```javascript
app
  .route("/about/mission")
  .get((req, res) => res.send("GET"))
  .post((req, res) => res.send("POST"))
  .put((req, res) => res.send("PUT"));
```

---

## 9. app.enable / app.disable

```javascript
app.enable("case sensitive routing"); // true করা
app.disable("case sensitive routing"); // false করা
```

App এর settings enable বা disable করতে ব্যবহার হয়।

---

## 10. app.param — Route Parameter Middleware

```javascript
app.param("id", (req, res, next, id) => {
  const user = { userId: id, name: "Ban" };
  req.userDetails = user; // data attach করা হলো request এ
  next();
});

app.get("/user/:id", (req, res) => {
  console.log(req.userDetails); // { userId: "123", name: "Ban" }
  res.send("This is home page");
});
```

- Route এ `:id` parameter আসার আগেই এই middleware call হয়
- Parameter এর value process করে `req` এ attach করে রাখা যায়
- একবারই call হয়, চাই route handler যতই থাকুক

---

## 11. View Engine (EJS)

```javascript
app.set("view engine", "ejs");

app.get("/about", (req, res) => {
  res.render("pages/about.ejs", { name: "bangladesh" });
});
```

```html
<!-- pages/about.ejs -->
<body>
  <div>Hello World this is about page</div>
  <%=name%>
  <!-- "bangladesh" render হবে -->
</body>
```

---

## 12. Request Object (req)

```javascript
app.get("/user/:id", (req, res) => {
  console.log(req.path); // → /user/123
  console.log(req.hostname); // → localhost
  console.log(req.method); // → GET
  console.log(req.protocol); // → http
  console.log(req.params); // → { id: "123" }
  console.log(req.params.id); // → "123"
  console.log(req.body); // → POST body (json middleware লাগবে)
  console.log(req.route); // → current route এর info
  console.log(req.ip); // → client এর IP address
});
```

### req.baseUrl vs req.url vs req.originalUrl

```javascript
// app.use("/admin", adminRouter) দিয়ে mount করা থাকলে
// /admin/dashboard এ request আসলে:

req.baseUrl; // → /admin (mount path)
req.url; // → /dashboard (router এর ভেতরের path)
req.originalUrl; // → /admin/dashboard (সম্পূর্ণ URL)
```

### req.accepts()

```javascript
const handle = (req, res) => {
  if (req.accepts("html")) {
    res.render("pages/about.ejs");
  } else {
    res.send("This is home page");
  }
};
```

Client এর `Accept` header দেখে কী format accept করে সেটা check করে।

### req.get()

```javascript
console.log(req.get("content-type")); // → "application/json"
```

Request header এর যেকোনো value পড়তে ব্যবহার হয়।

### req.app.get()

```javascript
const handle = (req, res) => {
  console.log(req.app.get("view engine")); // → "ejs"
  res.send("This is home page");
};
```

App এর settings read করতে ব্যবহার হয়।

---

## 13. Response Object (res)

```javascript
res.send("Hello"); // text/html response
res.json({ name: "bang", id: 25 }); // JSON response
res.render("pages/about.ejs", { name: "bangladesh" }); // template render
res.end(); // response শেষ করা (কোনো data ছাড়া)
res.status(200); // status code set (res.end() দরকার)
res.sendStatus(403); // status code set + send (response শেষ)
res.redirect("/test"); // অন্য route এ redirect
res.location("/test"); // Location header set করা
res.set("title", "express basic"); // Response header set করা
res.get("title"); // Response header read করা
res.cookie("name", "learnwithrafi", {}); // Cookie set করা
console.log(res.headersSent); // Header পাঠানো হয়েছে কিনা (true/false)
```

### res.format() — Content Negotiation

```javascript
res.format({
  "text/plain": () => res.send("hi plain"),
  "text/html": () => res.render("pages/about", { name: "bangladesh" }),
  default: () => res.status(406).send("Not acceptable"),
});
```

Client এর `Accept` header অনুযায়ী আলাদা আলাদা response পাঠায়।

---

## 14. Middleware

Middleware হলো এমন function যেটা request আসলে route handler এ যাওয়ার **আগে** run হয়।

```javascript
const myMiddleware = (req, res, next) => {
  console.log("I am logging");
  next(); // পরের middleware বা route handler এ যাবে
};

app.use(myMiddleware); // সব route এ apply হবে
```

### Logger Middleware

```javascript
const logger = (req, res, next) => {
  console.log(
    `${new Date(Date.now()).toLocaleString()} - ${req.method} - ${req.originalUrl} - ${req.protocol} - ${req.ip}`,
  );
  next();
};

app.use(logger);
```

### Middleware Factory (options সহ)

```javascript
const loggerWrapper = (options) => {
  return function (req, res, next) {
    if (options.log) {
      console.log("logging...");
      next();
    } else {
      throw new Error("this is a server error");
    }
  };
};

app.use(loggerWrapper({ log: true }));
```

---

## 15. Error Handling Middleware

Error middleware এর ৪টা parameter থাকে: `(err, req, res, next)`

```javascript
const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    next("There was a problem on header");
  } else {
    if (err.message) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send("There was an error");
    }
  }
};

app.use(errorMiddleware); // সবার শেষে রাখতে হবে
```

### Async Error Handling

```javascript
// Callback based async — try/catch দরকার
app.get("/", (req, res, next) => {
  fs.readFile("/file-does-not-exist", (err, data) => {
    if (err) {
      next(err); // error middleware এ পাঠানো
    } else {
      res.send(data);
    }
  });
});

// setTimeout এর মধ্যে — try/catch দিয়ে next() call করতে হবে
app.get("/", (req, res, next) => {
  setTimeout(function () {
    try {
      console.log(a); // ReferenceError
    } catch (err) {
      next(err);
    }
  });
});
```

### 404 Handler

```javascript
// সব route এর পরে রাখতে হবে
app.use((req, res, next) => {
  next("Req url not found");
});
```

---

## 16. Route Path Patterns

```javascript
app.get('/ab?cd', ...)    // 'acd' বা 'abcd' — b optional
app.get('/ab+cd', ...)    // 'abcd', 'abbcd', 'abbbcd' — b একাধিকবার
app.get('/ab*cd', ...)    // 'abcd', 'abxcd', 'ab123cd' — মাঝে যেকোনো কিছু
app.get('/ab(cd)?e', ...) // '/abe' বা '/abcde'

// Regular Expression
app.get(/a/, ...)         // URL এ 'a' থাকলে match
app.get(/.*fly$/, ...)    // 'butterfly', 'dragonfly' — fly দিয়ে শেষ
```

---

## 17. Router.param() — Advanced

### Express 5 (Standard)

```javascript
publicRouter.param("user", (req, res, next, val) => {
  const secretId = "12";
  if (val === secretId) {
    next();
  } else {
    res.sendStatus(403);
  }
});
```

### Express 4 (Callback style — deprecated)

```javascript
publicRouter.param((param, option) => (req, res, next, val) => {
  if (val === option) next();
  else res.sendStatus(403);
});
publicRouter.param("user", "12");
```

---

## 18. Router.route() — Chaining with .all()

```javascript
publicRouter
  .route("/user")
  .all((req, res, next) => {
    console.log("I am logging something"); // সব method এর আগে run হবে
    next();
  })
  .get((req, res) => res.send("GET"))
  .post((req, res) => res.send("POST"))
  .put((req, res) => res.send("PUT"))
  .delete((req, res) => res.send("DELETE"));
```

---

## 19. Multer — File Upload

### Basic Setup

```javascript
const multer = require("multer");
const UPLOADS_FOLDER = "./uploads";

const upload = multer({
  dest: UPLOADS_FOLDER,
  limits: { fileSize: 100000 }, // 100KB limit
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .png, .jpeg format allowed"));
    }
  },
});
```

### Upload Types

```javascript
upload.none()                                          // কোনো file নেই, শুধু text field
upload.single("avatar")                               // একটা file
upload.array("avatar", 3)                             // একই field থেকে max 3টা file
upload.fields([{ name: "avatar", maxCount: 1 }, ...]) // আলাদা আলাদা field থেকে file
```

### Custom Storage (diskStorage)

```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "_" +
      Date.now();
    cb(null, fileName + fileExt);
    // Example: "Important File.pdf" → "important-file_1712345678.pdf"
  },
});

const upload = multer({ storage });
```

### Error Handling

```javascript
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(500).send("There was an upload error");
  } else {
    res.status(500).send(err.message);
  }
});
```

### HTML Form

```html
<form
  action="http://localhost:3000/"
  method="post"
  enctype="multipart/form-data"
>
  <input type="file" name="avatar" multiple />
  <input type="submit" value="Submit" />
</form>
```

> ⚠️ File upload form এ `enctype="multipart/form-data"` অবশ্যই দিতে হবে

---

## 20. Project Structure (Best Practice)

```javascript
project/
├── server.js          ← main entry point
├── routes/
│   ├── adminRouter.js ← /admin এর সব route
│   └── publicRouter.js← / এর সব route
└── public/
    └── home.html
```

```javascript
// server.js
const adminRouter = require("./routes/adminRouter");
const publicRouter = require("./routes/publicRouter");

app.use("/admin", adminRouter);
app.use("/", publicRouter);
```

---

## Quick Reference

| Method                      | কাজ                         |
| --------------------------- | --------------------------- |
| `app.use()`                 | Middleware mount করা        |
| `app.get/post/put/delete()` | Route define করা            |
| `app.all()`                 | সব HTTP method handle করা   |
| `app.route()`               | একই path এ method chain করা |
| `app.param()`               | Route parameter middleware  |
| `app.set()`                 | App setting করা             |
| `app.enable/disable()`      | Setting on/off করা          |
| `app.locals`                | Global data store করা       |
| `express.Router()`          | Mini router তৈরি করা        |
| `express.static()`          | Static file serve করা       |
| `express.json()`            | JSON body parse করা         |
