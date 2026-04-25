# Raw Node.js Basic to Advanced

---

## 3-Install and update 'yarn'

Please follow the instructions to install or update yarn in your machine.

**On Windows**

1. Install yarn

   ```js
   npm install -g yarn
   ```

2. Update yarn

   ```js
   yarn set version latest
   ```

### VS Code Editor Setup

In order to follow along the tutorial series, I recommend you to use Visual Studio Code Editor and install & apply the below extensions and settings.

### Extensions

Install the extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Path Autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete)

### Settings

Go to your Visual Studio Code `settings.json` file and add the below settings there:

```json
// config related to code formatting
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
"[javascript]": {
  "editor.formatOnSave": false,
  "editor.defaultFormatter": null
},
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true,
  "source.organizeImports": true
},
"eslint.alwaysShowStatus": true
```

### Set Line Breaks

Make sure in your VS Code Editor, "LF" is selected as line feed instead of CRLF (Carriage return and line feed). To do that, just click LF/CRLF in bottom right corner of editor, click it and change it to "LF". If you don't do that, you will get errors in my setup.

![Line Feed](https://github.com/learnwithsumit/nodejs-basic-bangla/raw/master/images/line-feed.jpg)

### Linting Setup

In order to lint and format your code automatically according to the popular Airbnb style guide, follow the instructions as described in the video. References are as follows.

### Install Dev Dependencies

```tsx
yarn add -D eslint prettier
npx install-peerdeps --dev eslint-config-airbnb-base
yarn add -D eslint-config-prettier eslint-plugin-prettier
```

### Set up Linting Configuration file

Create a `.eslintrc.json` file in the project root and enter the following contents:

```tsx
{
  "extends": ["prettier", "airbnb-base"],
  "parserOptions": {
    "ecmaVersion": 12
  },
  "env": {
    "commonjs": true,
    "node": true
  },
  "rules": {
    "no-console": 0,
    "indent": 0,
    "linebreak-style": 0,
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 100,
        "tabWidth": 4,
        "semi": true
      }
    ]
  },
  "plugins": ["prettier"]
}
```

# 4-Global Object & Module System

This document covers the essential internal workings of Node.js modules, including global-like variables and the wrapper function.

## \_\_dirname

`__dirname` provides the absolute path of the directory that contains the current JavaScript file. It does not include the filename.

```js
console.log("folder path: ", __dirname);
```

- **Example:** If your file is at `/users/project/app.js`, `__dirname` will be `/users/project`.
- **Purpose:** Used for dynamic path resolution when reading/writing files.

---

## \_\_filename

`__filename` provides the **absolute path** of the current JavaScript file, including the filename and its extension.

```js
console.log("file path: ", __filename);
```

- **Example:** `/users/project/app.js`.
- **Key Difference:** Unlike `__dirname`This variable points specifically to the file itself.

---

## Module System in Node.js

Node.js uses the **CommonJS (CJS)** module system, where every file is treated as an isolated module.

### Core Mechanism:

- **`module.exports`**: Used to expose functions, objects, or variables from a module so they can be used in other files.
- **`require()`**: A built-in function used to import or "include" a module from another file.

**Code Example:**

```jsx
// In people.js
const people = ["sakib", "tamim"];
module.exports = people;

// In index.js
const peopleData = require("./people");
console.log(peopleData);
```

## Module Wrapper Function

Every time Node.js executes a file, it wraps the code inside a hidden function before running it. This is known as the **Module Wrapper Function**.

### The Structure:

```tsx
// JavaScript (IIFE function)
(function (exports, require, module, __filename, __dirname) {
  // YOUR CODE IS PLACED HERE INTERNALLY
});
```

### Why is it important:

1. **Scoping:** It keeps top-level variables (declared with `var`, `let` or `const`) local to the module rather than the global object. This prevents variable name conflicts between files.
2. **Dependency Injection:** It provides the module-specific variables (`require`, `module`, etc.) that are necessary for the module system to function.

# 5-Node.js Server & Core Modules

### Path Module

The `node:path` module provides utilities for working with file and directory paths. It can be accessed using:

1. The `path.basename()` method returns the last portion of a `path`, similar to the Unix `basename` command. It returns the very last part of a path (the file name). If you pass the extension as the second parameter, it will return just the file name.
2. The `path.dirname()` method returns the directory name of a `path` . It returns the location of the entire directory or folder preceding a path, excluding the file name.
3. The `path.extname()` method returns the extension of the `path`, from the last occurrence of the `.` (period) character to end of string in the last portion of the `path`.
4. The `path.parse()` method returns an object whose properties represent significant elements of the `path`.
5. For more, visit

```jsx
 https://www.w3schools.com/nodejs/nodejs_path.asp`
```

```jsx
const path = require("path");
const myPath = "D:/Next Level Development/NodeJS-Learn-With-Sumit/index.js";

console.log(path.basename(myPath));
// index.js
console.log(path.dirname(myPath));
// D:/Next Level Development/NodeJS-Learn-With-Sumit
console.log(path.extname(myPath));
// .js
console.log(path.parse(myPath));
//  {
//   root: 'D:/',
//   dir: 'D:/Next Level Development/NodeJS-Learn-With-Sumit',
//   base: 'index.js',
//   ext: '.js',
//   name: 'index'
//  }
```

### OS Module

The `node:os` module provides operating system-related utility methods and properties. It can be accessed using:

1. **`os.freemem()`**Returns the amount of free system memory in bytes as an integer.
2. **`os.cpus()`**Returns an array of objects containing information about each logical CPU core. The information includes model, speed (in MHz), and times.
3. for more, visit

```jsx
https://www.w3schools.com/nodejs/nodejs_os.asp
```

```jsx
const os = require("os");
console.log(os.freemem());
// 6196547584
console.log(os.cpus());
// {
//  model: 'Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz',
//  speed: 2904,
//  times: { user: 3503406, nice: 0, sys: 119390, idle: 38171, irq: 21265 }
//  }, .......
```

### File System (fs) Module

- **`require('fs')`**: To include the File System module, use the `require()` method.
- **`writeFileSync()`**: This method creates a new file if it does not exist. If the file already exists, Node.js **replaces** the existing file and its content.
- **`appendFileSync()`**: This method **appends** (adds) specified content to a file. If the file does not exist, it will be created.
- **`readFileSync()`**: This method is used to read files on your computer. By default, it returns raw binary data called a **Buffer**.
- **`toString()`**: Since the output is a Buffer (hexadecimal numbers), we use `.toString()` to convert that data into a human-readable string.

```jsx
- For more, Visit->  https://www.w3schools.com/nodejs/nodejs_filesystem.asp
```

```jsx
const fs = require("fs");
// Read file synchronously
fs.writeFileSync("myFile.txt", "Hello Programmers");
fs.appendFileSync("myFile.txt", " How are you");

const data = fs.readFileSync("myFile.txt");
//This method is used to read files on your computer. By default, it returns raw binary data called a **Buffer**.
console.log(data);
// <Buffer 48 65 6c 6c 6f 20 50 72 6f 67 72 61 6d 6d 65 72 73 20 48 6f 77 20 61 72 65 20 79 6f 75>

console.log(data.toString());
// Hello Programmers How are you
```

- In `Node.js`, Asynchronous means "don't wait." The fs.readFile() method is non-blocking.
- যখন তুমি fs.readFile কল করলে, Node.js ফাইলটি পড়ার কাজ শুরু করে দিল কিন্তু সেটির জন্য অপেক্ষা না করে সাথে সাথে নিচের লাইনে চলে গেল এবং console.log('hello') প্রিন্ট করে দিল।
- Callback: ফাইলের পড়া শেষ হলে Node.js মনে করিয়ে দেয়, "হে! আমার পড়া শেষ, এখন এই ফাংশনটি চালাও।" তখন (err, data) ফাংশনটি রান হয় এবং ফাইলের লেখা স্ক্রিনে দেখায়।

```jsx
// Read file asynchronously with callback
fs.readFile("myFile.txt", (err, data) => {
  console.log(data.toString());
});
console.log("hello");
// hello
// Hello Programmers How are you
```

### Event Module

- **`EventEmitter` Class:** To use events, you must require the `events` module. All event properties and methods are an instance of the `EventEmitter` object.
- **Registering a Listener (`on` method):** This is like setting an alarm. You are telling Node.js, "When the 'bellRing' event happens, execute this function."
- **Multiple Listeners:** You can register multiple listeners for the same event. They will be executed in the order they were registered.
- **Raising an Event (`emit` method):** This is the action that triggers the event. It's like actually pressing the doorbell.
- **Passing Arguments:** You can pass data (strings, objects, etc.) through the `emit()` method, which the listener function receives as parameters.

```tsx
const EventEmitter = require("events");
const emitter = new EventEmitter();

// register a listener for bellRing
emitter.on("bellRing", () => {
  console.log("We need to run because ");
});
// raise an event
emitter.emit("bellRing");

// Another process When we need parameter and timer
emitter.on("bellRing", (period) => {
  console.log(`We need to run because ${period}`);
});
setTimeout(() => {
  emitter.emit("bellRing", "second period ended");
}, 2000);

// Another Process When we need multiple parameter and timer
emitter.on("bellRing", ({ period, text }) => {
  console.log(`We need to run because ${period} ${text}`);
});
setTimeout(() => {
  emitter.emit("bellRing", {
    period: "first",
    text: "period ended",
  });
}, 2000);
```

### Real Project

- When we need to import data from another file to use the events module

```tsx
// In school.js file we require events
const EventEmitter = require("events");

class School extends EventEmitter {
  startPeriod() {
    console.log("Class Started");

    // raise event when bell rings
    // raise an event
    setTimeout(() => {
      this.emit("bellRing", {
        period: "first",
        text: "period ended",
      });
    }, 2000);
  }
}
module.exports = School;

// In index.js to use events(school.js er events ta)
const School = require("./school");
const school = new School();

school.on("bellRing", ({ period, text }) => {
  console.log(`We need to run because ${period} ${text}`);
});
school.startPeriod();
// Output =>
// Class Started
// We need to run because first period ended
```

### HTTP Module

The `http` module allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP).

### Basic Server Structure:

1. **Create:** `http.createServer()` starts the server logic.
2. **Response:** `res.write()` sends data, `res.end()` finishes the connection.
3. **Listen:** `server.listen(port)` keeps the server running to accept requests.

> **Note:** If you don't call `res.end()`, the browser will keep loading indefinitely.

```jsx
const http = require("http");

const server = http.createServer((req, res) => {
  res.write("Hello Programmers!");
  res.write("How are you?");
  res.end();
});
server.listen(3000);
console.log("listening on port 3000");
```

# 6- Node.js — Stream & Buffer

---

## 🔷 Stream ও Buffer কী?

### Buffer

Buffer হলো **অস্থায়ী মেমোরি স্টোরেজ** যেখানে raw binary data রাখা হয়।

> 💡 **সহজ কথায়:** Buffer = পানির বালতি 🪣 — সব data একসাথে ধরে রাখে

```js
// String থেকে Buffer তৈরি
const buffer1 = Buffer.from("Hello, Dhaka!");
console.log(buffer1); // <Buffer 48 65 6c 6c 6f ...>
console.log(buf1.toString()); // Hello, Dhaka!

// নির্দিষ্ট সাইজের Buffer (zero-filled)
const buffer2 = Buffer.alloc(4);
console.log(buffer2); // <Buffer 00 00 00 00>

// Array থেকে Buffer
const buffer3 = Buffer.from([72, 101, 108, 108, 111]);
console.log(buffer3.toString()); // Hello
```

### Buffer-এর গুরুত্বপূর্ণ Methods

```js
const buf = Buffer.from("Hello World");

buf.length; // 11 — দৈর্ঘ্য
buf.slice(0, 5).toString(); // 'Hello' — নির্দিষ্ট অংশ
buf.toString("hex"); // hex format
buf.toString("base64"); // base64 format
Buffer.isBuffer(buf); // true — Buffer কিনা চেক
Buffer.concat([buf1, buf2]); // দুটো Buffer জোড়া দেওয়া
```

### Stream

Stream হলো data-এর ক্রমাগত প্রবাহ — পুরো data একসাথে না এনে **chunk** করে পাঠায়।

> 💡 **সহজ কথায়:** Stream = পানির পাইপ 🚰 — ধীরে ধীরে বয়ে যায়

**Stream ৪ ধরনের:**

| ধরন         | কাজ                    | উদাহরণ                       |
| ----------- | ---------------------- | ---------------------------- |
| `Readable`  | শুধু data পড়া         | File পড়া, HTTP request body |
| `Writable`  | শুধু data লেখা         | File লেখা, HTTP response     |
| `Duplex`    | পড়া + লেখা দুটোই      | TCP socket                   |
| `Transform` | পড়ে, বদলে, তারপর লেখে | gzip, encryption             |

## 🔷 Example — Incoming Request

HTTP request আসলে সেটা একটা **Readable Stream** হিসেবে আসে — পুরো body একসাথে নয়, chunk করে।

```js
const http = require("http");

const server = http.createServer((req, res) => {
  let body = "";

  // data event — প্রতিটি chunk আসলে fire হয়
  req.on("data", (chunk) => {
    console.log("Chunk:", chunk);
    body += chunk.toString();
  });

  // end event — পুরো request body আসা শেষ
  req.on("end", () => {
    console.log("পুরো body:", body);
    res.end("Request পেয়েছি!");
  });
});

server.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
```

> ⚠️ **গুরুত্বপূর্ণ:** Request body কখনো একসাথে আসে না। বড় POST request হলে অনেকগুলো `data` event fire হয়। সবগুলো chunk জোড়া দিলে তবেই পুরো body পাওয়া যায়।

---

## 🔷 Read Stream কী?

Readable Stream দিয়ে data **পড়া** হয় — file, HTTP request, অথবা যেকোনো data source থেকে।

```js
const fs = require("fs");

const readable = fs.createReadStream("bigfile.txt", {
  encoding: "utf8",
  highWaterMark: 16 * 1024, // chunk size: 16KB (default: 64KB)
});

// data event — প্রতিটি chunk আসলে fire হয়
readable.on("data", (chunk) => {
  console.log("Chunk পেলাম:", chunk.length, "bytes");
  console.log(Buffer.isBuffer(chunk)); // encoding না দিলে true
});

// end event — সব data পড়া শেষ
readable.on("end", () => {
  console.log("পড়া শেষ!");
});

// error event — কোনো সমস্যা হলে
readable.on("error", (err) => {
  console.error("Error:", err);
});
```

**Readable Stream-এর events:**

| Event   | কখন fire হয়         |
| ------- | -------------------- |
| `data`  | প্রতিটি chunk আসলে   |
| `end`   | সব data পড়া শেষ হলে |
| `error` | কোনো error হলে       |
| `close` | stream বন্ধ হলে      |

---

## 🔷 Example — File System

File System থেকে বড় file পড়ার real example:

```js
const fs = require("fs");

// ❌ এভাবে করলে পুরো file একসাথে memory-তে আসে — বড় file-এ সমস্যা
fs.readFile("bigfile.txt", (err, data) => {
  console.log(data);
});

// ✅ Stream দিয়ে chunk করে পড়া — memory efficient
const readable = fs.createReadStream("bigfile.txt");

let totalBytes = 0;

readable.on("data", (chunk) => {
  totalBytes += chunk.length;
  console.log(`এখন পর্যন্ত পড়েছি: ${totalBytes} bytes`);
});

readable.on("end", () => {
  console.log(`মোট পড়েছি: ${totalBytes} bytes`);
});
```

**File copy করা Stream দিয়ে:**

```js
const fs = require("fs");

const readable = fs.createReadStream("input.txt");
const writable = fs.createWriteStream("output.txt");

readable.on("data", (chunk) => {
  writable.write(chunk);
});

readable.on("end", () => {
  writable.end();
  console.log("File copy সম্পন্ন!");
});
```

---

## 🔷 Example — Incoming Request with HTTP Server

HTTP server-এ incoming request-এর data stream করে নিয়ে process করা:

```js
const http = require("http");

const server = http.createServer((req, res) => {
  // শুধু POST request handle করব
  if (req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();

      // সতর্কতা: অনেক বড় body আসলে থামিয়ে দাও
      if (body.length > 1e6) {
        req.destroy();
        res.writeHead(413);
        res.end("Request body অনেক বড়!");
      }
    });

    req.on("end", () => {
      console.log("Body পেয়েছি:", body);

      // JSON parse করা
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "সফল!", data }));
      } catch (e) {
        res.writeHead(400);
        res.end("Invalid JSON");
      }
    });
  } else {
    res.writeHead(200);
    res.end("Hello!");
  }
});

