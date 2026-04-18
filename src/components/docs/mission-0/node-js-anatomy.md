# Standard Node.js Application Architecture

```jsx
/*
 * Title: Basic Node app example
 * Description: Simple node application that print random quotes per second interval.
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/09/19
 *
 */

// Dependencies
const mathLibrary = require("./lib/math");
const quotesLibrary = require("./lib/quotes");

// App object - Module scaffolding
const app = {};

// Configuration
app.config = {
  timeBetweenQuotes: 1000,
};

// Function that prints a random quote
app.printAQuote = function printAQuote() {
  // Get all the quotes
  const allQuotes = quotesLibrary.allQuotes();

  // Get the length of the quotes
  const numberOfQuotes = allQuotes.length;

  // Pick a random number between 1 and the number of quotes
  const randomNumber = mathLibrary.getRandomNumber(1, numberOfQuotes);

  // Get the quote at that position in the array (minus one)
  const selectedQuote = allQuotes[randomNumber - 1];

  // Print the quote to the console
  console.log(selectedQuote);
};

// Function that loops indefinitely, calling the printAQuote function as it goes
app.indefiniteLoop = function indefiniteLoop() {
  // Create the interval, using the config variable defined above
  setInterval(app.printAQuote, app.config.timeBetweenQuotes);
};

// Invoke the loop
app.indefiniteLoop();
```

## Building Blocks কী?

Node.js application তৈরি করতে কিছু মূল উপাদান লাগে — এগুলোকে **Building Blocks** বলে।

### ১. Modules

Node.js-এ প্রতিটি file একটা **module**। `require()` দিয়ে এক file থেকে আরেক file-এর code ব্যবহার করা যায়।

```js
// math.js — নিজের module তৈরি
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };
```

```js
// app.js — module import করা
const { add, subtract } = require("./math");

console.log(add(5, 3)); // 8
console.log(subtract(10, 4)); // 6
```

### ২. Built-in Modules

Node.js-এ অনেক built-in module আছে — install ছাড়াই ব্যবহার করা যায়।

```js
const fs = require("fs"); // File System
const http = require("http"); // HTTP Server
const path = require("path"); // File Path
const os = require("os"); // Operating System info
```

### ৩. NPM Packages (Third-party Modules)

```bash
npm init -y               # package.json তৈরি
npm install express       # package install
npm install nodemon --save-dev # dev dependency
```

```js
const express = require("express"); // third-party module
```

### ৪. Functions

Node.js-এ **function** হলো সবচেয়ে গুরুত্বপূর্ণ building block।

```js
// Regular function
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow function
const greet = (name) => `Hello, ${name}!`;

// Callback function
function processData(data, callback) {
  const result = data.toUpperCase();
  callback(result);
}

processData("hello", (result) => {
  console.log(result); // HELLO
});
```

### ৫. Objects

```js
// Object তৈরি
const user = {
  name: "Rahim",
  age: 25,
  greet() {
    return `আমি ${this.name}`;
  },
};

console.log(user.greet()); // আমি Rahim
```

### ৬. Events

Node.js **event-driven** — কিছু ঘটলে event fire হয়, listener সেটা handle করে।

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

// Event listener register করা
emitter.on("dataReceived", (data) => {
  console.log("Data পেয়েছি:", data);
});

// Event fire করা
emitter.emit("dataReceived", { name: "Rahim" });
// Output: Data পেয়েছি: { name: 'Rahim' }
```

---

## 🔷 Application-এর Anatomy

একটা Node.js application সাধারণত নির্দিষ্ট structure অনুসরণ করে।

### Folder Structure

```js
my-app/
│
├── node_modules/        # installed packages (git-এ রাখবে না)
│
├── src/                 # মূল source code
│   ├── controllers/     # request handle করার logic
│   ├── models/          # data structure / database schema
│   ├── routes/          # URL routing
│   ├── middlewares/     # middleware functions
│   └── utils/           # helper functions
│
├── .env                 # environment variables (git-এ রাখবে না)
├── .gitignore           # git ignore list
├── package.json         # project info & dependencies
├── package-lock.json    # exact dependency versions
└── app.js               # main entry point
```

### Entry Point (app.js)

```js
const http = require("http");

