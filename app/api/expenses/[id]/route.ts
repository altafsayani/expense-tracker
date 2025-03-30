import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET a specific expense
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data: expense, error } = await db.supabase
      .from('expenses')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();
    
    if (error || !expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    
    // Transform to client format
    const clientExpense = {
      id: expense.id,
      amount: Number(expense.amount),
      description: expense.description,
      date: expense.date,
      categoryId: expense.category_id,
      category: expense.category ? {
        id: expense.category.id,
        name: expense.category.name
      } : {
        id: expense.category_id,
        name: 'Unknown Category'
      },
      createdAt: expense.created_at,
      updatedAt: expense.updated_at
    };
    
    return NextResponse.json(clientExpense);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expense' }, { status: 500 });
  }
}

// PUT (update) an expense
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { amount, description, date, categoryId } = await req.json();
    
    if (!amount || !description || !date || !categoryId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Validate category exists
    const { data: category, error: categoryError } = await db.supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();
    
    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }
    
    const { data: expense, error } = await db.supabase
      .from('expenses')
      .update({
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        category_id: categoryId,
        updated_at: new Date()
      })
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();
    
    if (error || !expense) {
      return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
    }
    
    // Transform to client format
    const clientExpense = {
      id: expense.id,
      amount: Number(expense.amount),
      description: expense.description,
      date: expense.date,
      categoryId: expense.category_id,
      category: expense.category ? {
        id: expense.category.id,
        name: expense.category.name
      } : {
        id: expense.category_id,
        name: 'Unknown Category'
      },
      createdAt: expense.created_at,
      updatedAt: expense.updated_at
    };
    
    return NextResponse.json(clientExpense);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

// DELETE an expense
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { error } = await db.supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
} 