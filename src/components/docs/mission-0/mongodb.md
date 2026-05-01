# 🍃 Complete MongoDB

## 📌 Table of Contents

1. [MongoDB কী?](#mongodb-কী)
2. [Installation (Windows)](#installation-windows)
3. [Terminology & Data Model](#terminology--data-model)
4. [Data Types](#data-types)
5. [MongoDB Compass](#mongodb-compass)
6. [MongoDB Atlas](#mongodb-atlas)
7. [VS Code Extension](#vs-code-extension)
8. [Database Methods](#database-methods)
9. [Query Operators](#query-operators)
10. [Other Operations](#other-operations)
11. [Aggregation](#aggregation)
12. [Advanced Aggregation](#advanced-aggregation)
13. [Aggregation Operators](#aggregation-operators)

---

## MongoDB কী?

MongoDB একটি **NoSQL Database** যা data কে **JSON-like documents** হিসেবে store করে। Traditional SQL database এর মতো rows/columns নয়, বরং flexible documents ব্যবহার করে।

**বৈশিষ্ট্য:**

- Schema-less (fixed structure নেই)
- Horizontal scaling সহজ
- JSON/BSON format এ data store
- Complex queries ও aggregation সাপোর্ট করে

---

## Installation (Windows)

### Step 1: Download

```javascript
https://www.mongodb.com/try/download/community
```

### Step 2: Install

- Installer চালু → **Complete** সিলেক্ট
- ✅ "Install MongoD as a Service" চেক করো
- Service Name: `MongoDB`
- Data Directory: `C:\Program Files\MongoDB\Server\8.2\data\`
- Log Directory: `C:\Program Files\MongoDB\Server\8.2\log\`

### Step 3: Environment Variable

```
C:\Program Files\MongoDB\Server\8.2\bin
```

Start Menu → "Edit the system environment variables" → Environment Variables → System variables → Path → Edit → New → Paste করো

### Step 4: Mongosh আলাদা Install করো

> ⚠️ MongoDB 8.x তে mongosh আলাদাভাবে install করতে হয়!

```javascript
https://www.mongodb.com/try/download/shell
থেকে MSI ডাউনলোড করে install করো।
```

### Step 5: Verify

```bash
mongosh
# দেখাবে: test>
```

### Service Commands

```bash
net start MongoDB    # চালু করো
net stop MongoDB     # বন্ধ করো
```

---

## Terminology & Data Model

| MongoDB           | SQL Equivalent | বাংলা        |
| ----------------- | -------------- | ------------ |
| Database          | Database       | ডেটাবেস      |
| Collection        | Table          | টেবিল        |
| Document          | Row            | একটি রেকর্ড  |
| Field             | Column         | কলাম         |
| `_id`             | Primary Key    | প্রাইমারি কী |
| Embedded Document | JOIN           | nested data  |

---

## Data Types

| Type            | Example                              |
| --------------- | ------------------------------------ |
| String          | `"name": "Rafi"`                     |
| Number (Int)    | `"age": 25`                          |
| Number (Double) | `"price": 99.99`                     |
| Boolean         | `"inStock": true`                    |
| Array           | `"tags": ["mobile", "new"]`          |
| Object          | `"address": { "city": "Dhaka" }`     |
| ObjectId        | `_id: ObjectId('...')`               |
| Date            | `"createdAt": ISODate("2024-01-01")` |
| Null            | `"discount": null`                   |

---

## MongoDB Compass

MongoDB এর অফিসিয়াল **GUI tool** — command line ছাড়াই visually database manage করা যায়।

### Connect করার উপায়

1. Start Menu → **MongoDB Compass** ওপেন করো
2. Connection string দাও: `mongodb://localhost:27017`
3. **Connect** চাপো

### Compass দিয়ে যা করা যায়

| Feature              | কাজ                           |
| -------------------- | ----------------------------- |
| Connection           | Local বা Atlas এ connect      |
| Database/Collection  | Create, drop, browse          |
| Documents            | Insert, edit, delete visually |
| Query Bar            | Filter, sort, project         |
| Aggregation Pipeline | Visual drag & drop pipeline   |
| Schema Analysis      | Data structure visualize      |
| Index Management     | Index তৈরি ও দেখা             |
| Explain Plan         | Query performance দেখা        |

### Compass vs mongosh

|             | Compass             | mongosh         |
| ----------- | ------------------- | --------------- |
| Type        | GUI                 | CLI             |
| সহজ         | ✅ বেশি সহজ         | কোড লিখতে হয়   |
| Aggregation | Visual pipeline     | Code লিখতে হয়  |
| Best for    | Data দেখা ও explore | Development কাজ |

---

## MongoDB Atlas

MongoDB এর **Cloud Service Platform** — নিজের machine এ install ছাড়াই cloud এ database চালানো যায়।

### Setup

1. [cloud.mongodb.com](https://cloud.mongodb.com) এ account খোলো
2. **Free Tier (M0)** cluster তৈরি করো
3. IP Whitelist এ তোমার IP যোগ করো
4. Database user তৈরি করো
5. Connection string নাও:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
```

---

## VS Code Extension

### Install

VS Code → Extensions → **"MongoDB for VS Code"** সার্চ করো → Install

### ব্যবহার

- Left sidebar এ MongoDB icon দেখাবে
- Connection string দিয়ে connect করো
- `.mongodb` ফাইলে query লিখে run করা যায়
- Database, collection, document সব browse করা যায়

---

## Database Methods

### Database Commands

```javascript
show dbs                    // সব database দেখো
use ecommerce               // database তৈরি/switch করো
db                          // current database দেখো
db.dropDatabase()           // database delete করো
show collections            // সব collection দেখো
```

### Insert One

```javascript
db.products.insertOne({
  name: "iPhone 10",
  price: 10000,
  category: "mobile",
  stock: 12,
});
```

### Insert Many

```javascript
db.products.insertMany([
  { name: "Samsung Galaxy S24", price: 85000, category: "mobile", stock: 10 },
  { name: "MacBook Pro", price: 250000, category: "laptop", stock: 5 },
  { name: "Sony Headphone", price: 15000, category: "accessories", stock: 20 },
  { name: "iPad Pro", price: 120000, category: "tablet", stock: 8 },
  { name: "OnePlus 12", price: 65000, category: "mobile", stock: 15 },
]);
```

### Find (Read)

```javascript
db.products.find(); // সব document
db.products.find({ category: "mobile" }); // filter দিয়ে
db.products.findOne({ name: "iPad Pro" }); // একটি document
```

### Projection

```javascript
// শুধু নির্দিষ্ট field দেখাও (1 = include, 0 = exclude)
db.products.find({}, { name: 1, price: 1, _id: 0 });

// নির্দিষ্ট field বাদ দাও
db.products.find({ stock: 8 }, { name: 0 });
```

> ⚠️ একসাথে 0 ও 1 mix করা যাবে না, শুধু `_id` ব্যতিক্রম।

### Update

```javascript
// একটা document update
db.products.updateOne({ name: "OnePlus 12" }, { $set: { price: 70000 } });

// সব document update
db.products.updateMany({ category: "mobile" }, { $set: { featured: true } });

// field যোগ করো
db.products.updateOne({ name: "MacBook Pro" }, { $set: { brand: "Apple" } });

// field বাড়াও/কমাও
db.products.updateOne(
  { name: "iPad Pro" },
  { $inc: { stock: -1 } }, // stock 1 কমাও
);
```

### Delete

```javascript
db.products.deleteOne({ name: "iPhone 10" }); // একটা delete
db.products.deleteMany({ category: "mobile" }); // সব mobile delete
db.products.deleteMany({}); // সব document delete
```

---

## Query Operators

### Comparison Operators (তুলনা)

```javascript
db.products.find({ price: { $gt: 50000 } }); // greater than
db.products.find({ price: { $gte: 50000 } }); // greater than or equal
db.products.find({ price: { $lt: 50000 } }); // less than
db.products.find({ price: { $lte: 50000 } }); // less than or equal
db.products.find({ price: { $eq: 15000 } }); // equal
db.products.find({ price: { $ne: 15000 } }); // not equal
db.products.find({ category: { $in: ["mobile", "laptop"] } }); // in array
db.products.find({ category: { $nin: ["mobile", "laptop"] } }); // not in array
```

### Logical Operators (যুক্তি)

```javascript
// AND - সব condition true হতে হবে
db.products.find({ $and: [{ price: { $gt: 50000 } }, { category: "mobile" }] });

// OR - যেকোনো একটা condition true হলেই চলবে
db.products.find({ $or: [{ category: "mobile" }, { category: "laptop" }] });

// NOT
db.products.find({ price: { $not: { $gt: 50000 } } });

// NOR - কোনোটাই true না হলে
db.products.find({ $nor: [{ category: "mobile" }, { category: "laptop" }] });
```

### Element Operators

```javascript
// field exist করে কিনা
db.products.find({ brand: { $exists: true } });
db.products.find({ brand: { $exists: false } });

// data type চেক
db.products.find({ price: { $type: "number" } });
db.products.find({ name: { $type: "string" } });
```

### Evaluation Operators

```javascript
// Regex - নামে "pro" আছে এমন
db.products.find({ name: { $regex: /pro/i } });

// Where - custom expression
db.products.find({ $where: "this.price > 50000" });

// Mod - price ভাগ করলে remainder
db.products.find({ price: { $mod: [1000, 0] } });
```

---

## Other Operations

### Sort

```javascript
db.products.find().sort({ price: 1 }); // ascending (কম থেকে বেশি)
db.products.find().sort({ price: -1 }); // descending (বেশি থেকে কম)
db.products.find().sort({ category: 1, price: -1 }); // multiple sort
```

### Limit

```javascript
db.products.find().limit(3); // প্রথম 3টা দেখাও
db.products.find().sort({ price: -1 }).limit(2); // সবচেয়ে দামি 2টা
```

### Skip

```javascript
db.products.find().skip(2); // প্রথম 2টা skip করো
db.products.find().skip(2).limit(3); // pagination এর জন্য
```

### Distinct

```javascript
db.products.distinct("category"); // unique category গুলো
db.products.distinct("brand");
```

### Count

```javascript
db.products.countDocuments(); // সব document count
db.products.countDocuments({ category: "mobile" }); // filtered count
```

---

## Aggregation

Aggregation হলো data কে **process** করে result বের করা — SQL এর GROUP BY, JOIN এর মতো।

### Basic Structure

```javascript
db.products.aggregate([
  { $stage1: {...} },
  { $stage2: {...} },
  // ...
])
```

### Match (Filter)

```javascript
db.products.aggregate([{ $match: { category: "mobile" } }]);
```

### Sort

```javascript
db.products.aggregate([{ $sort: { price: -1 } }]);
```

### Limit ও Skip

```javascript
db.products.aggregate([{ $sort: { price: -1 } }, { $skip: 1 }, { $limit: 3 }]);
```

### Projection

```javascript
db.products.aggregate([{ $project: { name: 1, price: 1, _id: 0 } }]);
```

### First ও Last

```javascript
db.products.aggregate([
  { $sort: { price: 1 } },
  {
    $group: {
      _id: null,
      cheapest: { $first: "$name" },
      mostExpensive: { $last: "$name" },
    },
  },
]);
```

### Like (Regex)

```javascript
db.products.aggregate([{ $match: { name: { $regex: /samsung/i } } }]);
```

---

## Advanced Aggregation

### Group By

```javascript
db.products.aggregate([
  {
    $group: {
      _id: "$category", // group করার field
      totalProducts: { $sum: 1 }, // প্রতি group এ count
    },
  },
]);
```

### Group By SUM, AVG, MAX, MIN

```javascript
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      totalPrice: { $sum: "$price" },
      avgPrice: { $avg: "$price" },
      maxPrice: { $max: "$price" },
      minPrice: { $min: "$price" },
      count: { $sum: 1 },
    },
  },
]);
```

### Without Group By (সব document এর উপর)

```javascript
db.products.aggregate([
  {
    $group: {
      _id: null, // null মানে সব একসাথে
      totalRevenue: { $sum: "$price" },
      averagePrice: { $avg: "$price" },
      maxPrice: { $max: "$price" },
      minPrice: { $min: "$price" },
    },
  },
]);
```

### Group By Multiple Fields

```javascript
db.products.aggregate([
  {
    $group: {
      _id: { category: "$category", brand: "$brand" },
      count: { $sum: 1 },
      avgPrice: { $avg: "$price" },
    },
  },
]);
```

### Add New Field

```javascript
db.products.aggregate([
  {
    $addFields: {
      discountedPrice: { $multiply: ["$price", 0.9] }, // 10% discount
      priceWithTax: { $multiply: ["$price", 1.15] }, // 15% tax
    },
  },
]);
```

### Lookup (JOIN)

```javascript
// orders collection এ products join করো
db.orders.aggregate([
  {
    $lookup: {
      from: "products", // join করার collection
      localField: "productId", // orders এর field
      foreignField: "_id", // products এর field
      as: "productDetails", // result এর নাম
    },
  },
]);
```

### Projection After Join

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
  {
    $project: {
      orderId: 1,
      "product.name": 1,
      "product.price": 1,
    },
  },
]);
```

### Facet (Multiple Aggregations একসাথে)

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
        { $project: { name: 1, price: 1 } },
      ],
    },
  },
]);
```

---

## Aggregation Operators

### Arithmetic Operators

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
  $abs: ["$value"];
} // absolute value
{
  $ceil: ["$price"];
} // উপরে round
{
  $floor: ["$price"];
} // নিচে round
{
  $round: ["$price", 2];
} // 2 decimal round
```

### String Operators

```javascript
{
  $concat: ["$firstName", " ", "$lastName"];
} // জোড়া লাগাও
{
  $toUpper: "$name";
} // uppercase
{
  $toLower: "$name";
} // lowercase
{
  $substr: ["$name", 0, 5];
} // substring
{
  $strLenCP: "$name";
} // string length
{
  $trim: {
    input: "$name";
  }
} // space remove
{
  $split: ["$name", " "];
} // split করো
```

### Date Operators

```javascript
{ $year: "$createdAt" }              // বছর
{ $month: "$createdAt" }             // মাস
{ $dayOfMonth: "$createdAt" }        // দিন
{ $hour: "$createdAt" }              // ঘণ্টা
{ $minute: "$createdAt" }            // মিনিট
{ $dayOfWeek: "$createdAt" }         // সপ্তাহের দিন (1=Sunday)
{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
```

### Comparison Operators (Aggregation)

```javascript
{
  $eq: ["$price", 1000];
} // equal
{
  $ne: ["$price", 1000];
} // not equal
{
  $gt: ["$price", 1000];
} // greater than
{
  $gte: ["$price", 1000];
} // greater than or equal
{
  $lt: ["$price", 1000];
} // less than
{
  $lte: ["$price", 1000];
} // less than or equal
{
  $cmp: ["$price", "$cost"];
} // compare (-1, 0, 1)
```

### Boolean Operators

```javascript
{
  $and: [{ $gt: ["$price", 1000] }, { $lt: ["$price", 5000] }];
}
{
  $or: [{ $eq: ["$category", "mobile"] }, { $eq: ["$category", "laptop"] }];
}
{
  $not: [{ $gt: ["$price", 1000] }];
}
```

### Conditional Operators

```javascript
// If-Else
{ $cond: {
  if: { $gte: ["$price", 100000] },
  then: "Expensive",
  else: "Affordable"
}}

// Null check
{ $ifNull: ["$discount", 0] }    // discount null হলে 0 দাও

// Switch-Case
{ $switch: {
  branches: [
    { case: { $lt: ["$price", 10000] }, then: "Budget" },
    { case: { $lt: ["$price", 50000] }, then: "Mid-range" },
    { case: { $gte: ["$price", 50000] }, then: "Premium" }
  ],
  default: "Unknown"
}}
```

---

## 📝 Quick Reference Card

```javascript
// Database
use dbName          // switch/create
show dbs            // list all
db.dropDatabase()   // delete

// CRUD
db.col.insertOne({})
db.col.insertMany([{}])
db.col.find({filter}, {projection})
db.col.updateOne({filter}, {$set:{}})
db.col.updateMany({filter}, {$set:{}})
db.col.deleteOne({filter})
db.col.deleteMany({filter})

// Query
$gt $gte $lt $lte $eq $ne $in $nin
$and $or $not $nor
$exists $type $regex

// Aggregation
$match $group $sort $limit $skip
$project $lookup $addFields $facet
$sum $avg $max $min $first $last
```