// Server তৈরি
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World!");
});

// Port-এ listen করা
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server চলছে: http://localhost:${PORT}`);
});
```

### Environment Variables (.env)

```bash
# .env file
PORT=3000
DB_URL=mongodb://localhost:27017/mydb
SECRET_KEY=mysecretkey123
```

```js
// dotenv দিয়ে .env load করা
require("dotenv").config();

console.log(process.env.PORT); // 3000
console.log(process.env.SECRET_KEY); // mysecretkey123
```

### package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "আমার Node.js app",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Random Number Generator — Example

```js
// utils/random.js
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { getRandomNumber };
```

```js
// app.js
const { getRandomNumber } = require("./utils/random");

console.log(getRandomNumber(1, 100)); // 1-100 এর মধ্যে random number
```

---

## 🔷 Good Code কী?

**Good Code** মানে শুধু কাজ করা code নয় — এমন code যা পড়া, বোঝা এবং বদলানো সহজ।

### ১. Readable — পড়তে সহজ

```js
// ❌ খারাপ — কী করছে বোঝা যায় না
function p(a, b) {
  return a * b * 0.18;
}

// ✅ ভালো — নাম দেখেই বোঝা যায়
function calculateVAT(price, quantity) {
  const VAT_RATE = 0.18;
  return price * quantity * VAT_RATE;
}
```

### ২. Single Responsibility — একটা function একটাই কাজ করবে

```js
// ❌ খারাপ — একটা function অনেক কাজ করছে
function handleUser(user) {
  // validate করছে
  if (!user.name) throw new Error("Name required");
  // database-এ save করছে
  db.save(user);
  // email পাঠাচ্ছে
  sendEmail(user.email, "Welcome!");
  // log করছে
  console.log("User created:", user.name);
}

// ✅ ভালো — আলাদা আলাদা function
function validateUser(user) {
  if (!user.name) throw new Error("Name required");
}

function saveUser(user) {
  return db.save(user);
}

function sendWelcomeEmail(email) {
  return sendEmail(email, "Welcome!");
}

function logUser(user) {
  console.log("User created:", user.name);
}
```

### ৩. DRY — Don't Repeat Yourself

```js
// ❌ খারাপ — একই code বারবার লেখা
console.log("নাম: " + user1.name.toUpperCase());
console.log("নাম: " + user2.name.toUpperCase());
console.log("নাম: " + user3.name.toUpperCase());

// ✅ ভালো — একবার লিখে বারবার ব্যবহার
function printName(user) {
  console.log("নাম: " + user.name.toUpperCase());
}

printName(user1);
printName(user2);
printName(user3);
```

### ৪. Error Handling — সবসময় error handle করো

```js
// ❌ খারাপ — error handle নেই
const data = JSON.parse(userInput);

// ✅ ভালো — error handle আছে
try {
  const data = JSON.parse(userInput);
  console.log(data);
} catch (err) {
  console.error("Invalid JSON:", err.message);
}
```

### ৫. Meaningful Comments

```js
// ❌ খারাপ — obvious জিনিসে comment
// i-কে 1 বাড়াও
i++;

// ✅ ভালো — কেন করছো সেটা explain করো
// VAT calculation-এ 18% হার বাংলাদেশ সরকারের নির্দেশনা অনুযায়ী
const VAT_RATE = 0.18;
```

### ৬. Consistent Naming Convention

```js
// Variables & Functions — camelCase
const userName = "Rahim";
function getUserData() {}

// Constants — UPPER_SNAKE_CASE
const MAX_RETRY = 3;
const API_URL = "https://api.example.com";

// Classes — PascalCase
class UserController {}
class DatabaseConnection {}

// Files — kebab-case বা camelCase
// user-controller.js অথবা userController.js
```

### ৭. Modular Code — ছোট ছোট module-এ ভাগ করো

```js
// ❌ খারাপ — সব কিছু এক file-এ
// app.js — 500 lines of code

// ✅ ভালো — আলাদা করো
// routes/userRoutes.js
// controllers/userController.js
// models/userModel.js
// utils/validation.js
```
