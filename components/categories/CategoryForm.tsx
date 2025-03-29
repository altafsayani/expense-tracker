import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData?: {
    id: string;
    name: string;
  };
  isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
    if (!initialData) {
      reset({ name: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="Category name"
        error={errors.name?.message}
        {...register('name')}
      />
      
      <div className="pt-2">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {initialData ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm; 