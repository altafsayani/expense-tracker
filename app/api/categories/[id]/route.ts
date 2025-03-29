import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { expenses: true },
    });
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT (update) a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if category has any expenses
    const categoryWithExpenses = await prisma.category.findUnique({
      where: { id },
      include: { expenses: { select: { id: true }, take: 1 } },
    });
    
    if (!categoryWithExpenses) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    if (categoryWithExpenses.expenses.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with expenses' },
        { status: 400 }
      );
    }
    
    await prisma.category.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
} 