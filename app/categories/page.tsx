'use client';

import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Layout from '../../components/Layout';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import CategoryForm from '../../components/categories/CategoryForm';
import CategoryList from '../../components/categories/CategoryList';

interface Category {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories. Please try again later.');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (data: any) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      
      await fetchCategories();
      setIsAddModalOpen(false);
    } catch (err) {
      setError('Failed to add category. Please try again.');
      console.error('Error adding category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async (data: any) => {
    if (!currentCategory) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/categories/${currentCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      await fetchCategories();
      setIsEditModalOpen(false);
    } catch (err) {
      setError('Failed to update category. Please try again.');
      console.error('Error updating category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!currentCategory) return;
    
    try {
      setIsSubmitting(true);
      setDeleteError(null);
      
      const response = await fetch(`/api/categories/${currentCategory.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 400 && data.error) {
          setDeleteError(data.error);
          return;
        }
        throw new Error('Failed to delete category');
      }
      
      await fetchCategories();
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('Failed to delete category. Please try again.');
      console.error('Error deleting category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setCurrentCategory(category);
      setIsEditModalOpen(true);
    }
  };

  const openDeleteModal = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setCurrentCategory(category);
      setDeleteError(null);
      setIsDeleteModalOpen(true);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <FiPlus className="mr-1" />
            Add Category
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">{error}</div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <CategoryList
            categories={categories}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
      >
        <CategoryForm
          onSubmit={handleAddCategory}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
      >
        {currentCategory && (
          <CategoryForm
            onSubmit={handleEditCategory}
            initialData={currentCategory}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
      >
        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
          
          {deleteError && (
            <div className="bg-red-50 p-3 rounded-md text-red-700 mb-4">
              {deleteError}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCategory}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
} 