import { supabase } from './supabase';

// Data format interfacing
interface SupabaseExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

interface ClientExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Map Supabase format to client format
const mapExpenseToClientFormat = (expense: SupabaseExpense): ClientExpense => {
  return {
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
      name: 'Unknown Category' // Fallback if category not loaded
    },
    createdAt: expense.created_at,
    updatedAt: expense.updated_at
  };
};

// Exported database client to be used throughout the application
export const db = {
  // Client for direct access if needed
  supabase,
  
  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) {
      throw new Error('Failed to fetch categories');
    }
    
    return data;
  },
  
  async createCategory(data: { name: string }) {
    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({
        name: data.name,
        created_at: new Date(),
        updated_at: new Date()
      })
      .select()
      .single();
      
    if (error) {
      throw new Error('Failed to create category');
    }
    
    return newCategory;
  },
  
  // Expenses
  async getExpenses(filter?: { categoryId?: string }) {
    try {
      let query = supabase
        .from('expenses')
        .select('*, category:categories(*)')
        .order('date', { ascending: false });
        
      // Apply filters if provided
      if (filter?.categoryId) {
        query = query.eq('category_id', filter.categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error('Failed to fetch expenses');
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Transform data to client format
      const formattedData = data.map(mapExpenseToClientFormat);
      
      return formattedData;
    } catch (error) {
      throw error;
    }
  },
  
  async createExpense(data: { 
    amount: number, 
    description: string, 
    date: Date, 
    categoryId: string 
  }) {
    const { data: newExpense, error } = await supabase
      .from('expenses')
      .insert({
        amount: data.amount,
        description: data.description,
        date: data.date,
        category_id: data.categoryId,
        created_at: new Date(),
        updated_at: new Date()
      })
      .select('*, category:categories(*)')
      .single();
      
    if (error) {
      throw new Error('Failed to create expense');
    }
    
    // Transform to client format
    return mapExpenseToClientFormat(newExpense);
  }
}; 