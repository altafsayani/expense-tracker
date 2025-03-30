import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

// GET all categories
export async function GET() {
  try {
    const categories = await db.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = categorySchema.parse(body);
    
    const category = await db.createCategory(validatedData);
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
} 