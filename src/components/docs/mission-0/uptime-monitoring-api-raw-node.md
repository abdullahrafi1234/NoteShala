# Uptime Monitoring Application Raw Node.js

---

## 📁 Final Project Structure

```tsx
project/
├── index.js                          ← মূল entry point
├── routes.js                         ← সব routes এখানে
├── package.json                      ← dependencies & scripts
├── .data/                            ← file-based database (hidden folder)
│   ├── users/                        ← user JSON files
│   ├── tokens/                       ← token JSON files
│   └── checks/                       ← check JSON files
├── helpers/
│   ├── handleReqRes.js               ← request/response handler
│   ├── environments.js               ← staging/production config
│   ├── utilities.js                  ← helper functions
│   └── notifications.js              ← Twilio SMS
├── lib/
│   ├── data.js                       ← file system CRUD
│   ├── server.js                     ← server logic (পরে আলাদা করা হয়েছে)
│   └── worker.js                     ← background check worker
└── handlers/
    └── routeHandlers/
        ├── userHandler.js            ← user CRUD
        ├── tokenHandler.js           ← login/logout
        ├── checkHandler.js           ← link monitoring
        ├── sampleHandler.js          ← test route
        └── notFoundHandler.js        ← 404 handler
```

### Structure কেন এভাবে সাজানো হয়েছে?

শুরুতে সব কোড একটা ফাইলে ছিল। পরে ধাপে ধাপে আলাদা করা হয়েছে। এই pattern কে বলে **Separation of Concerns** — প্রতিটা ফাইলের একটাই কাজ থাকবে। এতে:

- কোড পড়া সহজ হয়
- Bug খুঁজে পাওয়া সহজ হয়
- Team এ কাজ করা যায়
- যেকোনো অংশ আলাদাভাবে reuse করা যায়

---

## 🔄 Project কীভাবে ধাপে ধাপে তৈরি হয়েছে

```tsx
ধাপ ১  → Basic HTTP Server (সব একফাইলে)
ধাপ ২  → URL Parsing & Request Body পড়া
ধাপ ৩  → Modular করা (handleReqRes আলাদা ফাইলে)
ধাপ ৪  → Routing System তৈরি
ধাপ ৫  → Environment Management (staging/production)
ধাপ ৬  → File System CRUD (lib/data.js)
ধাপ ৭  → Utilities (parseJSON, hash, createRandomString)
ধাপ ৮  → User Handler (CRUD)
ধাপ ৯  → Token Handler (Login/Logout)
ধাপ ১০ → Authentication (verify দিয়ে protected routes)
ধাপ ১১ → Check Handler (Link Monitoring CRUD)
ধাপ ১২ → Notifications (Twilio SMS)
ধাপ ১৩ → Worker (Background Process)
ধাপ ১৪ → Server ও Worker আলাদা lib এ নেওয়া
```

## 📄 ধাপ ১ ও ২ — index.js (প্রথম version)

```javascript
const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");

const app = {};

app.config = {
  port: 3000,
};

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Listening to port ${app.config.port}`);
  });
};

app.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headersObject = req.headers;

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    res.end("Hello World");
  });
};

app.createServer();
```

### বিস্তারিত ব্যাখ্যা

**`const http = require("http")`**
Node.js এর built-in HTTP module import করা হচ্ছে। এই module ছাড়া server তৈরি করা যাবে না।

**`const app = {}`**
একটা খালি object তৈরি করা হচ্ছে। এটা একটা **container** — সব function আর config এই একটা জায়গায় রাখা হবে। এই pattern কে বলে **Module Scaffolding**।

**`app.config = { port: 3000 }`**
Port number আলাদা রাখা হয়েছে যাতে পরে সহজে বদলানো যায়।

**`http.createServer(app.handleReqRes)`**
Server তৈরি হচ্ছে। এখানে বলা হচ্ছে — "কোনো request আসলে `handleReqRes` function কে ডাকো।"

**`url.parse(req.url, true)`**
URL কে ভেঙে parts বের করা হচ্ছে।

- `true` দিলে query string automatically object এ convert হয়
- যেমন `?name=rafi` → `{ name: "rafi" }`

**`path.replace(/^\/+|\/+$/g, "")`**
এই Regular Expression দিয়ে URL এর আগে ও পিছের সব `/` কেটে দেওয়া হচ্ছে।

```js
/user/    →  user
//api//   →  api
/sample/  →  sample
```

**`req.method.toLowerCase()`**
HTTP method টা lowercase এ নেওয়া হচ্ছে। Browser `GET`, `POST` এভাবে পাঠায়, কিন্তু আমরা সব সময় lowercase এ compare করবো তাই।

**`const decoder = new StringDecoder("utf-8")`**
Node.js request body কে binary **Buffer** হিসেবে পাঠায়। মানুষ পড়তে পারে না এরকম। `StringDecoder` সেই binary data কে readable string এ convert করে। `"utf-8"` মানে বাংলা, ইংরেজি, সব ধরনের character support করবে।

**`req.on("data", (buffer) => { realData += decoder.write(buffer); })`**
Node.js request body একবারে না এনে **ছোট ছোট টুকরো (chunk)** করে পাঠায় — এটাকে বলে **Streaming**। প্রতিটা chunk আসলে decode করে `realData` তে জোড়া লাগানো হচ্ছে।

**`req.on("end", () => { ... })`**
সব chunk আসা শেষ হলে এই event fire হয়। এখানেই response পাঠানো হচ্ছে।

---

## 📄 ধাপ ৩ — Modular Structure

### index.js (modular version)

```javascript
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");

const app = {};

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Listening to port ${environment.port}`);
  });
};

app.handleReqRes = handleReqRes;

app.createServer();
```

### কেন আলাদা করা হলো?

আগে `handleReqRes` function `index.js` এর ভেতরেই ছিল। Project বড় হলে একটা ফাইলে সব রাখা সমস্যা হয়। তাই `handleReqRes` কে `helpers/handleReqRes.js` এ নিয়ে গিয়ে এখানে **import** করা হচ্ছে।

**`const { handleReqRes } = require("./helpers/handleReqRes")`**
`handleReqRes.js` থেকে `handleReqRes` function টা import হচ্ছে। `{}` দিয়ে destructuring করা হচ্ছে কারণ ওই file থেকে `handler` object export হয় এবং আমরা শুধু `handleReqRes` property টা নিচ্ছি।

**`app.handleReqRes = handleReqRes`**
Import করা function টাকে `app.handleReqRes` এ assign করা হচ্ছে যাতে server use করতে পারে।

---

## 📄 ধাপ ৫ — helpers/environments.js

```javascript
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "jahshsdsjd",
  maxChecks: 5,
  twilio: {
    fromPhone: "+1XXXXXXXXXX",
    accountSid: "ACXXXXXXXX",
    authToken: "XXXXXXXX",
  },
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "dfhduhfn",
  maxChecks: 5,
  twilio: {
    fromPhone: "+1XXXXXXXXXX",
    accountSid: "ACXXXXXXXX",
    authToken: "XXXXXXXX",
  },
};

const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
```

### বিস্তারিত ব্যাখ্যা

**দুটো Environment কেন?**

