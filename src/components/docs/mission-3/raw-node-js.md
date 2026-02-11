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
console.log("ফোল্ডার পাথ: ", __dirname);
```

- **Example:** If your file is at `/users/project/app.js`, `__dirname` will be `/users/project`.
- **Purpose:** Used for dynamic path resolution when reading/writing files.

---

## \_\_filename

`__filename` provides the **absolute path** of the current JavaScript file, including the filename and its extension.

```js
console.log("ফাইল পাথ: ", __filename);
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

## 5- Node.js Server & Core Modules