server.listen(3000);
```

---

## 🔷 Write Stream

Writable Stream দিয়ে data **লেখা** হয় — file, HTTP response, অথবা যেকোনো destination-এ।

```js
const fs = require("fs");

const writable = fs.createWriteStream("output.txt");

// data লেখা
writable.write("প্রথম লাইন\n");
writable.write("দ্বিতীয় লাইন\n");
writable.write("তৃতীয় লাইন\n");

// লেখা শেষ করা
writable.end("শেষ লাইন\n");

// finish event — সব লেখা শেষ হলে
writable.on("finish", () => {
  console.log("লেখা সম্পন্ন!");
});

// error event
writable.on("error", (err) => {
  console.error("Error:", err);
});
```

**HTTP Response-এ Writable Stream:**

```js
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  // res হলো একটা Writable Stream
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("প্রথম অংশ\n");
  res.write("দ্বিতীয় অংশ\n");
  res.end("শেষ অংশ"); // লেখা শেষ
});

server.listen(3000);
```

**Writable Stream-এর events:**

| Event    | কখন fire হয়                     |
| -------- | -------------------------------- |
| `finish` | সব data লেখা শেষ হলে             |
| `drain`  | buffer খালি হলে (আবার লেখা যাবে) |
| `error`  | কোনো error হলে                   |

---

## 🔷 Pipe কী?

`pipe()` দিয়ে একটা **Readable Stream-এর output** সরাসরি একটা **Writable Stream-এ** পাঠানো যায়।

> 💡 **সহজ কথায়:** দুটো পাইপ জোড়া দেওয়া — একটা থেকে বের হয়ে সরাসরি আরেকটায় ঢোকে।

```js
const fs = require("fs");