- `staging` → Developer নিজে test করার জন্য। Port 3000।
- `production` → Real users যেটা use করে। Port 5000।
  এভাবে আলাদা রাখলে test করার সময় real users এর data নষ্ট হওয়ার ভয় নেই।

**`secretKey` কী কাজে লাগে?**
Password hash করার সময় এটা ব্যবহার হয়। Staging আর Production এ আলাদা key থাকায় যদি কেউ staging এর hash চুরিও করে, production এ কাজ করবে না।

**`maxChecks: 5`**
একজন user সর্বোচ্চ ৫টা link monitor করতে পারবে। এটা environment এ রাখা হয়েছে কারণ production এ হয়তো এই limit বদলাতে হতে পারে।

**`process.env.NODE_ENV`**
`process.env` হলো system এর environment variable পড়ার জায়গা। `NODE_ENV` একটা special variable যেটা দিয়ে বলা হয় এখন কোন mode এ চলছে।

```bash
npm start          → NODE_ENV = "staging"
npm run production → NODE_ENV = "production"
```

**`typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging"`**
`NODE_ENV` set না থাকলে default `"staging"` ব্যবহার হবে। এটা safety net।

**`typeof environments[currentEnvironment] === "object"`**
`currentEnvironment` এর নামে কোনো environment object আছে কিনা চেক করছে। না থাকলে `staging` দেবে। এটা আরেকটা safety net — কেউ যদি ভুল `NODE_ENV` দেয়।

### পরিবর্তনের ইতিহাস

| কখন    | কী যোগ হয়েছে     | কেন                           |
| ------ | ----------------- | ----------------------------- |
| শুরুতে | `port`, `envName` | basic server config           |
| পরে    | `secretKey`       | password hashing শুরু হওয়ায় |
| পরে    | `maxChecks`       | check limit enforce করতে      |
| শেষে   | `twilio`          | SMS notification যোগ করায়    |

---

## 📄 ধাপ ৩ — helpers/handleReqRes.js (সম্পূর্ণ version)

```javascript
const { StringDecoder } = require("string_decoder");
const url = require("url");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");
const { parseJSON } = require("./utilities");

const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headersObject = req.headers;

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    requestProperties.body = parseJSON(realData);

    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = handler;
```

### বিস্তারিত ব্যাখ্যা

**`requestProperties` object কেন বানানো হলো?**
আগে request এর সব তথ্য আলাদা আলাদা variable এ ছিল। এগুলো handler এ পাঠাতে হলে সব আলাদাভাবে pass করতে হতো। এখন সব একটা object এ ভরে একসাথে পাঠানো হচ্ছে। Clean এবং সহজ।

**`const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler`**
এটা একটা ternary operator। `routes` object এ `trimmedPath` এর নামে কোনো handler আছে কিনা চেক করছে।

```js
URL: /user  → trimmedPath: "user"
routes["user"] আছে? → হ্যাঁ → userHandler ব্যবহার করো
routes["xyz"] আছে? → না  → notFoundHandler ব্যবহার করো
```

এটা অনেকটা **receptionist** এর মতো — কেউ আসলে দেখে কার কাছে পাঠাবে।

**`requestProperties.body = parseJSON(realData)`**
`req.on("end")` এ সব body data আসার পরে `parseJSON` দিয়ে JSON string কে object এ convert করে `requestProperties.body` তে রাখা হচ্ছে। তাই handler এ `requestProperties.body.firstName` এভাবে access করা যাচ্ছে।

**`chosenHandler(requestProperties, (statusCode, payload) => { ... })`**
Handler কে দুটো জিনিস দেওয়া হচ্ছে:

1. `requestProperties` → request এর সব তথ্য
2. একটা callback function → handler কাজ শেষ করলে এই function call করবে

**`statusCode = typeof statusCode === "number" ? statusCode : 500`**
Handler যদি ভুলে statusCode না দেয় বা number ছাড়া কিছু দেয়, তাহলে default `500` (Server Error) দেওয়া হবে। এটা safety check।

**`payload = typeof payload === "object" ? payload : {}`**
একইভাবে payload object না হলে খালি object `{}` দেওয়া হবে।

**`res.setHeader("Content-Type", "application/json")`**
Browser বা Postman কে বলা হচ্ছে "আমি JSON পাঠাচ্ছি"। এটা না দিলে client বুঝতে পারবে না response টা কী format এ।

**`res.writeHead(statusCode)`**
HTTP status code set করা হচ্ছে (200, 404, 500 ইত্যাদি)।

**`res.end(payloadString)`**
`JSON.stringify(payload)` দিয়ে object কে JSON string এ convert করে পাঠানো হচ্ছে। `res.end()` মানে response শেষ।

### পরিবর্তনের ইতিহাস

| কখন    | কী যোগ হয়েছে              | কেন                             |
| ------ | -------------------------- | ------------------------------- |
| শুরুতে | basic URL parse            | শুধু path বের করতে              |
| পরে    | `requestProperties` object | সব তথ্য একসাথে handler এ পাঠাতে |
| পরে    | routing (`chosenHandler`)  | সঠিক handler এ route করতে       |
| পরে    | `requestProperties.body`   | body data handler এ পাঠাতে      |
| শেষে   | `Content-Type` header      | client কে JSON জানাতে           |

---

## 📄 ধাপ ৪ — routes.js

```javascript
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { checkHandler } = require("./handlers/routeHandlers/checkHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
```

### বিস্তারিত ব্যাখ্যা

এই ফাইলটা একটা **ঠিকানার তালিকার মতো**।

```js
/sample → sampleHandler
/user   → userHandler
/token  → tokenHandler
/check  → checkHandler
```

**নতুন route যোগ করতে হলে** শুধু এখানে একটা লাইন যোগ করলেই হবে। `handleReqRes.js` এ কিছু বদলাতে হবে না।

**`{ userHandler }` destructuring কেন?**
`userHandler.js` এ `module.exports = handler` দিয়ে পুরো handler object export হয়। সেই object এ `handler.userHandler` আছে। তাই destructuring দিয়ে শুধু `userHandler` টা নেওয়া হচ্ছে।

---

## 📄 ধাপ ৬ — lib/data.js — File System CRUD

> **গুরুত্বপূর্ণ:** এই project এ কোনো database (MongoDB, MySQL) নেই। সব data `.data/` folder এ JSON file হিসেবে রাখা হয়। `.data` এর আগে `.` দেওয়া মানে এটা hidden folder।

```javascript
const fs = require("fs");
const path = require("path");

const lib = {};

lib.basedir = path.join(__dirname, "../.data/");
```

**`path.join(__dirname, "../.data/")`**

- `__dirname` → এই ফাইল (`data.js`) যে folder এ আছে সেটার full path
- `../` → এক ধাপ উপরে যাও
- `.data/` → সেখানে `.data` folder

তাহলে `lib.basedir` হবে project root এর `.data/` folder।

---

### lib.create — নতুন File তৈরি

```javascript
lib.create = function (dir, file, data, callback) {
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, stringData, function (err2) {
          if (!err2) {
            fs.close(fileDescriptor, function (err3) {
              if (!err3) {
                callback(false);
              } else {
                callback("Error closing the new file");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback("Could not create new file, it may already exists!");
      }
    },
  );
};
```

