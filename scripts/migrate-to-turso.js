const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client');
require('dotenv').config();

const prisma = new PrismaClient();
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  try {
    console.log('Starting migration to Turso...');

    // Create tables in Turso
    console.log('Creating tables in Turso...');
    
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS Category (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS Expense (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        categoryId TEXT NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES Category(id)
      )
    `);

    // Fetch categories from SQLite
    console.log('Migrating categories...');
    const categories = await prisma.category.findMany();
    
    // Insert categories into Turso
    for (const category of categories) {
      await turso.execute({
        sql: `
          INSERT INTO Category (id, name, createdAt, updatedAt)
          VALUES (?, ?, ?, ?)
        `,
        args: [
          category.id,
          category.name,
          category.createdAt.toISOString(),
          category.updatedAt.toISOString()
        ]
      });
    }
    console.log(`Migrated ${categories.length} categories`);

    // Fetch expenses from SQLite
    console.log('Migrating expenses...');
    const expenses = await prisma.expense.findMany();
    
    // Insert expenses into Turso
    for (const expense of expenses) {
      await turso.execute({
        sql: `
          INSERT INTO Expense (id, amount, description, date, createdAt, updatedAt, categoryId)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          expense.id,
          expense.amount,
          expense.description,
          expense.date.toISOString(),
          expense.createdAt.toISOString(),
          expense.updatedAt.toISOString(),
          expense.categoryId
        ]
      });
    }
    console.log(`Migrated ${expenses.length} expenses`);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
    await turso.close();
  }
}

main(); 