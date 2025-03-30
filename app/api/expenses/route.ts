import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const expenseSchema = z.object({
  amount: z.number().positive({ message: "Amount must be positive" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: "Invalid date format"
  }),
  categoryId: z.string().uuid({ message: "Invalid category ID" })
});

// GET all expenses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    
    const filter = categoryId ? { categoryId } : undefined;
    const expenses = await db.getExpenses(filter);
    
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = expenseSchema.parse(body);
    
    // Create expense with properly formatted date
    const expense = await db.createExpense({
      ...validatedData,
      date: new Date(validatedData.date)
    });
    
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
} 