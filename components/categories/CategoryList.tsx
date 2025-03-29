import React from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  if (categories.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No categories found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {categories.map((category) => (
          <li key={category.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="font-medium">{category.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(category.id)}
                  className="text-blue-800 hover:text-blue-900 transition-colors"
                  aria-label={`Edit ${category.name}`}
                >
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label={`Delete ${category.name}`}
                >
                  <FiTrash size={18} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList; 