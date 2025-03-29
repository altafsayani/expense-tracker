'use client';

import React, { useEffect, useState } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ExpensesByCategory from '../../components/dashboard/ExpensesByCategory';
import MonthlyExpenses from '../../components/dashboard/MonthlyExpenses';
import { formatCurrency } from '../../utils/formatters';

interface SummaryData {
  total: number;
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

export default function ReportsPage() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'last3Months' | 'lastMonth' | 'currentMonth' | 'custom'>('currentMonth');
  
  // Default date range (current month)
  const [startDate, setStartDate] = useState(
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    format(endOfMonth(new Date()), 'yyyy-MM-dd')
  );

  const applyDateFilter = (filter: 'last3Months' | 'lastMonth' | 'currentMonth') => {
    const currentDate = new Date();
    let newStartDate = '';
    let newEndDate = '';
    
    setActiveFilter(filter);
    
    switch (filter) {
      case 'last3Months':
        newStartDate = format(startOfMonth(subMonths(currentDate, 3)), 'yyyy-MM-dd');
        newEndDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
        break;
      case 'lastMonth':
        newStartDate = format(startOfMonth(subMonths(currentDate, 1)), 'yyyy-MM-dd');
        newEndDate = format(endOfMonth(subMonths(currentDate, 1)), 'yyyy-MM-dd');
        break;
      case 'currentMonth':
        newStartDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
        newEndDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
        break;
    }
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    return { newStartDate, newEndDate };
  };

  const fetchSummaryData = async (customStartDate?: string, customEndDate?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const url = new URL('/api/expenses/summary', window.location.origin);
      url.searchParams.append('startDate', customStartDate || startDate);
      url.searchParams.append('endDate', customEndDate || endDate);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      
      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      setError('Failed to load report data. Please try again later.');
      console.error('Error fetching report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setActiveFilter('custom');
    fetchSummaryData();
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Expense Reports</h1>
        
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 mb-4">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    type="button" 
                    variant={activeFilter === 'last3Months' ? 'primary' : 'secondary'}
                    onClick={() => {
                      const { newStartDate, newEndDate } = applyDateFilter('last3Months');
                      fetchSummaryData(newStartDate, newEndDate);
                    }}
                    title="View expenses from 3 months ago to today"
                  >
                    Last 3 Months
                  </Button>
                  <Button 
                    type="button" 
                    variant={activeFilter === 'lastMonth' ? 'primary' : 'secondary'}
                    onClick={() => {
                      const { newStartDate, newEndDate } = applyDateFilter('lastMonth');
                      fetchSummaryData(newStartDate, newEndDate);
                    }}
                    title="View expenses from the previous month"
                  >
                    Last Month
                  </Button>
                  <Button 
                    type="button" 
                    variant={activeFilter === 'currentMonth' ? 'primary' : 'secondary'}
                    onClick={() => {
                      const { newStartDate, newEndDate } = applyDateFilter('currentMonth');
                      fetchSummaryData(newStartDate, newEndDate);
                    }}
                    title="View expenses from the current month"
                  >
                    Current Month
                  </Button>
                </div>
              </div>
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
              />
              <Input
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Generate Report
              </Button>
            </div>
          </form>
        </Card>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">{error}</div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : summaryData ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-700">
                Expense Summary: <span className="text-blue-800">{format(parseISO(startDate), 'MMM d, yyyy')} - {format(parseISO(endDate), 'MMM d, yyyy')}</span>
              </h2>
            </div>
            
            <Card className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700">Total Expenses</h3>
                  <p className="text-3xl font-bold text-blue-800 mt-2">
                    {formatCurrency(summaryData.total)}
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700">Average per Month</h3>
                  <p className="text-3xl font-bold text-blue-800 mt-2">
                    {formatCurrency(
                      summaryData.byMonth.length
                        ? summaryData.total / summaryData.byMonth.length
                        : 0
                    )}
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700">Top Category</h3>
                  <p className="text-3xl font-bold text-blue-800 mt-2">
                    {summaryData.byCategory.length > 0
                      ? summaryData.byCategory.sort((a, b) => b.total - a.total)[0].name
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExpensesByCategory 
                data={summaryData.byCategory} 
                title="Expenses by Category"
              />
              <MonthlyExpenses 
                data={summaryData.byMonth} 
                title="Monthly Breakdown"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-3">Select a date range and generate a report to view your expense data.</p>
            <div className="flex justify-center gap-2">
              <Button 
                type="button" 
                onClick={() => {
                  const { newStartDate, newEndDate } = applyDateFilter('currentMonth');
                  fetchSummaryData(newStartDate, newEndDate);
                }}
              >
                View Current Month
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 