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

## 4-Global Object & Module System

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

## 5-Node.js Server & Core Modules

### Path Module

The `node:path` module provides utilities for working with file and directory paths. It can be accessed using:

1. The `path.basename()` method returns the last portion of a `path`, similar to the Unix `basename` command. It returns the very last part of a path (the file name). If you pass the extension as the second parameter, it will return just the file name.
2. The `path.dirname()` method returns the directory name of a `path` . It returns the location of the entire directory or folder preceding a path, excluding the file name.
3. The `path.extname()` method returns the extension of the `path`, from the last occurrence of the `.` (period) character to end of string in the last portion of the `path`.
4. The `path.parse()` method returns an object whose properties represent significant elements of the `path`.
5. For more, visit [https://www.w3schools.com/nodejs/nodejs_path.asp](https://www.w3schools.com/nodejs/nodejs_path.asp)

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
3. for more, visit [https://www.w3schools.com/nodejs/nodejs_os.asp](https://www.w3schools.com/nodejs/nodejs_os.asp)

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