// File copy — সবচেয়ে সহজ উপায়
const readStream = fs.createReadStream("input.txt");
const writeStream = fs.createWriteStream("output.txt");

readStream.pipe(writeStream);

writeStream.on("finish", () => {
  console.log("Copy সম্পন্ন!");
});
```

**HTTP server-এ file stream করা:**

```js
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "video/mp4" });

  // file সরাসরি response-এ stream করা
  fs.createReadStream("video.mp4").pipe(res);
});

server.listen(3000);
```

> ⚠️ **সমস্যা:** `pipe()` নিজে থেকে error handle করে না। কোনো step-এ error হলে stream ঠিকমতো বন্ধ নাও হতে পারে।

---

## 🔷 Transform Stream

Transform Stream একই সাথে **পড়ে, বদলায়, এবং লেখে**

## 🔷 Backpressure

Backpressure হলো যখন **Writable stream, Readable stream-এর চেয়ে ধীরে** data নিতে পারে।

## 🔷 pipeline() vs pipe()

```js
// ❌ pipe() — error handle করে না
readable.pipe(transform).pipe(writable);

// ✅ pipeline() — error handle করে (Node.js 10+)
const { pipeline } = require("stream");

pipeline(
  fs.createReadStream("input.txt"),
  zlib.createGzip(),
  fs.createWriteStream("output.txt.gz"),
  (err) => {
    if (err) console.error("Pipeline failed:", err);
    else console.log("Done!");
  },
);
```
