# Node.js Essentials

Node.js lets JavaScript run on the server.

## Event Loop

Node.js is non-blocking and async.

```js
console.log("start");

setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log("end");
```