### বিস্তারিত ব্যাখ্যা

**`fs.open(path, "wx", callback)`**
File খোলা হচ্ছে। `"wx"` flag এর মানে:

- `w` → writing এর জন্য খোলো
- `x` → file আগে থেকে থাকলে **error দাও** (overwrite করো না)

এটা important কারণ same phone number দিয়ে দুইজন user বানানো যাবে না।

**`fileDescriptor`**
File successfully খুললে `fileDescriptor` পাওয়া যায়। এটা file এর একটা **reference বা চাবি** — এটা দিয়েই পরে file এ লেখা বা বন্ধ করা হয়।

**`JSON.stringify(data)`**
JavaScript object কে JSON string এ convert করছে কারণ file এ শুধু string লেখা যায়।

```javascript
{ name: "BD" }  →  '{"name":"BD"}'
```

**`fs.writeFile(fileDescriptor, stringData, callback)`**
fileDescriptor ব্যবহার করে file এ data লেখা হচ্ছে।

**`fs.close(fileDescriptor, callback)`**
File এ কাজ শেষ হলে বন্ধ করা অবশ্যই দরকার। না বন্ধ করলে **memory leak** হতে পারে — system এর resource আটকে থাকে।

**`callback(false)`**
সব ঠিকঠাক হলে `false` পাঠানো হচ্ছে — মানে **কোনো error নেই**। এই project এ error handle এর নিয়ম:

- সফল → `callback(false)`
- সমস্যা → `callback("error message")`

**৩টা nested callback কেন?**
Node.js এ file system operations **asynchronous** — মানে একটা শেষ হওয়ার জন্য wait করতে হয়। তাই open → write → close এই ৩টা কাজ nested callback এ করতে হয়েছে।

---

### lib.read — File পড়া

```javascript
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};
```

### বিস্তারিত ব্যাখ্যা

**`fs.readFile(path, "utf-8", callback)`**
File এর content পড়া হচ্ছে।

**`"utf-8"` কেন দরকার?**
এটা না দিলে `fs.readFile` raw binary **Buffer** দেবে:

```
<Buffer 7b 22 6e 61 6d 65 22 3a 22 42 44 22 7d>  ← পড়া যাচ্ছে না
```

`"utf-8"` দিলে readable string আসে:

```
'{"name":"BD","Lan":"Bangla"}'  ← পড়া যাচ্ছে ✅
```

**`create` vs `read` তুলনা:**
`create` এ ৩টা ধাপ লাগে (open → write → close) কারণ নিরাপদে file তৈরি করতে হয়। কিন্তু `read` এ শুধু **একটাই কাজ** — `readFile`।

---

### lib.update — File আপডেট

```javascript
lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error close file");
                }
              });
            } else {
              callback("Error writing to file");
            }
          });
        } else {
          callback("Error truncating file");
        }
      });
    } else {
      callback("Error updating, file may not exist");
    }
  });
};
```

### বিস্তারিত ব্যাখ্যা

**`"r+"` flag কেন? `"wx"` না কেন?**

- `"wx"` → নতুন file তৈরি করো, আগে থাকলে error
- `"r+"` → আগে থেকে **আছে এমন** file খোলো read/write এর জন্য, না থাকলে error

Update এর জন্য file আগে থেকে থাকতে হবে — তাই `"r+"` ব্যবহার।

**`fs.ftruncate(fileDescriptor, callback)`**
এটা file এর সব content **মুছে ফেলে** (শূন্য করে দেয়)। তারপর নতুন data লেখা হয়।

কেন দরকার? ধরো আগের data ছিল:

```
{"name":"Bangladesh","language":"Bangla"}   ← ৪০ character
```

নতুন data:

```
{"name":"England","lang":"Eng"}   ← ৩১ character
```

`ftruncate` না করলে শেষে আগের data থেকে যাবে:

```
{"name":"England","lang":"Eng"}la"}   ← নোংরা data ❌
```

---

### lib.delete — File মুছে ফেলা

```javascript
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error on delete file, already deleted");
    }
  });
};
```

### বিস্তারিত ব্যাখ্যা

**`fs.unlink()`**
`unlink` মানে file এর OS-level **link বা reference সরিয়ে দেওয়া**। এতে file চিরতরে মুছে যায়। `delete` না বলে `unlink` বলা হয় কারণ OS এর ভাষায় file delete = link remove।

**`delete` সবচেয়ে সহজ কেন?**
| Method | ধাপ |
|--------|-----|
| create | open → write → close (৩ ধাপ) |
| update | open → truncate → write → close (৪ ধাপ) |
| read | readFile (১ ধাপ) |
| delete | unlink (১ ধাপ) ✅ |

---

### lib.list — Directory List

```javascript
lib.list = (dir, callback) => {
  fs.readdir(`${lib.basedir + dir}/`, (err, fileNames) => {
    if (!err && fileNames) {
      let trimmedFileNames = [];
      fileNames.forEach((fileName) => {
        trimmedFileNames.push(fileName.replace(".json", ""));
      });
      callback(false, trimmedFileNames);
    } else {
      callback("Error reading directory!");
    }
  });
};
```

### বিস্তারিত ব্যাখ্যা

**`fs.readdir()`**
Directory এর ভেতরের সব file এর নাম array হিসেবে দেয়।

```
["01234567890.json", "01987654321.json"]
```

**`fileName.replace(".json", "")`**
`.json` extension বাদ দিয়ে শুধু নাম রাখা হচ্ছে।

```
"01234567890.json"  →  "01234567890"
```

**এটা কোথায় ব্যবহার হয়?**
Worker এ সব checks এর list পড়তে ব্যবহার হয়:

```javascript
data.list("checks", (err, checks) => {
  checks.forEach((checkId) => {
    data.read("checks", checkId, ...);
  });
});
```

---

## 📄 ধাপ ৭ — helpers/utilities.js

```javascript
const crypto = require("crypto");
const utilities = {};
const environments = require("./environments");

utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  }
};

utilities.createRandomString = (strLength) => {
  let length =
    typeof strLength === "number" && strLength > 0 ? strLength : false;
  if (length) {
    let possibleCharacters = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 1; i <= length; i += 1) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length),
      );
      output += randomCharacter;
    }
    return output;
  }
  return false;
};

module.exports = utilities;
```

### বিস্তারিত ব্যাখ্যা

**`utilities.parseJSON`**

`JSON.parse()` সরাসরি ব্যবহার করলে invalid JSON আসলে পুরো server crash করে। `try/catch` দিয়ে সেটা handle করা হচ্ছে।

```javascript
// try/catch ছাড়া:
JSON.parse("invalid json")  →  ❌ SyntaxError: Unexpected token

// try/catch দিয়ে:
parseJSON("invalid json")   →  {} (খালি object, crash নেই)
```

**`utilities.hash`**

Password plain text এ রাখা বিপজ্জনক। কেউ database চুরি করলে সব password দেখতে পাবে। তাই hash করে রাখা হয়।

