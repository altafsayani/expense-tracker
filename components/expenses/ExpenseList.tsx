import React from 'react';
import ExpenseItem from './ExpenseItem';

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string | Date;
  category: {
    id: string;
    name: string;
  };
}

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No expenses found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ExpenseList; 