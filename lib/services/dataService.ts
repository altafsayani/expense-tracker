import { prisma } from '../db';
import * as tursoRepository from '../repositories/tursoRepository';

const isProduction = process.env.NODE_ENV === 'production';

// Category services
export async function getAllCategories() {
  if (isProduction) {
    return tursoRepository.getAllCategories();
  }
  return prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function getCategoryById(id: string) {
  if (isProduction) {
    return tursoRepository.getCategoryById(id);
  }
  return prisma.category.findUnique({
    where: { id }
  });
}

export async function createCategory(name: string) {
  if (isProduction) {
    return tursoRepository.createCategory(name);
  }
  return prisma.category.create({
    data: { name }
  });
}

export async function updateCategory(id: string, name: string) {
  if (isProduction) {
    return tursoRepository.updateCategory(id, name);
  }
  return prisma.category.update({
    where: { id },
    data: { name }
  });
}

export async function deleteCategory(id: string) {
  if (isProduction) {
    return tursoRepository.deleteCategory(id);
  }
  return prisma.category.delete({
    where: { id }
  });
}

// Expense services
export async function getAllExpenses() {
  if (isProduction) {
    return tursoRepository.getAllExpenses();
  }
  return prisma.expense.findMany({
    include: {
      category: true
    },
    orderBy: {
      date: 'desc'
    }
  });
}

export async function getExpenseById(id: string) {
  if (isProduction) {
    return tursoRepository.getExpenseById(id);
  }
  return prisma.expense.findUnique({
    where: { id },
    include: {
      category: true
    }
  });
}

export async function createExpense(data: {
  amount: number;
  description: string;
  date: string | Date;
  categoryId: string;
}) {
  if (isProduction) {
    const formattedDate = typeof data.date === 'string' 
      ? data.date 
      : data.date.toISOString();
      
    return tursoRepository.createExpense({
      ...data,
      date: formattedDate
    });
  }
  
  return prisma.expense.create({
    data: {
      amount: data.amount,
      description: data.description,
      date: new Date(data.date),
      categoryId: data.categoryId
    },
    include: {
      category: true
    }
  });
}

export async function updateExpense(
  id: string,
  data: {
    amount: number;
    description: string;
    date: string | Date;
    categoryId: string;
  }
) {
  if (isProduction) {
    const formattedDate = typeof data.date === 'string' 
      ? data.date 
      : data.date.toISOString();
      
    return tursoRepository.updateExpense(id, {
      ...data,
      date: formattedDate
    });
  }
  
  return prisma.expense.update({
    where: { id },
    data: {
      amount: data.amount,
      description: data.description,
      date: new Date(data.date),
      categoryId: data.categoryId
    },
    include: {
      category: true
    }
  });
}

export async function deleteExpense(id: string) {
  if (isProduction) {
    return tursoRepository.deleteExpense(id);
  }
  return prisma.expense.delete({
    where: { id }
  });
} 