# CRUD Operations with Express TypeScript PostgresSQL

---

## Index

- [Module-1 — Project Setup](#module-1--project-setup)
- [Module-2 — PostgreSQL Connection & Middleware](#module-2--postgresql-connection--middleware)
- [Module-3 — Database Initialization](#module-3--database-initialization)
- [Module-4 — Todos Table & dotenv](#module-4--todos-table--dotenv)
- [Module-5 — Create User (POST)](#module-5--create-user-post)
- [Module-6 — Read Users (GET)](#module-6--read-users-get)
- [Module-7 — Update & Delete User](#module-7--update--delete-user)
- [Module-8 — Todos CRUD](#module-8--todos-crud)
- [Module-9 — Middleware](#module-9--middleware)
- [PostgreSQL Basics](#postgresql-basics)

---

## Module-1 — Project Setup

নতুন project শুরু করতে যা যা করেছি:

```bash
npm init -y
npm install express
npm install -D typescript tsx @types/express
```

> **Note:** Folder name-এ special character (`,`, `&`, space) থাকলে `npm init` error দেয়। Folder name simple রাখতে হবে।

`package.json` এ dev script:

```json
"scripts": {
  "dev": "npx tsx watch ./src/server.ts"
}
```

`tsx` দিয়ে TypeScript file সরাসরি run করা যায়, আলাদা compile লাগে না।

---

## Module-2 — PostgreSQL Connection & Middleware

```typescript
import { Pool } from "pg";
import express from "express";

const pool = new Pool({
  connectionString: "postgresql://...",
});

app.use(express.json()); // JSON body parse করে
```

**`Pool` কী?**
Database-এর সাথে একটা connection না করে, একটা pool (গুচ্ছ) of connections রাখে। Request আসলে pool থেকে একটা connection নেয়, শেষ হলে ফেরত দেয়। অনেক বেশি efficient।

**`express.json()`**
POST/PUT request-এ body-তে JSON data পাঠালে এই middleware সেটা parse করে `req.body`-তে রাখে। না দিলে `req.body` undefined হবে।

---

## Module-3 — Database Initialization

```typescript
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      email      VARCHAR(150) UNIQUE NOT NULL,
      age        INT,
      phone      VARCHAR(15),
      address    TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

initDB();
```

**গুরুত্বপূর্ণ বিষয়:**

| বিষয়                        | ব্যাখ্যা                                      |
| ---------------------------- | --------------------------------------------- |
| `async/await`                | Database query time নেয়, তাই async           |
| `CREATE TABLE IF NOT EXISTS` | Table আগে থেকে থাকলে error দেবে না            |
| `SERIAL PRIMARY KEY`         | Auto-increment unique ID                      |
| `NOT NULL`                   | এই column খালি রাখা যাবে না                   |
| `UNIQUE`                     | Duplicate value চলবে না                       |
| `DEFAULT NOW()`              | Insert-এর সময় automatically current time বসে |

> ⚠️ SQL-এ শেষ column-এর পর comma দেওয়া যাবে না — error হবে।

---

## Module-4 — Todos Table & dotenv

**Todos Table:**

```typescript
await pool.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id          SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    completed   BOOLEAN DEFAULT false,
    due_date    DATE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
  )
`);
```

**`REFERENCES users(id)`** — Foreign key। `user_id` অবশ্যই `users` table-এর কোনো `id` হতে হবে।

**`ON DELETE CASCADE`** — কোনো user delete হলে তার সব todos-ও automatically delete হয়ে যাবে।

---

**dotenv দিয়ে connection string secure করা:**

`.env` file:

```
CONNECTION_STR=postgresql://user:pass@host/db?sslmode=require
```

`server.ts`:

```typescript
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const pool = new Pool({
  connectionString: process.env.CONNECTION_STR,
});
```

> ⚠️ `.env` file কখনো GitHub-এ push করবে না। `.gitignore`-এ add করো।

---

## Module-5 — Create User (POST)

```typescript
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email],
    );
    res.status(201).json({
      success: true,
      message: "Data is inserted",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
```

**গুরুত্বপূর্ণ বিষয়:**

| বিষয়         | ব্যাখ্যা                                                |
| ------------- | ------------------------------------------------------- |
| `$1, $2`      | Parameterized query — SQL injection থেকে safe           |
| `RETURNING *` | Insert হওয়া row টা ফেরত দেয়                           |
| `try/catch`   | Error হলে server crash না করে client-কে জানায়          |
| `status(201)` | 201 = Created, নতুন data তৈরি হলে এটা দেওয়া convention |

---

## Module-6 — Read Users (GET)

**সব user আনা:**

```typescript
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "Data getting successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
```

**একটা নির্দিষ্ট user আনা:**

```typescript
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: "Data not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Data retrieved successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
```

**`result.rows` vs `result.rowCount`:**

|         | `rows`              | `rowCount`                        |
| ------- | ------------------- | --------------------------------- |
| কী দেয় | Actual data (array) | কতটা row affected হয়েছে (number) |
| SELECT  | সব matched rows     | matched count                     |
| INSERT  | `RETURNING *` থাকলে | insert count                      |
| UPDATE  | `RETURNING *` থাকলে | update count                      |
| DELETE  | সাধারণত `[]`        | delete count                      |

---

## Module-7 — Update & Delete User

**Update:**

```typescript
app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, req.params.id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: "Data not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Data updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
```

**Delete:**

```typescript
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: "Data not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Data deleted successfully",
        data: null,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
```

> DELETE-এ `RETURNING *` নেই, তাই `rows` সবসময় খালি থাকে। এজন্য `rowCount === 0` দিয়ে check করতে হবে।

---

## Module-8 — Todos CRUD

**Todo তৈরি:**

```typescript
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title],
    );
    res.status(201).json({
      success: true,
      message: "Todo inserted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
```

**সব todos আনা:**

```typescript
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`); // ✅ todos table
    res.status(200).json({
      success: true,
      message: "Todos data getting successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
```

---

## Module-9 — Middleware

**Logger Middleware** — প্রতিটা request log করে:

```typescript
import { NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next(); // এটা না দিলে request আটকে যাবে
};

app.use(logger);
```

**404 Middleware** — কোনো route match না হলে:

```typescript
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});
```

> 404 middleware সবসময় **সব route-এর পরে** রাখতে হবে। নইলে সব request এখানে আটকে যাবে।

**Middleware কীভাবে কাজ করে:**

```
Request → Logger → Route Handler → Response
                ↓ (route না থাকলে)
             404 Handler → Response
```

---

## PostgreSQL Basics

### Database, Table, Row, Column

```
Database
  └── Table (users, todos...)
        └── Row (একটা record)
              └── Column (id, name, email...)
```

---

### গুরুত্বপূর্ণ Data Types

| Type              | কী রাখা যায়           | উদাহরণ              |
| ----------------- | ---------------------- | ------------------- |
| `SERIAL`          | Auto-increment integer | 1, 2, 3...          |
| `INTEGER` / `INT` | পূর্ণ সংখ্যা           | 25, -7              |
| `BIGINT`          | অনেক বড় সংখ্যা        | 9 billion+          |
| `VARCHAR(n)`      | সীমিত text             | "Rahim"             |
| `TEXT`            | যেকোনো দৈর্ঘ্যের text  | paragraph           |
| `BOOLEAN`         | true বা false          | TRUE, FALSE         |
| `NUMERIC(p,s)`    | দশমিক সংখ্যা           | 99.99               |
| `DATE`            | শুধু তারিখ             | 2025-01-01          |
| `TIMESTAMP`       | তারিখ + সময়           | 2025-01-01 10:30:00 |
| `JSONB`           | JSON data              | {"key": "val"}      |

> ⚠️ টাকার জন্য `FLOAT` নয় — `NUMERIC(10,2)` ব্যবহার করো। FLOAT-এ rounding error হয়।

---

### Constraints

| Constraint          | মানে                                         |
| ------------------- | -------------------------------------------- |
| `PRIMARY KEY`       | Unique + Not Null — table-এর main identifier |
| `NOT NULL`          | খালি রাখা যাবে না                            |
| `UNIQUE`            | Duplicate value চলবে না                      |
| `DEFAULT value`     | কিছু না দিলে এই value বসবে                   |
| `REFERENCES`        | Foreign key — অন্য table-এর column point করে |
| `ON DELETE CASCADE` | Parent delete হলে child-ও delete হবে         |

---

### CRUD Queries

```sql
-- Create
INSERT INTO users (name, email) VALUES ('Rahim', 'rahim@mail.com');

-- Read
SELECT * FROM users;
SELECT * FROM users WHERE id = 1;
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- Update
UPDATE users SET name = 'Karim' WHERE id = 1;

-- Delete
DELETE FROM users WHERE id = 1;
```

> ⚠️ `WHERE` ছাড়া `UPDATE` বা `DELETE` দিলে **সব row** affected হবে।

---

### NULL সামলানো

```sql
WHERE email IS NULL    -- ✅ সঠিক
WHERE email = NULL     -- ❌ কাজ করবে না
```

---

### LIKE দিয়ে Search

```sql
WHERE name LIKE 'R%'        -- 'R' দিয়ে শুরু
WHERE name LIKE '%rahim%'   -- যেকোনো জায়গায় 'rahim'
WHERE name ILIKE '%rahim%'  -- case-insensitive
```

---

### JOIN — দুটো Table একসাথে

```sql
-- users এবং todos একসাথে দেখা
SELECT users.name, todos.title
FROM users
INNER JOIN todos ON users.id = todos.user_id;
```

| JOIN Type    | কী দেয়                              |
| ------------ | ------------------------------------ |
| `INNER JOIN` | দুই table-এ match আছে এমন rows       |
| `LEFT JOIN`  | বাম table-এর সব + match হলে ডানেরটাও |
| `RIGHT JOIN` | ডান table-এর সব + match হলে বামেরটাও |

---

### Aggregate Functions

```sql
SELECT
  COUNT(*),        -- কতটা row
  SUM(amount),     -- মোট যোগফল
  AVG(amount),     -- গড়
  MAX(amount),     -- সর্বোচ্চ
  MIN(amount)      -- সর্বনিম্ন
FROM orders;

-- GROUP BY — user অনুযায়ী মোট
SELECT user_id, SUM(amount) AS total
FROM orders
GROUP BY user_id
ORDER BY total DESC;
```

---

### Index — Query দ্রুত করা

```sql
-- index তৈরি
CREATE INDEX idx_users_email ON users(email);

-- unique index
CREATE UNIQUE INDEX idx_email_uniq ON users(email);
```

> যে column দিয়ে বেশি `WHERE` বা `JOIN` করো সেখানে index দাও। তবে বেশি index দিলে `INSERT`/`UPDATE` একটু slow হয়।