- `crypto.createHmac("sha256", secretKey)` → HMAC-SHA256 algorithm ব্যবহার করে hash বানানো হচ্ছে। `secretKey` ব্যবহার করায় same password এর hash দুই project এ আলাদা হবে।
- `.update(str)` → কোন string hash করবো
- `.digest("hex")` → hexadecimal format এ output দাও

```
"12345"  →  "5994471abb01112afcc18159f6cc74b4f511b99806..."
```

এই hash থেকে আর "12345" বের করা যাবে না — এটাই **one-way hashing**।

**`utilities.createRandomString`**

Token ID বানাতে ব্যবহার হয়। প্রতিবার আলাদা।

- `possibleCharacters` → যেসব character ব্যবহার হবে (a-z + 0-9)
- `Math.floor(Math.random() * possibleCharacters.length)` → random index বের করা
- `possibleCharacters.charAt(index)` → সেই index এর character নেওয়া
- Loop চলতে থাকে `length` সংখ্যক বার

```javascript
createRandomString(20) → "99okd1tvrx9zdaci39tk"
createRandomString(20) → "x7km2pqr8nwt5yaz1jvb"  // প্রতিবার আলাদা
```

---

## 📄 ধাপ ৮ — handlers/routeHandlers/userHandler.js

### Structure Pattern — সব Handlers এ একই

```javascript
handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};
handler._users.post   = (requestProperties, callback) => { ... };
handler._users.get    = (requestProperties, callback) => { ... };
handler._users.put    = (requestProperties, callback) => { ... };
handler._users.delete = (requestProperties, callback) => { ... };
```

### বিস্তারিত ব্যাখ্যা

**`acceptedMethods.indexOf(method) > -1`**
`indexOf` array তে খোঁজে:

- পেলে → index number (0 বা বেশি) → `> -1` মানে পাওয়া গেছে
- না পেলে → `-1` → `> -1` false → method নেই

**`handler._users[requestProperties.method](requestProperties, callback)`**
এটা চালাক একটা কাজ। Method এর নাম দিয়েই function call হচ্ছে:

```javascript
method = "get"   → handler._users["get"]()  → handler._users.get()
method = "post"  → handler._users["post"]() → handler._users.post()
```

**`_users` এ `_` কেন?**
JavaScript এ `_` prefix দিলে বোঝানো হয় এটা **private** — বাইরে থেকে সরাসরি call করার জন্য না। এটা convention, enforced না।

**`callback(405)`**
`405` = Method Not Allowed। কেউ যদি `PATCH` বা `OPTIONS` দিয়ে request করে।

---

### \_users.post — নতুন User তৈরি

```javascript
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  // ... অন্য fields একইভাবে

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    data.read("users", phone, (err) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(200, { message: "User was created successfully" });
          } else {
            callback(500, { error: "Could not create user" });
          }
        });
      } else {
        callback(500, { error: "There was a problem in server side" });
      }
    });
  } else {
    callback(400, { error: "You have a problem in your request" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**Validation Pattern:**

```javascript
const firstName =
  typeof requestProperties.body.firstName === "string" &&
  requestProperties.body.firstName.trim().length > 0
    ? requestProperties.body.firstName
    : false;
