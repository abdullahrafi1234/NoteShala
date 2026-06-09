# 🔵 Complete Mongoose

Mongoose হলো Node.js এ MongoDB এর **ODM (Object Document Mapper)**। Schema define করা যায়, validation হয়, middleware লেখা যায়।

## 📌 Table of Contents

- [1. Getting Started](#1-getting-started)
- [2. Schema](#2-schema)
- [3. SchemaTypes](#3-schematypes)
- [4. Model](#4-model)
- [5. Documents](#5-documents)
- [6. Queries](#6-queries)
- [7. Validation](#7-validation)
- [8. Middleware](#8-middleware)
- [9. Population](#9-population)
- [10. Subdocuments](#10-subdocuments)
- [11. Discriminators](#11-discriminators)
- [12. Plugins](#12-plugins)
- [13. Instance Methods](#13-instance-methods)
- [14. Static Methods](#14-static-methods)
- [15. Query Helpers](#15-query-helpers)
- [16. Virtuals](#16-virtuals)
- [17. Transactions](#17-transactions)
- [18. Aggregation](#18-aggregation)
- [19. Schema Design](#19-schema-design)
- [20. toJSON & toObject](#20-tojson--toobject)
- [21. Error Handling](#21-error-handling)
- [22. Pagination](#22-pagination)
- [23. Real Project Structure](#23-real-project-structure)

### Install

```bash
npm install mongoose
```

### Connect

```javascript
const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("✅ Connected!");
}

main().catch((err) => console.log(err));
```

### Production Connect (config/db.js)

```javascript
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ Error:", err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
```

### .env

```
MONGO_URI=mongodb://localhost:27017/ecommerce
```

---

## 2. Schema

> 📖 [mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html)

Schema দিয়ে document এর **structure** define করো।

### Basic Schema

```javascript
const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number,
});
```

### Schema Options

```javascript
const productSchema = new Schema(
  {
    name: String,
    price: Number,
  },
  {
    timestamps: true, // createdAt, updatedAt auto
    versionKey: false, // __v বাদ দাও
    strict: true, // extra field ignore করো (default: true)
  },
);
```

---

## 3. SchemaTypes

> 📖 [mongoosejs.com/docs/schematypes.html](https://mongoosejs.com/docs/schematypes.html)

প্রতিটা field এর type ও options define করো।

```javascript
const userSchema = new Schema({
  name: {
    type: String,
    required: true, // must দিতে হবে
    trim: true, // space remove
    lowercase: true, // lowercase করো
    minlength: 3,
    maxlength: 50,
  },
  age: {
    type: Number,
    min: 18,
    max: 100,
    default: 18,
  },
  email: {
    type: String,
    unique: true, // duplicate চলবে না
    index: true, // index তৈরি করো
    select: false, // query তে default এ বাদ থাকবে
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: { type: [String], default: [] },
  address: {
    // nested object
    city: String,
    zip: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // reference
  },
});
```

### Schema Types List

```javascript
String | Number | Boolean | Date | Buffer;
Schema.Types.Mixed; // যেকোনো type
Schema.Types.ObjectId[String][Number]; // reference id // string array // number array
```

---

## 4. Model

> 📖 [mongoosejs.com/docs/models.html](https://mongoosejs.com/docs/models.html)

Schema থেকে **Model** তৈরি করো — Model দিয়ে database এ কাজ করো।

```javascript
// Model তৈরি
const Product = mongoose.model("Product", productSchema);
// 'Product' → MongoDB এ 'products' collection হবে (plural + lowercase)

module.exports = Product;
```

### ব্যবহার

```javascript
const Product = require("./models/Product");

const product = new Product({ name: "iPhone", price: 85000 });
await product.save();

// অথবা একলাইনে
await Product.create({ name: "iPhone", price: 85000 });
```

---

## 5. Documents

> 📖 [mongoosejs.com/docs/documents.html](https://mongoosejs.com/docs/documents.html)

Document হলো Model এর একটা instance — একটা record।

```javascript
const product = new Product({ name: "MacBook", price: 250000 });

await product.save(); // save করো

product.price = 260000;
await product.save(); // update করে আবার save

await product.deleteOne(); // delete করো

// document কে plain JS object বানাও
const obj = product.toObject();
const json = product.toJSON();

// document info
product.isNew; // নতুন কিনা (save এর আগে: true)
product.isModified("price"); // price change হয়েছে কিনা
product.get("name"); // field value পাও
product.set("price", 90000); // field value set করো
```

---

## 6. Queries

> 📖 [mongoosejs.com/docs/queries.html](https://mongoosejs.com/docs/queries.html)

### Find

```javascript
await Product.find(); // সব
await Product.find({ category: "mobile" }); // filter দিয়ে
await Product.findOne({ name: "MacBook Pro" }); // একটা
await Product.findById("product_id"); // id দিয়ে
await Product.exists({ name: "iPhone" }); // আছে কিনা → { _id } অথবা null
```

### Query Chaining

```javascript
await Product.find({ category: "mobile" })
  .where("price")
  .gt(50000)
  .lt(150000)
  .select("name price -_id") // field select করো
  .sort({ price: -1 })
  .skip(0)
  .limit(10)
  .lean(); // plain JS object — faster
```

### lean() — কেন ব্যবহার করবে

```javascript
// lean() ছাড়া — Mongoose document (methods, getters সব আছে)
const product = await Product.findById(id);

// lean() সহ — plain JS object (দ্রুত, কম memory)
const product = await Product.findById(id).lean();
// API response এ lean() ব্যবহার করো
```

### Update

```javascript
await Product.updateOne({ name: "iPhone" }, { $set: { price: 90000 } });
await Product.updateMany({ category: "mobile" }, { $set: { featured: true } });

const updated = await Product.findByIdAndUpdate(
  id,
  { $set: { price: 90000 } },
  { new: true, runValidators: true },
  // new: true → updated document return করো
  // runValidators: true → update এ validation চালাও
);

// upsert — না থাকলে insert করো
await Product.findOneAndUpdate(
  { name: "Galaxy Tab" },
  { $set: { price: 60000 } },
  { upsert: true, new: true },
);
```

### Delete

```javascript
await Product.deleteOne({ name: "iPhone" });
await Product.deleteMany({ category: "mobile" });
const deleted = await Product.findByIdAndDelete(id);
```

### Count & Distinct

```javascript
await Product.countDocuments({ category: "mobile" });
await Product.distinct("category");
```

---

## 7. Validation

> 📖 [mongoosejs.com/docs/validation.html](https://mongoosejs.com/docs/validation.html)

Validation এর কিছু গুরুত্বপূর্ণ নিয়ম:

- Validation **SchemaType** এ define হয়
- Validation `pre('save')` hook হিসেবে কাজ করে
- `doc.validate()` দিয়ে manually validation চালানো যায়
- `undefined` value তে validator চলে না — শুধু `required` চলে

### Built-in Validators

```javascript
const productSchema = new Schema({
  // String validators
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    enum: ["mobile", "laptop", "tablet"],
    match: /^\S+@\S+\.\S+$/,
    trim: true,
  },

  // Number validators
  price: {
    type: Number,
    min: 0,
    max: 999999,
    required: true,
  },

  // Conditional required
  discount: {
    type: Number,
    required: function () {
      return this.price > 100000; // price বেশি হলে discount must
    },
  },
});
```

### Custom Error Messages

দুইভাবে লেখা যায়:

```javascript
const schema = new Schema({
  // Array syntax
  eggs: {
    type: Number,
    min: [6, "Must be at least 6, got {VALUE}"], // {VALUE} = actual value
    max: 12,
  },

  // Object syntax
  drink: {
    type: String,
    enum: {
      values: ["Coffee", "Tea"],
      message: "{VALUE} is not supported",
    },
  },
});
```

### ⚠️ unique — Validator না!

```javascript
// unique একটা MongoDB index — validator না
const schema = new Schema({
  email: { type: String, unique: true },
});

// duplicate দিলে ValidationError আসবে না
// আসবে: MongoServerError: duplicate key error (code: 11000)
```

### Custom Validators

```javascript
const userSchema = new Schema({
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "Phone number required"],
  },
});
```

### Async Custom Validators

```javascript
const schema = new Schema({
  email: {
    type: String,
    validate: {
      validator: async function (v) {
        const user = await User.findOne({ email: v });
        return !user; // already exist করলে false → error
      },
      message: "Email already exists!",
    },
  },
});
```

### Validation Errors

```javascript
try {
  await product.save();
} catch (err) {
  if (err.name === "ValidationError") {
    // ValidatorError এর properties:
    console.log(err.errors["name"].message); // error message
    console.log(err.errors["name"].path); // field name
    console.log(err.errors["name"].value); // দেওয়া value
    console.log(err.errors["name"].kind); // validator type (required, min, max...)
  }
}
```

### Cast Errors

```javascript
// Wrong type দিলে CastError আসে — validation এর আগে চলে
const product = new Product({ price: 'not a number' })
const err = product.validateSync()

err.errors['price'].name      // 'CastError'
err.errors['price'].message   // 'Cast to Number failed...'

// Custom cast error message
price: {
  type: Number,
  cast: '{VALUE} is not a valid price'
}
```

### Manual Validation

```javascript
// async
try {
  await product.validate();
} catch (err) {
  console.log(err.errors);
}

// sync
const err = product.validateSync();
if (err) console.log(err.errors);
```

### Update তে Validation চালাও

```javascript
// default এ update এ validation চলে না
// runValidators: true দিতে হবে
await Product.findByIdAndUpdate(
  id,
  { $set: { price: -100 } },
  { runValidators: true }, // ← এটা না দিলে validation চলবে না
);
```

---

## 8. Middleware (Hooks)

> 📖 [mongoosejs.com/docs/middleware.html](https://mongoosejs.com/docs/middleware.html)

**Pre** — কাজের আগে চলে | **Post** — কাজের পরে চলে

### Pre Save

```javascript
// password hash করো
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// slug তৈরি করো
productSchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/ /g, "-");
  next();
});
```

### Pre Find

```javascript
// automatically active filter — সব query তে
productSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});
```

### Pre Delete

```javascript
// user delete হলে related orders ও delete করো
userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());
  await Order.deleteMany({ userId: user._id });
  next();
});
```

### Post Hooks

```javascript
userSchema.post("save", function (doc) {
  console.log(`Saved: ${doc.email}`);
});

userSchema.post("findOneAndDelete", function (doc) {
  if (doc) console.log(`Deleted: ${doc.email}`);
});
```

---

## 9. Population

> 📖 [mongoosejs.com/docs/populate.html](https://mongoosejs.com/docs/populate.html)

Reference করা document গুলো **automatically join** করো।

### Schema তে Reference define করো

```javascript
const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // 'User' model থেকে join করবে
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});
```

### Basic Populate

```javascript
const order = await Order.findById(id).populate("userId").populate("productId");
```

### Selective — নির্দিষ্ট field

```javascript
const order = await Order.findById(id)
  .populate("userId", "name email") // শুধু name, email
  .populate("productId", "name price -_id"); // _id বাদে
```

### Nested Populate

```javascript
const order = await Order.findById(id).populate({
  path: "userId",
  select: "name email",
  populate: {
    path: "addressId", // user এর ভেতরে address join
    select: "city area",
  },
});
```

### Populate with Filter

```javascript
const user = await User.findById(id).populate({
  path: "orders",
  match: { status: "delivered" }, // শুধু delivered orders
  select: "product price status",
  options: { limit: 5, sort: { createdAt: -1 } },
});
```

---

## 10. Subdocuments

> 📖 [mongoosejs.com/docs/subdocs.html](https://mongoosejs.com/docs/subdocs.html)

Subdocument হলো **অন্য document এর ভেতরে** থাকা document।

### Define করো

```javascript
// child schema
const addressSchema = new Schema({
  label: String, // "Home", "Office"
  city: String,
  zip: String,
});

const commentSchema = new Schema({
  text: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

// parent schema
const userSchema = new Schema({
  name: String,
  address: addressSchema, // single nested subdoc
  comments: [commentSchema], // array of subdocs
});
```

### Create & Save

```javascript
const user = new User({
  name: "Rafi",
  address: { label: "Home", city: "Dhaka", zip: "1216" },
  comments: [
    { text: "First comment", author: "Karim" },
    { text: "Second comment", author: "Rahim" },
  ],
});

await user.save(); // parent save করলে subdoc ও save হয়
```

### Array Subdoc — যোগ করো, বাদ দাও

```javascript
const user = await User.findById(id);

user.comments.push({ text: "New comment", author: "Rafi" });
await user.save(); // parent save করো

const comment = user.comments.id(commentId); // id দিয়ে খোঁজো
comment.deleteOne(); // বাদ দাও
await user.save();

user.comments.pull(commentId); // pull দিয়েও বাদ দেওয়া যায়
await user.save();
```

### Single Nested Subdoc Update

```javascript
user.address.city = "Chittagong";
await user.save();

user.address.deleteOne(); // null হয়ে যাবে
await user.save();
```

### Parent Access করো

```javascript
const comment = user.comments[0];
comment.parent() === user; // true
comment.ownerDocument() === user; // true
```

---

## 11. Discriminators

> 📖 [mongoosejs.com/docs/discriminators.html](https://mongoosejs.com/docs/discriminators.html)

একটা base model থেকে **multiple sub-models** তৈরি করো — same collection এ রাখো।

```javascript
// Base Schema
const eventSchema = new Schema({ time: Date }, { discriminatorKey: "type" });
const Event = mongoose.model("Event", eventSchema);

// Sub-models
const ClickEvent = Event.discriminator(
  "Click",
  new Schema({ element: String }),
);
const PurchaseEvent = Event.discriminator(
  "Purchase",
  new Schema({
    product: String,
    amount: Number,
  }),
);

// সব একই 'events' collection এ save হবে
await ClickEvent.create({ time: new Date(), element: "#btn" });
await PurchaseEvent.create({
  time: new Date(),
  product: "iPhone",
  amount: 85000,
});

await Event.find(); // সব events
await ClickEvent.find(); // শুধু click events
```

---

## 12. Plugins

> 📖 [mongoosejs.com/docs/plugins.html](https://mongoosejs.com/docs/plugins.html)

Schema এ **reusable functionality** যোগ করো।

```javascript
// plugin তৈরি করো
function softDeletePlugin(schema) {
  schema.add({ isDeleted: { type: Boolean, default: false } });

  schema.methods.softDelete = function () {
    this.isDeleted = true;
    return this.save();
  };

  schema.methods.restore = function () {
    this.isDeleted = false;
    return this.save();
  };

  schema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
  });
}

// ব্যবহার করো
productSchema.plugin(softDeletePlugin);
userSchema.plugin(softDeletePlugin);

// সব schema তে globally যোগ করো
mongoose.plugin(softDeletePlugin);

// ব্যবহার
const product = await Product.findById(id);
await product.softDelete(); // isDeleted: true করো
await product.restore(); // ফিরিয়ে আনো
```

---

## 13. Instance Methods

> একটা নির্দিষ্ট **document**-এর উপর কাজ করে।
> `this` = ওই document।

### Basic Version — Concept বোঝার জন্য

```js
// define
todoSchema.methods = {
  findActive: function () {
    // this = todo document, কিন্তু এখানে this লাগেনি
    // তাই mongoose.model() দিয়ে আলাদা করে Model নিতে হয়েছে
    return mongoose.model("Todo").find({ status: "active" });
  },
};

// ব্যবহার
const todo = new Todo(); // আগে empty document বানাও
const data = await todo.findActive(); // তারপর method call করো
```

> ⚠️ শুধু query করার জন্য `new Todo()` করা অপ্রয়োজনীয়।
> কিন্তু concept বোঝার জন্য এটা দিয়ে শুরু করা ভালো।

---

### Advanced Version — Real Project-এ যেভাবে ব্যবহার হয়

```js
// define — this দিয়ে document-এর নিজের data access করো
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password); // this.password = ওই user-এর password
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role }, // this._id = ওই user-এর id
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

userSchema.methods.toSafeObject = function () {
  // password বাদ দিয়ে safe data return করো
  return { id: this._id, name: this.name, email: this.email };
};

// ব্যবহার
const user = await User.findOne({ email }); // আগে document আনো
const isMatch = await user.isPasswordMatch("123456");
const token = user.generateToken();
const safeUser = user.toSafeObject();
```

### Basic vs Advanced পার্থক্য

|                    | Basic                             | Advanced                            |
| ------------------ | --------------------------------- | ----------------------------------- |
| **`this` ব্যবহার** | করেনি — `mongoose.model()` লাগেছে | করেছে — `this.password`, `this._id` |
| **কাজ**            | শুধু data খোঁজা                   | document-এর নিজের data নিয়ে কাজ    |
| **real project**   | ❌                                | ✅                                  |

> **মূল কথা:** Instance method-এর আসল কাজ হলো `this` দিয়ে
> ওই **নির্দিষ্ট document-এর data** (password, \_id, role) access করা।

---

## 14. Static Methods

> **Model level**-এ কাজ করে।
> `this` = Model (পুরো collection)।
> `new` লাগে না।

### Basic Version — Concept বোঝার জন্য

```js
// define
todoSchema.statics = {
  findByJs: function () {
    return this.find({ title: /js/i }); // this = Todo Model
  },
};

// ব্যবহার
const data = await Todo.findByJs(); // সরাসরি Model-এ call, new লাগেনি
```

---

### Advanced Version — Real Project-এ যেভাবে ব্যবহার হয়

```js
// define
productSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true });
};

productSchema.statics.findMostExpensive = function (limit = 5) {
  return this.find().sort({ price: -1 }).limit(limit);
};

productSchema.statics.paginate = async function (
  filter = {},
  page = 1,
  limit = 10,
) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    this.find(filter).skip(skip).limit(limit),
    this.countDocuments(filter),
  ]);
  return {
    data,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  };
};

// ব্যবহার
const mobiles = await Product.findByCategory("mobile");
const expensive = await Product.findMostExpensive(3);
const result = await Product.paginate({ category: "mobile" }, 1, 5);
```

### Basic vs Advanced পার্থক্য

|                  | Basic                  | Advanced                               |
| ---------------- | ---------------------- | -------------------------------------- |
| **কাজ**          | শুধু title দিয়ে খোঁজা | category, price, pagination সব         |
| **`this`**       | `this.find()`          | `this.find()`, `this.countDocuments()` |
| **real project** | ❌                     | ✅                                     |

> **মূল কথা:** Concept একই — `this` = Model।
> Advanced-এ শুধু বেশি কাজ করছে।

---

## 15. Query Helpers

> Query-তে **chainable custom method** যোগ করে।
> `this` = চলমান query object।

### Basic Version — Concept বোঝার জন্য

```js
// define
todoSchema.query = {
  byLanguage: function (language) {
    return this.find({ title: new RegExp(language, "i") }); // this = current query
  },
};

// ব্যবহার — find() এর পরে chain করো
const data = await Todo.find().byLanguage("book");
```

---

### Advanced Version — Real Project-এ যেভাবে ব্যবহার হয়

```js
// define — অনেক helper একসাথে
productSchema.query.byCategory = function (category) {
  return this.where({ category });
};

productSchema.query.active = function () {
  return this.where({ isActive: true });
};

productSchema.query.inPriceRange = function (min, max) {
  return this.where({ price: { $gte: min, $lte: max } });
};

productSchema.query.paginate = function (page = 1, limit = 10) {
  return this.skip((page - 1) * limit).limit(limit);
};

// ব্যবহার — সব একসাথে chain করো
const products = await Product.find()
  .byCategory("mobile")
  .active()
  .inPriceRange(50000, 150000)
  .sort({ price: -1 }) // mongoose-এর built-in chain
  .paginate(1, 5); // custom chain
```

### Basic vs Advanced পার্থক্য

|                             | Basic             | Advanced                                |
| --------------------------- | ----------------- | --------------------------------------- |
| **helper সংখ্যা**           | একটা              | অনেকগুলো                                |
| **chain**                   | একটা মাত্র        | অনেক একসাথে                             |
| **`.where()` vs `.find()`** | `.find()` ব্যবহার | `.where()` ব্যবহার (chainable-friendly) |
| **real project**            | ❌                | ✅                                      |

> **মূল কথা:** Concept একই — `this` = query।
> Advanced-এ অনেক helper একসাথে chain করা যাচ্ছে।

---

## তিনটা পাশাপাশি — Basic

```js
// instance — document বানিয়ে call
const todo = new Todo();
await todo.findActive();

// static — সরাসরি Model-এ call
await Todo.findByJs();

// query helper — find()-এর পরে chain
await Todo.find().byLanguage("book");
```

## তিনটা পাশাপাশি — Advanced

```js
// instance — document আনো, তারপর call
const user = await User.findOne({ email });
await user.isPasswordMatch("123456");
await user.generateToken();

// static — সরাসরি Model-এ call
await Product.findByCategory("mobile");
await Product.paginate({ category: "mobile" }, 1, 5);

// query helper — অনেক কিছু chain
await Product.find()
  .byCategory("mobile")
  .active()
  .inPriceRange(50000, 150000)
  .paginate(1, 5);
```

---

## গুরুত্বপূর্ণ — Arrow Function চলবে না

```js
// ❌ WRONG — this = undefined হয়ে যাবে
userSchema.methods.getToken = () => {
  return jwt.sign({ id: this._id }, secret);
};

// ✅ CORRECT — সবসময় regular function লিখো
userSchema.methods.getToken = function () {
  return jwt.sign({ id: this._id }, secret);
};
```

## Quick Reference

|                     | Call করার উপায়         | `this` কী | কখন ব্যবহার                       |
| ------------------- | ----------------------- | --------- | --------------------------------- |
| **Instance Method** | `new Model().method()`  | document  | document-এর নিজের data নিয়ে কাজে |
| **Static Method**   | `Model.method()`        | Model     | collection-wide query-তে          |
| **Query Helper**    | `Model.find().method()` | Query     | chain query-তে                    |

---

> Instance, Static, Query Helper — তিনটাতেই `this` লাগে।
> তাই তিনটাতেই **arrow function দেওয়া যাবে না।**

---

_Ref: [mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html)_

## 16. Virtuals

> 📖 [mongoosejs.com/docs/guide.html#virtuals](https://mongoosejs.com/docs/guide.html#virtuals)

Database এ **save হয় না** কিন্তু document এ পাওয়া যায়।

```javascript
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  price: Number,
  discount: Number,
});

// getter
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// setter
userSchema.virtual("fullName").set(function (name) {
  const parts = name.split(" ");
  this.firstName = parts[0];
  this.lastName = parts[1];
});

// calculated field
userSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});

// ⚠️ JSON response এ দেখাতে হলে এটা লাগবে
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// ব্যবহার
const user = await User.findOne({ firstName: "Rafi" });
console.log(user.fullName); // "Rafi Ahmed"
user.fullName = "Karim Hasan"; // setter call হবে
console.log(user.firstName); // "Karim"
```

### Virtual Populate

```javascript
productSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "productId",
});

const product = await Product.findById(id).populate("orders");
```

---

## 17. Transactions

> 📖 [mongoosejs.com/docs/transactions.html](https://mongoosejs.com/docs/transactions.html)

কিছু ভুল হলে সব **rollback** হয়।

> ⚠️ Replica Set বা Atlas এ কাজ করে।

```javascript
const placeOrder = async (userId, productId, quantity) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Stock check
    const product = await Product.findById(productId).session(session);
    if (!product || product.stock < quantity)
      throw new Error("Insufficient stock");

    // 2. Stock কমাও
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } },
      { session },
    );

    // 3. Order তৈরি
    const [order] = await Order.create(
      [
        {
          userId,
          productId,
          quantity,
          totalPrice: product.price * quantity,
          status: "pending",
        },
      ],
      { session },
    );

    // 4. Payment record
    await Payment.create(
      [
        {
          orderId: order._id,
          userId,
          amount: product.price * quantity,
          status: "success",
        },
      ],
      { session },
    );

    await session.commitTransaction(); // সব ঠিক → save
    return { success: true, order };
  } catch (err) {
    await session.abortTransaction(); // ভুল হলে → rollback
    throw err;
  } finally {
    session.endSession();
  }
};
```

**ACID:**

|                     | মানে                                 |
| ------------------- | ------------------------------------ |
| **A** — Atomicity   | সব হবে, নাহলে কিছুই না               |
| **C** — Consistency | Data সবসময় valid                    |
| **I** — Isolation   | এক transaction অন্যকে affect করবে না |
| **D** — Durability  | Commit হলে data permanent            |

---

## 18. Aggregation

> 📖 [mongoosejs.com/docs/api/aggregate.html](https://mongoosejs.com/docs/api/aggregate.html)

```javascript
const stats = await Product.aggregate([
  { $match: { isActive: true } },
  {
    $group: {
      _id: "$category",
      count: { $sum: 1 },
      avgPrice: { $avg: "$price" },
    },
  },
  { $sort: { avgPrice: -1 } },
]);

// $unwind — array কে আলাদা document বানাও
const result = await Order.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "product",
    },
  },
  { $unwind: "$product" },
  {
    $project: {
      status: 1,
      "product.name": 1,
      totalAmount: { $multiply: ["$quantity", "$product.price"] },
    },
  },
]);
```

---

## 19. Schema Design

### Embedding vs Referencing

```javascript
// ✅ Embedding — address embed করো (user ছাড়া address দরকার নেই)
const userSchema = new Schema({
  name: String,
  addresses: [
    {
      label: String,
      city: String,
      zip: String,
    },
  ],
});

// ✅ Referencing — orders আলাদা collection এ
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  product: String,
  price: Number,
});
```

|            | Embedding            | Referencing           |
| ---------- | -------------------- | --------------------- |
| Read speed | ✅ দ্রুত             | একটু ধীর              |
| Data size  | বড় হয়              | ছোট থাকে              |
| Use case   | 1-to-few             | 1-to-many             |
| কখন        | Data একসাথে পড়া হয় | Data আলাদাভাবেও দরকার |

### Snapshot Pattern

```javascript
// ✅ Order এ price copy করো
// পরে product price বদলালেও order এ আগেরটা থাকবে
const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String, // snapshot
        price: Number, // snapshot — order করার সময়ের price
        quantity: Number,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      enum: ["pending", "processing", "delivered", "cancelled"],
    },
  },
  { timestamps: true },
);
```

---

## 20. toJSON & toObject

> 📖 [mongoosejs.com/docs/guide.html#toJSON](https://mongoosejs.com/docs/guide.html#toJSON)

Response এ data **transform** করো।

```javascript
// password ও __v বাদ দাও
userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// select: false — query তে automatically বাদ থাকবে
const userSchema = new Schema({
  name: String,
  password: { type: String, select: false },
});

// দরকার হলে explicitly select করো
const user = await User.findOne({ email }).select("+password");
```

---

## 21. Error Handling

### Custom Error Class

```javascript
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
module.exports = AppError;

// ব্যবহার
throw new AppError("Not found", 404);
throw new AppError("Unauthorized", 401);
```

### Async Wrapper — try/catch বারবার লিখতে হবে না

```javascript
// utils/catchAsync.js
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
module.exports = catchAsync;

// ব্যবহার
const getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Not found", 404);
  res.json({ success: true, data: product });
});
```

### Global Error Handler

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  if (err.code === 11000) {
    message = `${Object.keys(err.keyValue)[0]} already exists`;
    statusCode = 400;
  }
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    statusCode = 400;
  }
  if (err.name === "CastError") {
    message = `Invalid ${err.path}`;
    statusCode = 400;
  }
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }

  res.status(statusCode).json({ success: false, message });
};
module.exports = errorHandler;

// server.js এ সবার শেষে
app.use(errorHandler);
```

### Error Codes

| Code    | মানে                 |
| ------- | -------------------- |
| `11000` | Duplicate key        |
| `121`   | Validation failed    |
| `13`    | Unauthorized         |
| `26`    | Collection not found |

---

## 22. Pagination

```javascript
// GET /products?page=1&limit=10&category=mobile&search=samsung
const getProducts = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    search,
    minPrice,
    maxPrice,
  } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    data,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
  });
};
```

---

## 23. Real Project Structure

```
ecommerce-api/
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Payment.js
├── controllers/
│   ├── userController.js
│   └── productController.js
├── routes/
│   ├── userRoutes.js
│   └── productRoutes.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── utils/
│   ├── AppError.js
│   └── catchAsync.js
├── .env
└── server.js
```

### server.js

```javascript
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
connectDB();
app.use(express.json());

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.use(errorHandler); // সবার শেষে

app.listen(3000, () => console.log("🚀 Server on port 3000"));
```

### models/Product.js — Complete Example

```javascript
const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["mobile", "laptop", "accessories", "tablet"],
      required: true,
    },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

productSchema.index({ name: "text" });
productSchema.index({ category: 1, price: -1 });

productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});
productSchema.set("toJSON", { virtuals: true });

productSchema.statics.findByCategory = function (cat) {
  return this.find({ category: cat, isActive: true });
};

productSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

module.exports = mongoose.model("Product", productSchema);
```

---

## 📝 Quick Reference

```javascript
// ── mongosh ──────────────────────────────────────────────
use dbName | show dbs | db.dropDatabase()
db.col.insertOne({}) | insertMany([])
db.col.find({filter}, {projection})
db.col.updateOne({filter}, {$set:{}}) | updateMany()
db.col.deleteOne({}) | deleteMany({})
db.col.find().sort({f:1}).skip(n).limit(n)
db.col.countDocuments({}) | distinct("field")
db.col.createIndex({f:1}) | getIndexes() | dropIndex()

// ── Query Operators ───────────────────────────────────────
$gt $gte $lt $lte $eq $ne $in $nin
$and $or $not $nor
$exists $type $regex $text
$push $pull $addToSet $inc $set $unset $pop

// ── Aggregation ───────────────────────────────────────────
$match $group $sort $limit $skip $count
$project $addFields $lookup $unwind $out $facet
$sum $avg $max $min $first $last
$cond $ifNull $switch

// ── Mongoose ──────────────────────────────────────────────
mongoose.connect(uri)
const Model = mongoose.model('Name', schema)
Model.create({})
Model.find({}).select().sort().skip().limit().lean()
Model.findById(id) | Model.findOne({})
Model.findByIdAndUpdate(id, {$set:{}}, {new:true, runValidators:true})
Model.findByIdAndDelete(id)
Model.countDocuments({}) | Model.distinct('field')
Model.exists({filter})
Model.find().populate('field', 'name email')
Model.aggregate([])

// ── Schema Features ───────────────────────────────────────
{ timestamps: true, versionKey: false }
schema.virtual('name').get(fn).set(fn)
schema.set('toJSON', { virtuals: true })
schema.methods.fn = function() {}    // instance method
schema.statics.fn = function() {}    // static method
schema.query.fn = function() {}      // query helper
schema.pre('save', fn) | schema.post('save', fn)
schema.plugin(pluginFn) | mongoose.plugin(pluginFn)
```
