import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validate category ID
const idSchema = z.string().uuid({ message: "Invalid category ID format" });

// Validate category update data
const categoryUpdateSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

// GET a specific category
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    idSchema.parse(id);
    
    // Use Supabase directly instead of Prisma
    const { data, error } = await db.supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT (update) a category
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    idSchema.parse(id);
    
    const body = await req.json();
    const validatedData = categoryUpdateSchema.parse(body);
    
    // Use Supabase directly
    const { data, error } = await db.supabase
      .from('categories')
      .update({
        name: validatedData.name,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to update category" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE a category
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    idSchema.parse(id);
    
    // First check if there are any expenses with this category
    const { data: expenses, error: expenseError } = await db.supabase
      .from('expenses')
      .select('id')
      .eq('category_id', id)
      .limit(1);
    
    if (expenseError) {
      return NextResponse.json(
        { error: "Failed to check related expenses" },
        { status: 500 }
      );
    }
    
    if (expenses && expenses.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with associated expenses" },
        { status: 400 }
      );
    }
    
    // Delete the category
    const { error } = await db.supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json(
        { error: "Failed to delete category" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
} 