```

প্রতিটা field এই pattern এ validate করা হচ্ছে:

- `typeof === "string"` → string type কিনা
- `.trim().length > 0` → খালি না কিনা (শুধু space দিলেও reject)
- Valid হলে → value রাখো
- Invalid হলে → `false` দাও

**`phone.trim().length === 11`**
Phone ঠিক ১১ সংখ্যার হতে হবে। বাংলাদেশি নম্বর `01XXXXXXXXX` = ১১ digit।

**`data.read("users", phone, (err) => { if (err) { ... } })`**
আগে আছে কিনা দেখতে read করা হচ্ছে। এখানে logic উল্টো:

- `err` আসলে মানে file **নেই** → user নেই → নতুন বানানো যাবে ✅
- `err` না আসলে মানে file **আছে** → user আগেই আছে → বানানো যাবে না ❌

**`password: hash(password)`**
Password কখনো plain text এ রাখা যাবে না। Hash করে রাখা হচ্ছে।

**Phone number কে file name কেন?**
Phone number সবার আলাদা — এটা **unique identifier**। তাই `.data/users/01234567890.json` এভাবে রাখলে সহজেই খোঁজা যায়।

---

### \_users.get — User দেখা (Authentication সহ)

```javascript
handler._users.get = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        data.read("users", phone, (err, u) => {
          const user = { ...parseJSON(u) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, { error: "Requested user was not found" });
          }
        });
      } else {
        callback(403, { error: "Authentication failure!" });
      }
    });
  } else {
    callback(404, { error: "Requested user was not found" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**কেন GET এ body নয়, query string এ phone?**
HTTP convention অনুযায়ী:

- `GET` → শুধু data read করে, body থাকে না
- `POST`, `PUT` → data পাঠায়, body থাকে

তাই GET এ URL এর query string ব্যবহার করতে হয়:

```
GET /user?phone=01234567890
```

**`requestProperties.headersObject.token`**
Token পাঠানো হয় request এর **header** এ। Body তে না। Postman এ:

```
Headers:
  token: 99okd1tvrx9zdaci39tk
```

**`tokenHandler._token.verify(token, phone, callback)`**
Token valid কিনা check করা হচ্ছে। দুটো জিনিস verify হয়:

1. Token টা এই phone number এর কিনা
2. Token expire হয়নি তো

**`const user = { ...parseJSON(u) }`**
`...` (spread operator) দিয়ে একটা **নতুন copy** বানানো হচ্ছে। সরাসরি `parseJSON(u)` ব্যবহার করলে original data বদলে যেতে পারে। Copy তে কাজ করা safe।

**`delete user.password`**
Response এ password পাঠানো নিরাপদ না — hash হলেও না। তাই পাঠানোর আগে মুছে দেওয়া হচ্ছে।

**`403 Forbidden` কেন `401 Unauthorized` না?**

- `401` → তুমি কে সেটা জানি না (login করোনি)
- `403` → তুমি কে জানি, কিন্তু permission নেই

এখানে token invalid মানে permission নেই তাই `403`।

---

### \_users.put — User আপডেট (Authentication সহ)

```javascript
handler._users.put = (requestProperties, callback) => {
  const phone = ...; // required, body থেকে

  const firstName = ...; // optional
  const lastName  = ...; // optional
  const password  = ...; // optional

  if (phone) {
    if (firstName || lastName || password) {
      let token = typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token : false;

      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          data.read("users", phone, (err, uData) => {
            const userData = { ...parseJSON(uData) };
            if (!err) {
              if (firstName) { userData.firstName = firstName; }
              if (lastName)  { userData.lastName  = lastName;  }
              if (password)  { userData.password  = hash(password); }

              data.update("users", phone, userData, (err) => {
                if (!err) {
                  callback(200, { message: "User was updated successfully" });
                } else {
                  callback(500, { error: "There was a problem in the server side" });
                }
              });
            } else {
              callback(400, { error: "You have a problem in your request" });
            }
          });
        } else {
          callback(403, { error: "Authentication failure!" });
        }
      });
    } else {
      callback(400, { error: "You have a problem in your request" });
    }
  } else {
    callback(400, { error: "Invalid phone number try again" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**`if (firstName || lastName || password)`**
`&&` না দিয়ে `||` দেওয়া হয়েছে কারণ সব field একসাথে আপডেট করা জরুরি না। যেকোনো একটা দিলেই চলবে।

**কেন আগে `data.read()` করা হচ্ছে?**
না পড়লে শুধু firstName দিলে বাকি সব data মুছে যেতো:

```javascript
// পড়া ছাড়া update করলে:
data.update("users", phone, { firstName: "Rafi" }, ...)
// ফলে: { firstName: "Rafi" }  ← lastName, phone সব গেছে! ❌

// পড়ে update করলে:
userData.firstName = "Rafi";
data.update("users", phone, userData, ...)
// ফলে: { firstName: "Rafi", lastName: "Bhuiyan", phone: "..." } ✅
```

---

### \_users.delete — User মুছে ফেলা (Authentication সহ)

```javascript
handler._users.delete = (requestProperties, callback) => {
  const phone = ...; // query string থেকে

  if (phone) {
    let token = typeof requestProperties.headersObject.token === "string"
      ? requestProperties.headersObject.token : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        data.read("users", phone, (err, userData) => {
          if (!err && userData) {
            data.delete("users", phone, (err) => {
              if (!err) {
                callback(200, { message: "Deleted successfully" });
              } else {
                callback(500, { error: "There was a problem on server side delete" });
              }
            });
          } else {
            callback(500, { error: "There was a server side error" });
          }
        });
      } else {
        callback(403, { error: "Authentication failure!" });
      }
    });
  } else {
    callback(400, { error: "There was a problem in your request" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**কেন আগে `data.read()` করা হচ্ছে?**
সরাসরি delete না করে আগে user আছে কিনা confirm করা হচ্ছে। না থাকলে meaningless delete এর চেষ্টা হতো। এটা good practice।

**GET vs DELETE — দুটোতেই query string কেন?**
GET এবং DELETE এ body পাঠানো HTTP standard এ encourage করা হয় না। তাই দুটোতেই URL query string ব্যবহার।

---

## 📄 ধাপ ৯ — handlers/routeHandlers/tokenHandler.js

### \_token.post — Login

```javascript
handler._token.post = (requestProperties, callback) => {
  const phone = ...; // body থেকে
  const password = ...; // body থেকে

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      let hashedPassword = hash(password);
      if (hashedPassword === parseJSON(userData).password) {
        let tokenId = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = { phone, id: tokenId, expires };

        data.create("tokens", tokenId, tokenObject, (err) => {
          if (!err) { callback(200, tokenObject); }
          else { callback(500, { error: "There was a problem in the server side" }); }
        });
      } else {
        callback(400, { error: "Password is not valid" });
      }
    });
  } else {
    callback(400, { error: "You have a problem in your request" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**`hash(password) === parseJSON(userData).password`**
Database এ plain password নেই, hash আছে। তাই user দেওয়া password কে hash করে compare করতে হয়।

```
user দিলো: "12345"
hash করলে: "5994471abb..."
file এ আছে: "5994471abb..."
মিলেছে ✅ → token দাও
```

**`Date.now() + 60 * 60 * 1000`**

- `Date.now()` → এখনকার সময় milliseconds এ
- `60 * 60 * 1000` → ১ ঘণ্টা milliseconds এ (60 min × 60 sec × 1000ms)
- যোগ করলে → ১ ঘণ্টা পরের সময়

**`createRandomString(20)`**
Token ID হবে random 20 character এর string। প্রতিবার login এ নতুন token তৈরি হয়।

**Token Object:**

```json
{
  "phone": "01234567890",
  "id": "99okd1tvrx9zdaci39tk",
  "expires": 1775990406485
}
```

---

### \_token.get — Token দেখা

```javascript
handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, { error: "Requested token was not found" });
      }
    });
  } else {
    callback(404, { error: "Requested token was not found" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**`id.trim().length === 20`**
Token ID সবসময় ২০ character — কারণ `createRandomString(20)` দিয়ে বানানো হয়েছে। তাই validation এও ২০ character চেক করা হচ্ছে।

**`_users.get` vs `_token.get` পার্থক্য:**
`_users.get` এ authentication আছে (token verify করে), কিন্তু `_token.get` এ নেই। কারণ token দেখতে token দিয়ে authenticate করতে হলে circular dependency হয়ে যায়।

---

### \_token.put — Token Extend

```javascript
handler._token.put = (requestProperties, callback) => {
  const id = ...; // body থেকে
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? requestProperties.body.extend : false;

  if (id && extend) {
    data.read("tokens", id, (err, tokenData) => {
      let tokenObject = parseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;  // ✅ + হবে * না
        data.update("tokens", id, tokenObject, (err) => {
          if (!err) { callback(200, tokenObject); }
          else { callback(500, { error: "There was a server side error" }); }
        });
      } else {
        callback(400, { error: "Token already expired" });
      }
    });
  } else {
    callback(400, { error: "There was a problem in your request" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**`typeof extend === "boolean" && extend === true`**
`extend` অবশ্যই **boolean** `true` হতে হবে। `"true"` (string) দিলে কাজ করবে না। এটা intentional — user কে explicitly `true` boolean পাঠাতে হবে।

**`tokenObject.expires > Date.now()`**
Token এখনো valid কিনা চেক করছে। আগেই expire হয়ে গেলে extend করা যাবে না।

**Bug Fix:** `Date.now() * 60 * 60 * 1000` → `Date.now() + 60 * 60 * 1000`
`*` দিলে অনেক বড় সংখ্যা হতো। `+` দিয়ে ১ ঘণ্টা যোগ করতে হবে।

---

### \_token.delete — Logout

```javascript
handler._token.delete = (requestProperties, callback) => {
  const id = ...; // query string থেকে

  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete("tokens", id, (err) => {
          if (!err) { callback(200, { message: "Token Deleted successfully" }); }
          else { callback(500, { error: "There was a problem on server side delete" }); }
        });
      } else {
        callback(500, { error: "There was a server side error" });
      }
    });
  } else {
    callback(400, { error: "There was a problem in your request" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**Token delete = Logout**
Token মুছে ফেললে user আর কোনো protected route access করতে পারবে না। এটাই logout।

---

### \_token.verify — Authentication Check (Internal)

```javascript
handler._token.verify = (id, phone, callback) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parseJSON(tokenData).phone === phone &&
        parseJSON(tokenData).expires > Date.now()
      ) {
        callback(true);
      }
    } else {
      callback(false);
    }
  });
};
```

### বিস্তারিত ব্যাখ্যা

**দুটো শর্ত একসাথে চেক:**

1. `parseJSON(tokenData).phone === phone` → Token টা এই user এর কিনা
2. `parseJSON(tokenData).expires > Date.now()` → Token expire হয়নি তো

**কেন `callback(true)` / `callback(false)`?**
এটা internal function — শুধু হ্যাঁ বা না বলে। Router বা user handler সেই হ্যাঁ/না দেখে সিদ্ধান্ত নেয়।

**কোথায় ব্যবহার হয়?**
`userHandler` এবং `checkHandler` এ প্রতিটা protected route এ:

```javascript
tokenHandler._token.verify(token, phone, (tokenId) => {
  if (tokenId) {
    // কাজ করো
  } else {
    callback(403, { error: "Authentication failure!" });
  }
});
```

---

## 📄 ধাপ ১০ — Authentication System

### কীভাবে কাজ করে

```javascript
১. POST /token → Login
   Body: { phone, password }
         ↓
   Password hash করে match করো
         ↓
   Token তৈরি করো (20 char, ১ ঘণ্টা valid)
         ↓
   Token পাও: "99okd1tvrx9zdaci39tk"

২. Protected request এ Header এ token দাও:
   token: 99okd1tvrx9zdaci39tk
         ↓
   Server tokenHandler._token.verify() call করে
         ↓
   Token file পড়ে phone মেলায় + expire চেক করে
         ↓
   ✅ Valid → কাজ হয়
   ❌ Invalid/Expired → 403 Forbidden
```

### Protected vs Unprotected Routes

| Route         | Method | Auth                              | কারণ |
| ------------- | ------ | --------------------------------- | ---- |
| POST /user    | ❌     | নতুন account বানাতে token লাগে না |
| GET /user     | ✅     | নিজের data শুধু নিজে দেখবে        |
| PUT /user     | ✅     | নিজের data শুধু নিজে আপডেট করবে   |
| DELETE /user  | ✅     | নিজেকে শুধু নিজে delete করবে      |
| POST /check   | ✅     | কোন user এর check সেটা জানতে হবে  |
| GET /check    | ✅     | নিজের check শুধু নিজে দেখবে       |
| PUT /check    | ✅     | নিজের check শুধু নিজে আপডেট করবে  |
| DELETE /check | ✅     | নিজের check শুধু নিজে delete করবে |

---

## 📄 ধাপ ১১ — handlers/routeHandlers/checkHandler.js

### \_check.post — নতুন Check তৈরি

```javascript
handler._check.post = (requestProperties, callback) => {
  let protocol = ...; // "http" বা "https" শুধু
  let url = ...;      // non-empty string
  let method = ...;   // "get", "post", "put", "delete" শুধু
  let successCodes = ...; // Array হতে হবে
  let timeoutSeconds = ...; // 1-5 পূর্ণ সংখ্যা

  if (protocol && url && method && successCodes && timeoutSeconds) {
    const token = typeof requestProperties.headersObject.token === "string"
      ? requestProperties.headersObject.token : false;

    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        let userPhone = parseJSON(tokenData).phone;

        data.read("users", userPhone, (err, userData) => {
          if (!err && userData) {
            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = parseJSON(userData);
                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks : [];

                if (userChecks.length < maxChecks) {
                  let checkId = createRandomString(20);
                  let checkObject = { id: checkId, userPhone, protocol, url, method, successCodes, timeoutSeconds };

                  data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      data.update("users", userPhone, userObject, (err) => {
                        if (!err) { callback(200, checkObject); }
                        else { callback(500, { error: "There was a problem in the server side" }); }
                      });
                    } else { callback(500, { error: "There was a problem in the server side" }); }
                  });
                } else {
                  callback(401, { error: "User already reached max check limit" });
                }
              } else { callback(403, { error: "Authentication error" }); }
            });
          } else { callback(403, { error: "user not found" }); }
        });
      } else { callback(403, { error: "Authentication problem" }); }
    });
  } else {
    callback(400, { error: "You have a problem in your request" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**`successCodes instanceof Array` কেন?**

```javascript
typeof []       → "object"  ← Array ও object!
typeof {}       → "object"
[] instanceof Array → true  ✅
{} instanceof Array → false
```

`typeof` দিয়ে Array আর Object আলাদা করা যায় না। তাই `instanceof Array` দিয়ে extra check করতে হয়।

**`timeoutSeconds % 1 === 0`**
পূর্ণ সংখ্যা কিনা check। `%` মানে ভাগশেষ।

```javascript
3   % 1 === 0  ✅ (পূর্ণ সংখ্যা)
2.5 % 1 === 0.5  ❌ (decimal)
```

**কেন token থেকে phone বের করা হচ্ছে?**
Check create করার সময় body তে phone নেই। Token file এ phone আছে — তাই token পড়ে phone বের করা হচ্ছে।

**`userChecks.length < maxChecks`**
User এর আগে থেকে ৫টা check থাকলে আর নতুন check বানানো যাবে না।

**দুটো জায়গায় data save:**

```
১. .data/checks/checkId.json     ← check এর full details
২. .data/users/phone.json        ← checks: ["checkId"] ← শুধু reference
```

User file এ পুরো check object না রেখে শুধু ID রাখা হয়েছে। এতে data duplicate হয় না।

---

### \_check.get — Check দেখা

```javascript
handler._check.get = (requestProperties, callback) => {
  const id = ...; // query string থেকে, ২০ char

  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token = typeof requestProperties.headersObject.token === "string"
          ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(
          token,
          parseJSON(checkData).userPhone,  // ✅ lowercase u
          (tokenIsValid) => {
            if (tokenIsValid) {
              callback(200, parseJSON(checkData));
            } else {
              callback(403, { error: "Authentication error" });
            }
          }
        );
      } else {
        callback(500, { error: "You have a problem in your request" });
      }
    });
  } else {
    callback(400, { error: "You have a problem in your request" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**কেন check পড়ে তারপর verify?**
Token verify করতে phone দরকার। Phone check file এ আছে। তাই আগে check পড়তে হয়।

**`parseJSON(checkData).userPhone`**
Bug ছিল `UserPhone` (বড় U) লেখা ছিল। JavaScript case-sensitive তাই `UserPhone` আর `userPhone` আলাদা। `userPhone` (ছোট u) সঠিক কারণ `_check.post` এ `userPhone` দিয়ে save হয়েছে।

---

### \_check.put — Check আপডেট

```javascript
handler._check.put = (requestProperties, callback) => {
  const id = ...; // query string থেকে

  // optional fields: protocol, url, method, successCodes, timeoutSeconds

  if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      data.read("checks", id, (err, checkData) => {
        if (!err && checkData) {
          let checkObject = parseJSON(checkData);
          const token = ...;

          tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
            if (tokenIsValid) {
              if (protocol)      { checkObject.protocol      = protocol;      }
              if (url)           { checkObject.url           = url;           }
              if (method)        { checkObject.method        = method;        }
              if (successCodes)  { checkObject.successCodes  = successCodes;  }
              if (timeoutSeconds){ checkObject.timeoutSeconds = timeoutSeconds;}

              data.update("checks", id, checkObject, (err) => {
                if (!err) { callback(200); }
                else { callback(500, { error: "There was a server side error" }); }
              });
            } else { callback(403, { error: "Authentication error" }); }
          });
        } else { callback(500, { error: "There was a problem in the server side" }); }
      });
    } else {
      callback(400, { error: "At least one field required" });
    }
  } else {
    callback(400, { error: "You have a problem in your request" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**`_users.put` vs `_check.put` পার্থক্য:**

- `_users.put` এ phone body তে আসে সরাসরি
- `_check.put` এ phone নেই — check file পড়ে `checkObject.userPhone` বের করতে হয়

**"At least one field required"**
`id` আছে কিন্তু update করার কিছু দেওয়া হয়নি — তাহলে update করার কী আছে? এই error তখন।

---

### \_check.delete — Check মুছে ফেলা

```javascript
handler._check.delete = (requestProperties, callback) => {
  const id = ...; // query string থেকে

  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token = ...;
        const checkObject = parseJSON(checkData);

        tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
          if (tokenIsValid) {
            // ধাপ ১: check file মুছো
            data.delete("checks", id, (err) => {
              if (!err) {
                // ধাপ ২: user এর checks[] থেকে id সরাও
                data.read("users", checkObject.userPhone, (err, userData) => {
                  if (!err && userData) {
                    let userObject = parseJSON(userData);
                    let userChecks =
                      typeof userObject.checks === "object" &&
                      userObject.checks instanceof Array
                        ? userObject.checks : [];

                    let checkPosition = userChecks.indexOf(id);

                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);
                      userObject.checks = userChecks;

                      data.update("users", userObject.phone, userObject, (err) => {
                        if (!err) {
                          callback(200, { message: "Check deleted successfully" });
                        } else {
                          callback(500, { error: "Could not update the user" });
                        }
                      });
                    } else {
                      callback(500, { error: "Check ID not found in user's list" });
                    }
                  } else {
                    callback(500, { error: "User not found" });
                  }
                });
              } else {
                callback(500, { error: "Could not delete the check file" });
              }
            });
          } else { callback(403, { error: "Authentication error" }); }
        });
      } else { callback(404, { error: "Check ID not found" }); }
    });
  } else {
    callback(400, { error: "Invalid ID in request" });
  }
};
```

### বিস্তারিত ব্যাখ্যা

**কেন দুটো জায়গায় কাজ করতে হয়?**
Check তৈরির সময় দুটো জায়গায় save হয়েছিল:

```
.data/checks/checkId.json  ← এটা delete করো
.data/users/phone.json     ← checks[] থেকে checkId সরাও
```

একটা মুছলে আরেকটায় orphan data থাকবে।

**`userChecks.indexOf(id)`**
Array তে `id` কোন position এ আছে সেটা বের করছে।

```javascript
["abc", "xyz", "def"].indexOf("xyz")  →  1
["abc", "xyz", "def"].indexOf("zzz")  →  -1  (নেই)
```

**`userChecks.splice(checkPosition, 1)`**
`splice(position, deleteCount)` → `position` থেকে শুরু করে `1`টা element সরাও।

```javascript
["abc", "xyz", "def"].splice(1, 1)
→ ["abc", "def"]  ← "xyz" সরে গেছে
```

**Bug Fix:**

```javascript
// ❌ আগে ছিল
data.update("users", userObject.phone.userObject, callback);

