# 🍃 Complete MongoDB

## 📌 Table of Contents

- [1. Get Started](#1-get-started)
- [2. Query API](#2-query-api)
- [3. Create Database](#3-create-database)
- [4. Collection](#4-collection)
- [5. Insert](#5-insert)
- [6. Find](#6-find)
- [7. Query Operators](#7-query-operators)
- [8. Update Operators](#8-update-operators)
- [9. Update](#9-update)
- [10. Delete](#10-delete)
- [11. Sort & Limit](#11-sort--limit)
- [12. Aggregations](#12-aggregations)
- [13. Indexing & Search](#13-indexing--search)
- [14. Validation](#14-validation)
- [15. Authentication & Security](#15-authentication--security)
- [16. Change Streams](#16-change-streams)
- [17. Atlas Search](#17-atlas-search)

## 1. Get Started

MongoDB একটি **NoSQL Document Database**। Data JSON-like format (BSON) এ store হয় — rows/columns নয়, **documents** হিসেবে।

| SQL      | MongoDB    |
| -------- | ---------- |
| Database | Database   |
| Table    | Collection |
| Row      | Document   |
| Column   | Field      |

### mongosh চালাও

```bash
mongosh
# output: test>
```

### Basic Commands

```javascript
show dbs           // সব database দেখো
db                 // current database
use ecommerce      // database switch/create
show collections   // সব collection দেখো
exit               // বের হও
```

## 2. Query API

> 📖 [mongodb.com/docs/manual/crud](https://www.mongodb.com/docs/manual/crud/)

MongoDB তে দুইভাবে query করা যায়:

```javascript
// 1. CRUD Methods — basic operations
db.products.find({ category: "mobile" });

// 2. Aggregation Pipeline — complex operations
db.products.aggregate([
  { $match: { category: "mobile" } },
  { $sort: { price: -1 } },
]);
```

## 3. Create Database

> 📖 [mongodb.com/docs/manual/core/databases-and-collections](https://www.mongodb.com/docs/manual/core/databases-and-collections/)

MongoDB তে database আলাদাভাবে তৈরি হয় না — **প্রথম data দিলেই তৈরি হয়।**

```javascript
use ecommerce                              // switch করো
db.products.insertOne({ name: "test" })   // এখন database তৈরি হলো
show dbs                                   // এখন ecommerce দেখা যাবে
db.dropDatabase()                          // database delete করো
```

---

## 4. Collection

> 📖 [mongodb.com/docs/manual/core/databases-and-collections](https://www.mongodb.com/docs/manual/core/databases-and-collections/)

Collection হলো SQL এর Table এর মতো — documents এর group।

```javascript
db.createCollection("products")           // collection তৈরি
show collections                           // সব collection দেখো
db.products.drop()                         // collection delete করো
db.products.renameCollection("items")     // rename করো
```

---

## 5. Insert

> 📖 [mongodb.com/docs/manual/tutorial/insert-documents](https://www.mongodb.com/docs/manual/tutorial/insert-documents/)

### insertOne() — একটা document insert করো

```javascript
db.products.insertOne({
  name: "iPhone 10",
  price: 85000,
  category: "mobile",
  stock: 10,
});
// return: { acknowledged: true, insertedId: ObjectId('...') }
```

### insertMany() — অনেক document একসাথে insert করো

```javascript
db.products.insertMany([
  { name: "Samsung Galaxy S24", price: 85000, category: "mobile", stock: 10 },
  { name: "MacBook Pro", price: 250000, category: "laptop", stock: 5 },
  { name: "Sony Headphone", price: 15000, category: "accessories", stock: 20 },
  { name: "iPad Pro", price: 120000, category: "tablet", stock: 8 },
  { name: "OnePlus 12", price: 65000, category: "mobile", stock: 15 },
]);
// return: { acknowledged: true, insertedIds: { '0': ObjectId, '1': ObjectId, ... } }
```

---

## 6. Find

> 📖 [mongodb.com/docs/manual/tutorial/query-documents](https://www.mongodb.com/docs/manual/tutorial/query-documents/)

### find() — সব document দেখো

```javascript
db.products.find();
```

### filter দিয়ে খোঁজো

```javascript
db.products.find({ category: "mobile" });
db.products.findOne({ name: "MacBook Pro" }); // প্রথমটা return করে
```

### Projection — কোন field দেখাবে

`1` = দেখাও, `0` = বাদ দাও

```javascript
db.products.find({}, { name: 1, price: 1, _id: 0 });
db.products.find({ category: "mobile" }, { name: 1, price: 1 });
db.products.find({ stock: 8 }, { name: 0 }); // name বাদে সব দেখাও
```

> ⚠️ একসাথে `0` ও `1` mix করা যাবে না — শুধু `_id` ব্যতিক্রম।

---

## 7. Query Operators

> 📖 [mongodb.com/docs/manual/reference/operator/query](https://www.mongodb.com/docs/manual/reference/operator/query/)

### Comparison Operators

```javascript
db.products.find({ price: { $gt: 50000 } }); // greater than
db.products.find({ price: { $gte: 50000 } }); // greater than or equal
db.products.find({ price: { $lt: 50000 } }); // less than
db.products.find({ price: { $lte: 50000 } }); // less than or equal
db.products.find({ price: { $eq: 15000 } }); // equal
db.products.find({ price: { $ne: 15000 } }); // not equal
db.products.find({ category: { $in: ["mobile", "laptop"] } }); // যেকোনো একটা match
db.products.find({ category: { $nin: ["mobile", "laptop"] } }); // কোনোটাই না
```

### Logical Operators

```javascript
// AND — সব condition true হতে হবে
db.products.find({ $and: [{ price: { $gt: 50000 } }, { category: "mobile" }] });
db.products.find({ price: { $gt: 50000 }, category: "mobile" }); // shorthand

// OR — যেকোনো একটা true হলেই হবে
db.products.find({ $or: [{ category: "mobile" }, { category: "laptop" }] });

// NOT
db.products.find({ price: { $not: { $gt: 50000 } } });

// NOR — কোনোটাই true না হলে
db.products.find({ $nor: [{ category: "mobile" }, { category: "laptop" }] });
```

### Element Operators

```javascript
db.products.find({ brand: { $exists: true } }); // field আছে কিনা
db.products.find({ brand: { $exists: false } });
db.products.find({ price: { $type: "number" } }); // type চেক
db.products.find({ name: { $type: "string" } });
```

### Evaluation Operators

```javascript
db.products.find({ name: { $regex: /pro/i } }); // regex search
db.products.find({ $text: { $search: "samsung mobile" } }); // text search
```

### Array Operators

```javascript
db.products.find({ tags: "new" }); // array তে value আছে কিনা
db.products.find({ tags: { $all: ["new", "featured"] } }); // সব value আছে কিনা
db.products.find({ tags: { $size: 3 } }); // array size
db.products.find({ ratings: { $elemMatch: { $gt: 4 } } }); // array element condition
```

---

## 8. Update Operators

> 📖 [mongodb.com/docs/manual/reference/operator/update](https://www.mongodb.com/docs/manual/reference/operator/update/)

### Field Operators

```javascript
db.products.updateOne({ name: "OnePlus 12" }, { $set: { price: 70000 } }); // value set করো
db.products.updateOne({ name: "iPad Pro" }, { $unset: { brand: "" } }); // field delete করো
db.products.updateOne({ name: "iPhone 10" }, { $inc: { stock: -1 } }); // বাড়াও/কমাও
db.products.updateOne({ name: "MacBook Pro" }, { $rename: { name: "title" } }); // rename করো
db.products.updateOne({ name: "iPhone" }, { $mul: { price: 1.1 } }); // গুণ করো
```

### Array Operators

```javascript
db.products.updateOne({ name: "MacBook" }, { $push: { tags: "featured" } }); // যোগ করো
db.products.updateOne({ name: "MacBook" }, { $addToSet: { tags: "sale" } }); // duplicate ছাড়া যোগ
db.products.updateOne({ name: "MacBook" }, { $pull: { tags: "sale" } }); // বাদ দাও
db.products.updateOne({ name: "MacBook" }, { $pop: { tags: 1 } }); // last item বাদ (-1 = first)
```

---

## 9. Update

> 📖 [mongodb.com/docs/manual/tutorial/update-documents](https://www.mongodb.com/docs/manual/tutorial/update-documents/)

### updateOne() — একটা document update করো

```javascript
db.products.updateOne(
  { name: "OnePlus 12" }, // filter
  { $set: { price: 70000 } }, // update
);
// return: { matchedCount: 1, modifiedCount: 1 }
```

### updateMany() — সব matching document update করো

```javascript
db.products.updateMany({ category: "mobile" }, { $set: { featured: true } });
```

### findOneAndUpdate() — update করে document return করো

```javascript
db.products.findOneAndUpdate(
  { name: "iPad Pro" },
  { $set: { price: 130000 } },
  { returnDocument: "after" }, // updated document দেখাও
);
```

### Upsert — না থাকলে insert করো

```javascript
db.products.updateOne(
  { name: "Galaxy Tab" },
  { $set: { price: 60000, category: "tablet" } },
  { upsert: true },
);
```

---

## 10. Delete

> 📖 [mongodb.com/docs/manual/tutorial/remove-documents](https://www.mongodb.com/docs/manual/tutorial/remove-documents/)

### deleteOne() — একটা delete করো

```javascript
db.products.deleteOne({ name: "iPhone 10" });
```

### deleteMany() — সব matching document delete করো

```javascript
db.products.deleteMany({ category: "mobile" });
db.products.deleteMany({}); // সব delete
```

### findOneAndDelete() — delete করে document return করো

```javascript
db.products.findOneAndDelete({ name: "iPad Pro" });
```

---

## 11. Sort & Limit

> 📖 [mongodb.com/docs/manual/reference/operator/aggregation/sort](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/)

### sort()

```javascript
db.products.find().sort({ price: 1 }); // ascending ↑ (কম থেকে বেশি)
db.products.find().sort({ price: -1 }); // descending ↓ (বেশি থেকে কম)
db.products.find().sort({ category: 1, price: -1 }); // multiple field sort
```

### limit() & skip()

```javascript
db.products.find().limit(3); // প্রথম 3টা
db.products.find().skip(2).limit(3); // 2টা skip → পরের 3টা
```

### countDocuments() & distinct()

```javascript
db.products.countDocuments(); // সব count
db.products.countDocuments({ category: "mobile" }); // filtered count
db.products.distinct("category"); // unique values
// return: ["mobile", "laptop", "accessories", "tablet"]
```

---

## 12. Aggregations

> 📖 [mongodb.com/docs/manual/aggregation](https://www.mongodb.com/docs/manual/aggregation/)

Aggregation দিয়ে data **process** করে result বের করো।

### $match — filter করো

```javascript
db.products.aggregate([
  { $match: { category: "mobile", price: { $gt: 50000 } } },
]);
```

### $group — group করো

```javascript
db.products.aggregate([
  {
    $group: {
      _id: "$category", // কোন field দিয়ে group
      total: { $sum: 1 }, // count
      avgPrice: { $avg: "$price" },
      maxPrice: { $max: "$price" },
      minPrice: { $min: "$price" },
      totalValue: { $sum: "$price" },
    },
  },
]);

// সব একসাথে (group by ছাড়া)
db.products.aggregate([
  { $group: { _id: null, avgPrice: { $avg: "$price" } } },
]);
```

### $sort, $skip, $limit

```javascript
db.products.aggregate([{ $sort: { price: -1 } }, { $skip: 0 }, { $limit: 5 }]);
```

### $project — field select করো

```javascript
db.products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      _id: 0,
      priceWithTax: { $multiply: ["$price", 1.15] }, // নতুন field
    },
  },
]);
```

### $addFields — নতুন field যোগ করো

```javascript
db.products.aggregate([
  {
    $addFields: {
      discountedPrice: { $multiply: ["$price", 0.9] },
      categoryUpper: { $toUpper: "$category" },
    },
  },
]);
```

### $count — count করো

```javascript
db.products.aggregate([
  { $match: { category: "mobile" } },
  { $count: "totalMobiles" },
]);
// return: [{ totalMobiles: 3 }]
```

### $lookup — JOIN করো

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "products", // join করার collection
      localField: "productId", // orders এর field
      foreignField: "_id", // products এর field
      as: "product", // result এর নাম
    },
  },
]);
```

### $unwind — array কে আলাদা document বানাও

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "product",
    },
  },
  { $unwind: "$product" }, // array → single document
  { $project: { "product.name": 1, "product.price": 1 } },
]);
```

### $out — result নতুন collection এ save করো

```javascript
db.products.aggregate([
  { $match: { category: "mobile" } },
  { $out: "mobileProducts" },
]);
```

### $facet — একসাথে multiple aggregation

```javascript
db.products.aggregate([
  {
    $facet: {
      byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
      priceStats: [
        {
          $group: {
            _id: null,
            avg: { $avg: "$price" },
            max: { $max: "$price" },
          },
        },
      ],
      topProducts: [
        { $sort: { price: -1 } },
        { $limit: 3 },
        { $project: { name: 1, price: 1, _id: 0 } },
      ],
    },
  },
]);
```

### Aggregation Operators

**Arithmetic:**

```javascript
{
  $add: ["$price", 100];
} // যোগ
{
  $subtract: ["$price", 100];
} // বিয়োগ
{
  $multiply: ["$price", 1.15];
} // গুণ
{
  $divide: ["$price", 2];
} // ভাগ
{
  $mod: ["$price", 100];
} // ভাগশেষ
{
  $round: ["$price", 2];
} // round
{
  $abs: ["$value"];
} // absolute value
```

**String:**

```javascript
{
  $concat: ["$firstName", " ", "$lastName"];
}
{
  $toUpper: "$name";
}
{
  $toLower: "$name";
}
{
  $substr: ["$name", 0, 5];
}
{
  $strLenCP: "$name";
}
{
  $trim: {
    input: "$name";
  }
}
```

**Date:**

```javascript
{ $year: "$createdAt" }
{ $month: "$createdAt" }
{ $dayOfMonth: "$createdAt" }
{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
```

**Conditional:**

```javascript
// if-else
{ $cond: { if: { $gte: ["$price", 100000] }, then: "Expensive", else: "Affordable" } }

// null হলে default দাও
{ $ifNull: ["$discount", 0] }

// switch-case
{ $switch: {
  branches: [
    { case: { $lt: ["$price", 10000] }, then: "Budget" },
    { case: { $lt: ["$price", 50000] }, then: "Mid-range" }
  ],
  default: "Premium"
}}
```

---

## 13. Indexing & Search

> 📖 [mongodb.com/docs/manual/indexes](https://www.mongodb.com/docs/manual/indexes/)

Index ছাড়া MongoDB সব document scan করে — **slow!** Index দিলে দ্রুত খোঁজে।

### Index তৈরি করো

```javascript
db.products.createIndex({ name: 1 }); // single, ascending
db.products.createIndex({ price: -1 }); // single, descending
db.users.createIndex({ email: 1 }, { unique: true }); // unique
db.products.createIndex({ category: 1, price: -1 }); // compound
db.products.createIndex({ name: "text", category: "text" }); // text search
db.otps.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // TTL — 1hr পর delete
db.users.createIndex({ phone: 1 }, { sparse: true }); // sparse — null ignore
db.products.createIndex(
  { name: 1 },
  { partialFilterExpression: { isActive: true } },
); // partial
```

### Index দেখো ও মুছো

```javascript
db.products.getIndexes();
db.products.dropIndex({ name: 1 });
db.products.dropIndexes();
```

### Text Search

```javascript
// text index থাকলে search করো
db.products.find({ $text: { $search: "samsung mobile" } });

// relevance score দিয়ে sort করো
db.products
  .find({ $text: { $search: "samsung" } }, { score: { $meta: "textScore" } })
  .sort({ score: { $meta: "textScore" } });
```

### Performance Check

```javascript
db.products.find({ category: "mobile" }).explain("executionStats");
// "IXSCAN" → index use হচ্ছে ✅
// "COLLSCAN" → index নেই ❌ → index দাও
```

### কখন কোন Index

| Type     | কখন দেবে                            |
| -------- | ----------------------------------- |
| Single   | একটা field দিয়ে বেশি search/sort   |
| Unique   | email, username — duplicate চলবে না |
| Compound | একসাথে multiple field filter        |
| Text     | search feature                      |
| TTL      | OTP, session auto-expire            |
| Sparse   | optional field এ                    |

---

## 14. Validation

> 📖 [mongodb.com/docs/manual/core/schema-validation](https://www.mongodb.com/docs/manual/core/schema-validation/)

Document insert করার আগে data validate করো।

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "age"],
      properties: {
        name: { bsonType: "string" },
        email: {
          bsonType: "string",
          pattern: "^\\S+@\\S+\\.\\S+$",
        },
        age: {
          bsonType: "int",
          minimum: 18,
          maximum: 100,
        },
        role: { enum: ["user", "admin"] },
      },
    },
  },
  validationAction: "error", // "error" → reject | "warn" → allow with warning
});
```

### Existing Collection এ validation যোগ করো

```javascript
db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
    },
  },
});
```

---

## 15. Authentication & Security

> 📖 [mongodb.com/docs/manual/security](https://www.mongodb.com/docs/manual/security/)

### User তৈরি করো

```javascript
use admin

db.createUser({
  user: "rafi",
  pwd: "strongPassword123",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
})

// নির্দিষ্ট database এর জন্য user
use ecommerce
db.createUser({
  user: "appUser",
  pwd: "appPass123",
  roles: [{ role: "readWrite", db: "ecommerce" }]
})
```

### Login করো

```bash
mongosh -u rafi -p strongPassword123 --authenticationDatabase admin
```

### Connection String এ auth

```
mongodb://rafi:strongPassword123@localhost:27017/ecommerce
```

### Roles Reference

| Role        | Permission       |
| ----------- | ---------------- |
| `read`      | শুধু পড়তে পারবে |
| `readWrite` | পড়া ও লেখা      |
| `dbAdmin`   | Database manage  |
| `userAdmin` | User manage      |
| `root`      | সব permission    |

---

## 16. Change Streams

> 📖 [mongodb.com/docs/manual/changeStreams](https://www.mongodb.com/docs/manual/changeStreams/)

Real-time এ database এর পরিবর্তন **watch** করো।

> ⚠️ Replica Set বা Atlas এ কাজ করে।

```javascript
// সব change watch করো
const changeStream = db.products.watch();
changeStream.forEach((change) => print(JSON.stringify(change)));

// নির্দিষ্ট operation watch করো
const stream = db.products.watch([
  { $match: { operationType: { $in: ["insert", "update"] } } },
]);

stream.forEach((change) => {
  if (change.operationType === "insert") {
    print("New product:", change.fullDocument.name);
  }
  if (change.operationType === "update") {
    print("Updated:", change.documentKey._id);
  }
});
```

### Node.js এ Change Streams

```javascript
const changeStream = Product.watch();

changeStream.on("change", (change) => {
  console.log("Changed:", change.operationType);
  io.emit("productUpdated", change); // socket.io দিয়ে client notify করো
});
```

---

## 17. Atlas Search

> 📖 [mongodb.com/docs/atlas/atlas-search](https://www.mongodb.com/docs/atlas/atlas-search/)

Full-text search — মানে বুঝে search করো।

### Atlas Dashboard এ Index তৈরি করো

```json
{ "mappings": { "dynamic": true } }
```

### Search Query

```javascript
db.products.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "samsung mobile",
        path: ["name", "category"],
        fuzzy: { maxEdits: 1 }, // typo handle করে
      },
    },
  },
  { $limit: 5 },
  { $project: { name: 1, price: 1, score: { $meta: "searchScore" } } },
]);
```

### Autocomplete

```javascript
db.products.aggregate([
  {
    $search: {
      autocomplete: { query: "sam", path: "name" },
    },
  },
  { $limit: 5 },
]);
```

---
