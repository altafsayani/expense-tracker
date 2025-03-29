import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    } else if (startDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
        },
      };
    } else if (endDate) {
      dateFilter = {
        date: {
          lte: new Date(endDate),
        },
      };
    }
    
    // Total expenses in the date range
    const totalExpenses = await prisma.expense.aggregate({
      where: dateFilter,
      _sum: {
        amount: true,
      },
    });
    
    // Expenses by category
    const expensesByCategory = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        expenses: {
          where: dateFilter,
          select: {
            amount: true,
          },
        },
      },
    });
    
    const categoryData = expensesByCategory.map(category => ({
      id: category.id,
      name: category.name,
      total: category.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    }));
    
    // Monthly expenses (for the last 6 months if no date range specified)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyFilter = {
      ...dateFilter,
      date: {
        ...(dateFilter as any).date,
        gte: (dateFilter as any).date?.gte || sixMonthsAgo,
      },
    };
    
    const expenses = await prisma.expense.findMany({
      where: monthlyFilter,
      select: {
        amount: true,
        date: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
    
    // Group expenses by month
    const monthlyData: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyData[monthYear]) {
        monthlyData[monthYear] += expense.amount;
      } else {
        monthlyData[monthYear] = expense.amount;
      }
    });
    
    return NextResponse.json({
      total: totalExpenses._sum.amount || 0,
      byCategory: categoryData,
      byMonth: Object.keys(monthlyData).map(month => ({
        month,
        total: monthlyData[month],
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expense summary' }, { status: 500 });
  }
} 