// ✅ সঠিক
data.update("users", userObject.phone, userObject, callback);
```

---

## 📄 ধাপ ১২ — helpers/notifications.js

```javascript
const https = require("https");
const { twilio } = require("./environments");
const querystring = require("querystring");

notifications.sendTwilioSms = (phone, msg, callback) => {
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;

  const userMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (userPhone && userMsg) {
    const payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };

    const stringifyPayload = querystring.stringify(payload);

    const requestDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // ✅ form-urlencoded
      },
    };

    const req = https.request(requestDetails, (res) => {
      const status = res.statusCode;
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status code returned was ${status}`);
      }
    });

    req.on("error", (e) => {
      callback(e);
    });
    req.write(stringifyPayload);
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};
```

### বিস্তারিত ব্যাখ্যা

**Twilio কী?**
Twilio একটা third-party service যেটা দিয়ে programmatically SMS, call করা যায়। আমরা user কে notify করতে ব্যবহার করছি।

**`msg.trim().length <= 1600`**
Twilio SMS এর maximum limit ১৬০০ character। এর বেশি দিলে Twilio error দেবে।

**`To: \`+88${userPhone}\``**
`+88` = Bangladesh এর country code। তাই `01234567890` হয়ে যায় `+8801234567890`।

**`querystring.stringify(payload)`**
Twilio API `application/x-www-form-urlencoded` format চায়। এই format এ object কে convert করে:

```javascript
{ From: "+1XXX", To: "+88...", Body: "Hello" }
→ "From=%2B1XXX&To=%2B88...&Body=Hello"
```

**`req.write(stringifyPayload)`**
POST request এর body লেখা হচ্ছে।

**`req.end()`**
Request শেষ করা হচ্ছে। এটা না দিলে request পাঠানো হবে না।

**Bug Fix:**

```javascript
// ❌ ভুল spelling
"Content-Type": "application/x-www-urlencoded"

// ✅ সঠিক
"Content-Type": "application/x-www-form-urlencoded"
```

---

## 📄 ধাপ ১৩ — lib/worker.js

```javascript
const url = require("url");
const http = require("http");
const https = require("https");
const { parseJSON } = require("../helpers/utilities");
const data = require("./data");
const { sendTwilioSms } = require("../helpers/notifications");

const worker = {};
```

### worker.init — শুরু করা

```javascript
worker.init = () => {
  worker.gatherAllChecks();
  worker.loop();
};
```

**ব্যাখ্যা:** Server init হলে worker ও init হয়। প্রথমে একবার সব check করে, তারপর loop এ বারবার করতে থাকে।

---

### worker.loop — বারবার চালানো

```javascript
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 5000);
};
```

**`setInterval`** → নির্দিষ্ট সময় পরপর function চালায়। `5000` ms = ৫ সেকেন্ড।

---

### worker.gatherAllChecks — সব Check খোঁজা

```javascript
worker.gatherAllChecks = () => {
  data.list("checks", (err, checks) => {
    if (!err && checks && checks.length > 0) {
      // ✅ && হবে & না
      checks.forEach((check) => {
        data.read("checks", check, (err, originalCheckData) => {
          if (!err && originalCheckData) {
            worker.validateCheckData(parseJSON(originalCheckData));
          } else {
            console.log("Error: reading one of the checks data!");
          }
        });
      });
    } else {
      console.log("Error: could not find any checks to process");
    }
  });
};
```

**ব্যাখ্যা:**
`data.list("checks")` → `.data/checks/` এর সব file এর নাম পায়। তারপর প্রতিটার জন্য `data.read` করে `validateCheckData` এ পাঠায়।

**Bug Fix:** `checks & checks.length` → `checks && checks.length`
`&` হলো bitwise AND (numbers এর জন্য), `&&` হলো logical AND (conditions এর জন্য)।

---

### worker.validateCheckData — Data Validate করা

```javascript
worker.validateCheckData = (originalCheckData) => {
  let originalData = originalCheckData;
  if (originalCheckData && originalCheckData.id) {
    originalData.state =
      typeof originalCheckData.state === "string" &&
      ["up", "down"].indexOf(originalCheckData.state) > -1
        ? originalCheckData.state
        : "down";

    originalData.lastChecked =
      typeof originalCheckData.lastChecked === "number" &&
      originalCheckData.lastChecked > 0
        ? originalCheckData.lastChecked
        : false;

    worker.performCheck(originalCheckData);
  } else {
    console.log("Error: check was invalid or not properly formatted");
  }
};
```

**ব্যাখ্যা:**

- `state` → `"up"` বা `"down"` হতে হবে। না থাকলে default `"down"`।
- `lastChecked` → কখন শেষ check হয়েছিল। প্রথমবার `false`।
- Valid হলে `performCheck` এ পাঠাও।

---

### worker.performCheck — URL Ping করা

```javascript
worker.performCheck = (originalCheckData) => {
  let checkOutCome = { error: false, responseCode: false };
  let outComeSent = false; // ✅ let হবে const না

  const parsedUrl = url.parse(
    originalCheckData.protocol + "://" + originalCheckData.url,
    true,
  );
  const hostname = parsedUrl.hostname;
  const path = parsedUrl.path;

  const requestDetails = {
    protocol: originalCheckData.protocol + ":",
    hostname,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeoutSeconds * 1000,
  };

  const protocolToUse = originalCheckData.protocol === "http" ? http : https;

  let req = protocolToUse.request(requestDetails, (res) => {
    checkOutCome.responseCode = res.statusCode;
    if (!outComeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutCome);
      outComeSent = true;
    }
  });

  req.on("error", (e) => {
    checkOutCome = { error: true, value: e };
    if (!outComeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutCome);
      outComeSent = true;
    }
  });

  req.on("timeout", () => {
    checkOutCome = { error: true, value: "timeout" };
    if (!outComeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutCome);
      outComeSent = true;
    }
  });

  req.end();
};
```

**ব্যাখ্যা:**

**`outComeSent` flag কেন?**
একটা request এ তিনটা event হতে পারে: response, error, timeout। একবার `processCheckOutcome` call হলে আর call হওয়া উচিত না। `outComeSent` flag দিয়ে এটা নিশ্চিত করা হচ্ছে।

**`const` না দিয়ে `let` কেন?**
`outComeSent = true` করতে হবে পরে। `const` দিলে reassign করা যায় না।

**`protocolToUse`**
Check এর protocol অনুযায়ী `http` বা `https` module ব্যবহার হচ্ছে। দুটোর API একই তাই এভাবে করা যাচ্ছে।

**`timeout: originalCheckData.timeoutSeconds * 1000`**
`timeoutSeconds` কে milliseconds এ convert করা হচ্ছে। 3 সেকেন্ড = 3000ms।

---

### worker.processCheckOutcome — Result Process করা

```javascript
worker.processCheckOutcome = (originalCheckData, checkOutCome) => {
  let state =
    !checkOutCome.error &&
    checkOutCome.responseCode &&
    originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
      ? "up"
      : "down";

  let alertWanted =
    originalCheckData.lastChecked && originalCheckData.state !== state
      ? true
      : false;

  let newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  data.update("checks", newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log("Alert is not needed as there is no state change");
      }
    } else {
      console.log("Error trying to save check data!");
    }
  });
};
```

**ব্যাখ্যা:**

**`state` কীভাবে ঠিক হয়?**
তিনটা শর্ত একসাথে true হলে `"up"`:

1. `!checkOutCome.error` → কোনো error নেই
2. `checkOutCome.responseCode` → response code আছে
3. `successCodes.indexOf(responseCode) > -1` → response code successCodes এ আছে

যেকোনো একটা false হলে `"down"`।

**`alertWanted`**
দুটো শর্ত:

1. `originalCheckData.lastChecked` → আগে check হয়েছে (প্রথমবার alert না)
2. `originalCheckData.state !== state` → state বদলেছে

দুটোই true হলেই alert যাবে। প্রথমবার check এ alert যাবে না কারণ `lastChecked = false`।

---

### worker.alertUserToStatusChange — SMS পাঠানো

```javascript
worker.alertUserToStatusChange = (newCheckData) => {
  let msg = `Alert your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;

  sendTwilioSms(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`User was alerted to a status change via SMS`);
    } else {
      console.log("There was a problem sending sms!");
    }
  });
};
```

**SMS এর format:**

```
Alert your check for GET https://google.com is currently down
```

---

## 📄 ধাপ ১৪ — lib/server.js (আলাদা করা হয়েছে)

```javascript
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
const environment = require("../helpers/environments");

