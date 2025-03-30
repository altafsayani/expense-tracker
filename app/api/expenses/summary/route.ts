import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface CategorySummary {
  id: string;
  name: string;
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build Supabase query conditions
    let query = db.supabase
      .from('expenses')
      .select('*');
    
    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      query = query.lte('date', endDate);
    }
    
    // Fetch all expenses within date range
    const { data: expenses, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }
    
    // Calculate total expenses
    const total = expenses.reduce((sum: number, expense: Expense) => sum + Number(expense.amount), 0);
    
    // Get all categories
    const { data: categories, error: categoriesError } = await db.supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
    
    // Group expenses by category
    const expensesByCategory = categories.map((category: Category) => {
      const categoryExpenses = expenses.filter((expense: Expense) => expense.category_id === category.id);
      const categoryTotal = categoryExpenses.reduce((sum: number, expense: Expense) => sum + Number(expense.amount), 0);
      
      return {
        id: category.id,
        name: category.name,
        total: categoryTotal,
      };
    }).filter((category: CategorySummary) => category.total > 0);
    
    // Group expenses by month (for the last 6 months if no date range specified)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const filteredExpenses = startDate 
      ? expenses 
      : expenses.filter((expense: Expense) => new Date(expense.date) >= sixMonthsAgo);
    
    // Group expenses by month
    const monthlyData: Record<string, number> = {};
    
    filteredExpenses.forEach((expense: Expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyData[monthYear]) {
        monthlyData[monthYear] += Number(expense.amount);
      } else {
        monthlyData[monthYear] = Number(expense.amount);
      }
    });
    
    return NextResponse.json({
      total: total,
      byCategory: expensesByCategory,
      byMonth: Object.keys(monthlyData).map(month => ({
        month,
        total: monthlyData[month],
      })).sort((a, b) => a.month.localeCompare(b.month)),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expense summary' }, { status: 500 });
  }
} 