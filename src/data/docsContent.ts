export interface DocSection {
  id: string;
  title: string;
  content: string;
  category: string;
  order: number;
}

export interface DocCategory {
  id: string;
  title: string;
  icon: string;
  order: number;
  sections: DocSection[];
}

export const docsData: DocCategory[] = [
  {
    id: "mission-1",
    title: "Mission 1: Be A Critical Thinker With JS",
    icon: "🧠",
    order: 1,
    sections: [
      {
        id: "intro-critical-thinking",
        title: "Module 1: Introduction to Critical Thinking",
        category: "mission-1",
        order: 1,
        content: `# Introduction to Critical Thinking

Welcome to Mission 1! This module focuses on developing critical thinking skills through JavaScript.

## Why Critical Thinking Matters

As developers, we don't just write code—we solve problems. Critical thinking is the foundation of effective problem-solving.

### Key Concepts

- **Analysis**: Breaking down complex problems into smaller parts
- **Evaluation**: Assessing the quality and validity of solutions
- **Inference**: Drawing logical conclusions from available data
- **Explanation**: Clearly communicating your reasoning

## Getting Started

\`\`\`javascript
// Always question your assumptions
const assumption = "This will always work";
const reality = testAssumption(assumption);

if (reality !== assumption) {
  console.log("Time to debug! 🔍");
}
\`\`\`

## Mindset Shift

> "The only way to do great work is to question everything." — Every senior developer ever

Before writing code, ask yourself:
1. What problem am I actually solving?
2. What are the edge cases?
3. Is there a simpler solution?
`,
      },
      {
        id: "problem-decomposition",
        title: "Module 2: Problem Decomposition",
        category: "mission-1",
        order: 2,
        content: `# Problem Decomposition

Breaking down complex problems into manageable pieces is a core skill.

## The Decomposition Process

1. **Identify the main goal**
2. **List all sub-problems**
3. **Order by dependency**
4. **Solve one at a time**

## Example: Building a Todo App

Let's decompose a simple todo application:

\`\`\`typescript
// Main goal: Todo application

// Sub-problems:
interface TodoApp {
  // 1. Data structure
  todos: Todo[];

  // 2. Add functionality
  addTodo: (text: string) => void;

  // 3. Remove functionality
  removeTodo: (id: string) => void;

  // 4. Toggle complete
  toggleComplete: (id: string) => void;

  // 5. Filter todos
  filterTodos: (status: 'all' | 'active' | 'completed') => Todo[];
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}
\`\`\`

## Practice Exercise

Try decomposing these problems:
- A user authentication system
- A shopping cart feature
- A real-time chat application
`,
      },
      {
        id: "data-structures",
        title: "Module 3: Data Structures that Actually Matter",
        category: "mission-1",
        order: 3,
        content: `# Data Structures that Actually Matter

Understanding data structures is crucial for writing efficient code.

## Stateless vs Stateful

### Stateless
Components or functions that don't maintain internal state:

\`\`\`typescript
// Stateless - pure function
const add = (a: number, b: number): number => a + b;

// Always returns the same output for the same input
console.log(add(2, 3)); // Always 5
\`\`\`

### Stateful
Components that maintain and modify internal state:

\`\`\`typescript
// Stateful - maintains internal state
class Counter {
  private count: number = 0;

  increment(): number {
    return ++this.count;
  }

  getCount(): number {
    return this.count;
  }
}

const counter = new Counter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
\`\`\`

## Basic Class Refresher

\`\`\`typescript
class DataStructure<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
\`\`\`

## Essential Data Structures

| Structure | Use Case | Time Complexity (Access) |
|-----------|----------|-------------------------|
| Array | Ordered collection | O(1) |
| Object/Map | Key-value pairs | O(1) |
| Set | Unique values | O(1) |
| Stack | LIFO operations | O(1) |
| Queue | FIFO operations | O(1) |

## When to Use What

- **Arrays**: When order matters and you need index access
- **Sets**: When you need unique values only
- **Maps**: When you need fast key-based lookup
- **Stacks**: Undo operations, parsing, recursion
- **Queues**: Task scheduling, BFS algorithms
`,
      },
    ],
  },
  {
    id: "mission-2",
    title: "Mission 2: Explore TypeScript Deep Dive",
    icon: "📘",
    order: 2,
    sections: [
      {
        id: "typescript-basics",
        title: "Module 1: TypeScript Fundamentals",
        category: "mission-2",
        order: 1,
        content: `# TypeScript Fundamentals

TypeScript adds static typing to JavaScript, catching errors before runtime.

## Why TypeScript?

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Autocomplete, refactoring
- **Self-Documenting**: Types serve as documentation
- **Scalability**: Easier to maintain large codebases

## Basic Types

\`\`\`typescript
// Primitive types
let isDone: boolean = false;
let count: number = 42;
let name: string = "TypeScript";

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Tuples
let pair: [string, number] = ["age", 25];

// Enums
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE"
}
\`\`\`

## Type Inference

TypeScript is smart enough to infer types:

\`\`\`typescript
// Type is inferred as number
let inferredNumber = 42;

// Type is inferred as string[]
let inferredArray = ["a", "b", "c"];

// Function return type is inferred
const multiply = (a: number, b: number) => a * b;
// Returns: number
\`\`\`

## Pro Tips

> Always prefer \`const\` over \`let\` when the value won't change. TypeScript will infer literal types!

\`\`\`typescript
const status = "success"; // Type: "success" (literal)
let status2 = "success";  // Type: string
\`\`\`
`,
      },
      {
        id: "interfaces-types",
        title: "Module 2: Interfaces & Type Aliases",
        category: "mission-2",
        order: 2,
        content: `# Interfaces & Type Aliases

Defining custom types for your data structures.

## Interfaces

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // Optional
  readonly createdAt: Date; // Can't be modified
}

// Extending interfaces
interface Admin extends User {
  permissions: string[];
  role: "admin" | "superadmin";
}

// Implementation
const admin: Admin = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  createdAt: new Date(),
  permissions: ["read", "write", "delete"],
  role: "admin"
};
\`\`\`

## Type Aliases

\`\`\`typescript
// Type alias for primitives
type ID = string | number;

// Type alias for objects
type Point = {
  x: number;
  y: number;
};

// Union types
type Status = "pending" | "success" | "error";

// Intersection types
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged;
\`\`\`

## When to Use What?

| Feature | Interface | Type Alias |
|---------|-----------|------------|
| Extend/Implement | ✅ Yes | ✅ Yes (with &) |
| Declaration Merging | ✅ Yes | ❌ No |
| Computed Properties | ❌ No | ✅ Yes |
| Union/Intersection | ❌ No | ✅ Yes |

**Rule of thumb**: Use interfaces for object shapes, types for everything else.
`,
      },
    ],
  },
  {
    id: "mission-3",
    title: "Mission 3: Backend with Node.js & Express",
    icon: "🚀",
    order: 3,
    sections: [
      {
        id: "nodejs-intro",
        title: "Module 1: Node.js Essentials",
        category: "mission-3",
        order: 1,
        content: `# Node.js Essentials

Node.js lets you run JavaScript on the server.

## The Event Loop

Node.js is single-threaded but non-blocking:

\`\`\`javascript
console.log("1. Start");

setTimeout(() => {
  console.log("2. Timeout callback");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise resolved");
});

console.log("4. End");

// Output:
// 1. Start
// 4. End
// 3. Promise resolved
// 2. Timeout callback
\`\`\`

## Working with Modules

\`\`\`typescript
// math.ts
export const add = (a: number, b: number) => a + b;
export const multiply = (a: number, b: number) => a * b;

// Default export
const calculator = { add, multiply };
export default calculator;

// main.ts
import calculator, { add } from './math';

console.log(add(2, 3)); // 5
console.log(calculator.multiply(4, 5)); // 20
\`\`\`

## File System Operations

\`\`\`typescript
import { promises as fs } from 'fs';

// Read file
const content = await fs.readFile('data.json', 'utf-8');
const data = JSON.parse(content);

// Write file
await fs.writeFile('output.json', JSON.stringify(data, null, 2));

// Check if file exists
try {
  await fs.access('file.txt');
  console.log('File exists');
} catch {
  console.log('File does not exist');
}
\`\`\`
`,
      },
      {
        id: "express-basics",
        title: "Module 2: Express.js Framework",
        category: "mission-3",
        order: 2,
        content: `# Express.js Framework

Express is the most popular Node.js web framework.

## Setting Up Express

\`\`\`typescript
import express, { Request, Response, NextFunction } from 'express';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/api/users', (req: Request, res: Response) => {
  res.json({ users: [] });
});

app.post('/api/users', (req: Request, res: Response) => {
  const { name, email } = req.body;
  // Create user logic
  res.status(201).json({ id: '1', name, email });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Middleware Pattern

\`\`\`typescript
// Authentication middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Use middleware
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'Welcome!', user: req.user });
});
\`\`\`

## Router Organization

\`\`\`typescript
// routes/users.ts
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

// app.ts
import userRoutes from './routes/users';
app.use('/api/users', userRoutes);
\`\`\`
`,
      },
    ],
  },
  {
    id: "mission-4",
    title: "Mission 4: Database with PostgreSQL & Prisma",
    icon: "🗄️",
    order: 4,
    sections: [
      {
        id: "postgresql-basics",
        title: "Module 1: PostgreSQL Fundamentals",
        category: "mission-4",
        order: 1,
        content: `# PostgreSQL Fundamentals

PostgreSQL is a powerful, open-source relational database.

## Basic SQL Commands

\`\`\`sql
-- Create table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data
INSERT INTO users (name, email)
VALUES ('John Doe', 'john@example.com');

-- Query data
SELECT * FROM users WHERE email LIKE '%@example.com';

-- Update data
UPDATE users SET name = 'Jane Doe' WHERE id = 1;

-- Delete data
DELETE FROM users WHERE id = 1;
\`\`\`

## Joins

\`\`\`sql
-- Inner join
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- Left join (all users, even without orders)
SELECT users.name, COALESCE(orders.total, 0) as total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
\`\`\`

## Indexes

\`\`\`sql
-- Create index for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Unique index
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- Composite index
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
\`\`\`
`,
      },
      {
        id: "prisma-orm",
        title: "Module 2: Prisma ORM",
        category: "mission-4",
        order: 2,
        content: `# Prisma ORM

Prisma is a modern database toolkit for TypeScript.

## Schema Definition

\`\`\`prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}
\`\`\`

## CRUD Operations

\`\`\`typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    name: 'Alice',
    posts: {
      create: { title: 'Hello World' }
    }
  },
  include: { posts: true }
});

// Read
const users = await prisma.user.findMany({
  where: { email: { contains: '@example.com' } },
  include: { posts: true }
});

// Update
const updated = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Alice Smith' }
});

// Delete
await prisma.user.delete({ where: { id: 1 } });
\`\`\`

## Transactions

\`\`\`typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { email: 'new@example.com' } });
  const post = await tx.post.create({
    data: { title: 'First Post', authorId: user.id }
  });
  return { user, post };
});
\`\`\`
`,
      },
    ],
  },
];

export const getAllSections = (): DocSection[] => {
  return docsData.flatMap((category) => category.sections);
};

export const getSectionById = (id: string): DocSection | undefined => {
  return getAllSections().find((section) => section.id === id);
};

export const getCategoryById = (id: string): DocCategory | undefined => {
  return docsData.find((category) => category.id === id);
};

export const searchDocs = (query: string): DocSection[] => {
  const lowerQuery = query.toLowerCase();
  return getAllSections().filter(
    (section) =>
      section.title.toLowerCase().includes(lowerQuery) ||
      section.content.toLowerCase().includes(lowerQuery)
  );
};