const server = {};

server.createServer = () => {
  const createServerVariable = http.createServer(server.handleReqRes);
  createServerVariable.listen(environment.port, () => {
    console.log(`Listening to port ${environment.port}`);
  });
};

server.handleReqRes = handleReqRes;

server.init = () => {
  server.createServer();
};

module.exports = server;
```

**কেন আলাদা করা হলো?**
আগে server logic `index.js` এ ছিল। Worker যোগ হওয়ার পর `index.js` এ দুটো বড় concern ছিল — server এবং worker। Separation of Concerns নীতি অনুযায়ী আলাদা করা হয়েছে।

**`index.js` এখন শুধু orchestrator:**

```javascript
app.init = () => {
  server.init(); // server চালাও
  workers.init(); // worker চালাও
};
```

## 📊 HTTP Status Codes

| Code  | মানে                  | কখন ব্যবহার                      |
| ----- | --------------------- | -------------------------------- |
| `200` | OK                    | সফল                              |
| `400` | Bad Request           | validation fail বা missing field |
| `401` | Unauthorized          | max check limit পার হয়েছে       |
| `403` | Forbidden             | authentication fail              |
| `404` | Not Found             | data খুঁজে পাওয়া যায়নি         |
| `405` | Method Not Allowed    | invalid HTTP method              |
| `500` | Internal Server Error | server side যেকোনো সমস্যা        |

---

## 🔑 মূল Concepts Summary

| Concept                | কোথায় ব্যবহার             | কেন                             |
| ---------------------- | -------------------------- | ------------------------------- |
| Module Scaffolding     | সব handler, lib            | সব related কোড একসাথে রাখা      |
| Separation of Concerns | server.js, worker.js আলাদা | প্রতিটা ফাইলের একটাই কাজ        |
| Callback Pattern       | data.js সব method          | Async operations handle করতে    |
| Streaming              | handleReqRes body পড়া     | Node.js data chunk এ পাঠায়     |
| One-way Hashing        | password save              | original বের করা যাবে না        |
| Token Auth             | protected routes           | কে request করছে verify করা      |
| File as DB             | .data/ folder              | Database ছাড়া data persist করা |
| Background Worker      | worker.js                  | User request ছাড়াই কাজ করে     |

---

## 🚀 Project চালানো

```bash
# Install
npm install

# Staging (port 3000)
npm start

# Production (port 5000)
npm run production
```

### Postman দিয়ে Test করার Serial

```js
১. POST /user         → নতুন user বানাও
২. POST /token        → login করো, token পাও
৩. GET /user          → user দেখো (Header: token)
৪. PUT /user          → user আপডেট করো (Header: token)
৫. POST /check        → check তৈরি করো (Header: token)
৬. GET /check         → check দেখো (Header: token)
৭. PUT /check         → check আপডেট করো (Header: token)
৮. PUT /token         → token extend করো
৯. DELETE /check      → check মুছো (Header: token)
১০. DELETE /user      → user মুছো (Header: token)
১১. DELETE /token     → logout করো
```
