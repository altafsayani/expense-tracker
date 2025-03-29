import React from 'react';
import { format } from 'date-fns';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatters';

interface ExpenseItemProps {
  expense: {
    id: string;
    amount: number;
    description: string;
    date: string | Date;
    category: {
      id: string;
      name: string;
    };
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ 
  expense, 
  onEdit, 
  onDelete,
  compact = false
}) => {
  const formattedDate = format(new Date(expense.date), 'MMM d, yyyy');
  
  if (compact) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base truncate">{expense.description}</h3>
            <div className="text-xs text-gray-500 flex items-center">
              <span>{formattedDate}</span>
              <span className="mx-1.5">•</span>
              <span className="truncate">{expense.category.name}</span>
            </div>
          </div>
          <div className="ml-4 font-semibold text-base whitespace-nowrap">
            {formatCurrency(expense.amount)}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{expense.description}</h3>
          <div className="text-sm text-gray-500">
            {formattedDate} • {expense.category.name}
          </div>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-lg mr-4">
            {formatCurrency(expense.amount)}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(expense.id)}
              className="text-blue-800 hover:text-blue-900 transition-colors"
              aria-label="Edit expense"
            >
              <FiEdit size={18} />
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Delete expense"
            >
              <FiTrash size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem; 