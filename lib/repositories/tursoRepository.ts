import { getTursoClient } from '../db';

// Category operations
export async function getAllCategories() {
  const db = getTursoClient();
  const result = await db.execute('SELECT * FROM Category ORDER BY name');
  return result.rows;
}

export async function getCategoryById(id: string) {
  const db = getTursoClient();
  const result = await db.execute({
    sql: 'SELECT * FROM Category WHERE id = ?',
    args: [id]
  });
  return result.rows[0];
}

export async function createCategory(name: string) {
  const db = getTursoClient();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await db.execute({
    sql: 'INSERT INTO Category (id, name, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
    args: [id, name, now, now]
  });
  
  return { id, name, createdAt: now, updatedAt: now };
}

export async function updateCategory(id: string, name: string) {
  const db = getTursoClient();
  const now = new Date().toISOString();
  
  await db.execute({
    sql: 'UPDATE Category SET name = ?, updatedAt = ? WHERE id = ?',
    args: [name, now, id]
  });
  
  return { id, name, updatedAt: now };
}

export async function deleteCategory(id: string) {
  const db = getTursoClient();
  await db.execute({
    sql: 'DELETE FROM Category WHERE id = ?',
    args: [id]
  });
}

// Expense operations
export async function getAllExpenses() {
  const db = getTursoClient();
  const result = await db.execute(`
    SELECT e.*, c.name as categoryName
    FROM Expense e
    JOIN Category c ON e.categoryId = c.id
    ORDER BY e.date DESC
  `);
  return result.rows;
}

export async function getExpenseById(id: string) {
  const db = getTursoClient();
  const result = await db.execute({
    sql: `
      SELECT e.*, c.name as categoryName
      FROM Expense e
      JOIN Category c ON e.categoryId = c.id
      WHERE e.id = ?
    `,
    args: [id]
  });
  return result.rows[0];
}

export async function createExpense(data: {
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}) {
  const db = getTursoClient();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await db.execute({
    sql: `
      INSERT INTO Expense (id, amount, description, date, createdAt, updatedAt, categoryId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      data.amount,
      data.description,
      data.date,
      now,
      now,
      data.categoryId
    ]
  });
  
  return {
    id,
    ...data,
    createdAt: now,
    updatedAt: now
  };
}

export async function updateExpense(
  id: string,
  data: {
    amount: number;
    description: string;
    date: string;
    categoryId: string;
  }
) {
  const db = getTursoClient();
  const now = new Date().toISOString();
  
  await db.execute({
    sql: `
      UPDATE Expense
      SET amount = ?, description = ?, date = ?, updatedAt = ?, categoryId = ?
      WHERE id = ?
    `,
    args: [
      data.amount,
      data.description,
      data.date,
      now,
      data.categoryId,
      id
    ]
  });
  
  return {
    id,
    ...data,
    updatedAt: now
  };
}

export async function deleteExpense(id: string) {
  const db = getTursoClient();
  await db.execute({
    sql: 'DELETE FROM Expense WHERE id = ?',
    args: [id]
  });
} 