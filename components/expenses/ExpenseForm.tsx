import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const expenseSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  categoryId: z.string().min(1, 'Category is required'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface Category {
  id: string;
  name: string;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  initialData?: {
    id: string;
    amount: number;
    description: string;
    date: Date;
    categoryId: string;
  };
  isLoading?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData
      ? {
          amount: initialData.amount.toString(),
          description: initialData.description,
          date: format(new Date(initialData.date), 'yyyy-MM-dd'),
          categoryId: initialData.categoryId,
        }
      : {
          date: format(new Date(), 'yyyy-MM-dd'),
        },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFormSubmit = async (data: ExpenseFormData) => {
    await onSubmit(data);
    if (!initialData) {
      reset({
        amount: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        categoryId: '',
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setValue('categoryId', value, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register('amount')}
      />
      
      <Input
        label="Description"
        placeholder="What was this expense for?"
        error={errors.description?.message}
        {...register('description')}
      />
      
      <Input
        label="Date"
        type="date"
        error={errors.date?.message}
        {...register('date')}
      />
      
      <Select
        label="Category"
        options={categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))}
        value={initialData?.categoryId || ''}
        onChange={handleCategoryChange}
        error={errors.categoryId?.message}
      />
      
      <div className="pt-2">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {initialData ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm; 