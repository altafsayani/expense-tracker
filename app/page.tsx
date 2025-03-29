'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ExpenseStats from '../components/dashboard/ExpenseStats';
import ExpenseForm from '../components/expenses/ExpenseForm';
import PaginatedExpenseList from '../components/expenses/PaginatedExpenseList';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { FiPlus, FiTrendingUp, FiDollarSign, FiCalendar, FiPieChart } from 'react-icons/fi';

interface SummaryData {
  total: number;
  previousMonthTotal: number;
  byCategory: {
    id: string;
    name: string;
    total: number;
  }[];
  byMonth: {
    month: string;
    total: number;
  }[];
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

export default function HomePage() {
  // Dashboard state
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Expense management state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch summary data
      const summaryResponse = await fetch('/api/expenses/summary');
      if (!summaryResponse.ok) {
        throw new Error('Failed to fetch summary data');
      }
      const summaryJsonData = await summaryResponse.json();
      
      // Add previous month total calculation if not already provided by API
      const data = {
        ...summaryJsonData,
        previousMonthTotal: summaryJsonData.previousMonthTotal || 
          (summaryJsonData.byMonth && summaryJsonData.byMonth.length > 1 
            ? summaryJsonData.byMonth[summaryJsonData.byMonth.length - 2].total 
            : 0)
      };
      
      setSummaryData(data);
      
      // Fetch all expenses
      const expensesResponse = await fetch('/api/expenses');
      if (!expensesResponse.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const expensesData = await expensesResponse.json();
      setExpenses(expensesData);
      
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Expense management functions
  const handleAddExpense = async (data: any) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add expense');
      }
      
      await fetchData();
      setIsAddModalOpen(false);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      console.error('Error adding expense:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditExpense = async (data: any) => {
    if (!currentExpense) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/expenses/${currentExpense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update expense');
      }
      
      await fetchData();
      setIsEditModalOpen(false);
    } catch (err) {
      setError('Failed to update expense. Please try again.');
      console.error('Error updating expense:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!currentExpense) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/expenses/${currentExpense.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
      
      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
      console.error('Error deleting expense:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (id: string) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      setCurrentExpense(expense);
      setIsEditModalOpen(true);
    }
  };

  const openDeleteModal = (id: string) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      setCurrentExpense(expense);
      setIsDeleteModalOpen(true);
    }
  };

  const calculatePercentChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number(((current - previous) / previous * 100).toFixed(1));
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Expense Tracker</h1>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <FiPlus className="mr-1" />
            Add Expense
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
          <div className="space-y-6">
            {/* Dashboard Summary Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryData && (
                  <>
                    <ExpenseStats 
                      totalAmount={summaryData.byMonth.length > 0
                        ? summaryData.byMonth[summaryData.byMonth.length - 1].total
                        : 0}
                      title="Current Month" 
                      bgColor="bg-blue-50"
                      icon="money"
                      percentChange={calculatePercentChange(
                        summaryData.byMonth.length > 0 ? summaryData.byMonth[summaryData.byMonth.length - 1].total : 0,
                        summaryData.previousMonthTotal
                      )}
                    />
                    <ExpenseStats
                      totalAmount={summaryData.previousMonthTotal}
                      title="Previous Month"
                      bgColor="bg-purple-50"
                      icon="calendar"
                    />
                    {summaryData.byCategory && summaryData.byCategory.length > 0 && (
                      <ExpenseStats
                        totalAmount={summaryData.byCategory[0].name}
                        title="Top Category"
                        isMonetary={false}
                        bgColor="bg-amber-50"
                        customIcon={<FiPieChart className="h-6 w-6" />}
                      />
                    )}
                    <ExpenseStats
                      totalAmount={summaryData.total}
                      title="Total Expenses"
                      bgColor="bg-green-50"
                      customIcon={<FiTrendingUp className="h-6 w-6" />}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Expenses Section */}
            <Card title="Expenses">
              <div>
                {expenses.length > 0 ? (
                  <PaginatedExpenseList
                    expenses={expenses}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    compact={false}
                  />
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No expenses yet. Add some to see them here!</p>
                    <Button
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-4"
                    >
                      Add Your First Expense
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Expense"
      >
        <ExpenseForm
          onSubmit={handleAddExpense}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Expense"
      >
        {currentExpense && (
          <ExpenseForm
            onSubmit={handleEditExpense}
            initialData={{
              id: currentExpense.id,
              amount: currentExpense.amount,
              description: currentExpense.description,
              date: new Date(currentExpense.date),
              categoryId: currentExpense.categoryId,
            }}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Expense"
      >
        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteExpense}
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
