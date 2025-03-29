import React, { useState, useEffect } from 'react';
import ExpenseItem from './ExpenseItem';
import Button from '../ui/Button';
import { FiChevronLeft, FiChevronRight, FiSearch, FiFilter, FiArrowUp, FiArrowDown, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatters';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

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

interface PaginatedExpenseListProps {
  expenses: Expense[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  itemsPerPage?: number;
  compact?: boolean;
}

const PaginatedExpenseList: React.FC<PaginatedExpenseListProps> = ({ 
  expenses, 
  onEdit, 
  onDelete, 
  itemsPerPage = 10,
  compact = false
}) => {
  // Load stored filter state from localStorage
  const loadFromStorage = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(`expense-filter-${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.error('Error loading from localStorage:', e);
      return defaultValue;
    }
  };

  // Save filter state to localStorage
  const saveToStorage = (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`expense-filter-${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(loadFromStorage('searchTerm', ''));
  const [sortField, setSortField] = useState<'date' | 'amount' | 'description'>(
    loadFromStorage('sortField', 'date')
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    loadFromStorage('sortDirection', 'desc')
  );
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);
  const [startDate, setStartDate] = useState<string>(loadFromStorage('startDate', ''));
  const [endDate, setEndDate] = useState<string>(loadFromStorage('endDate', ''));
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'currentMonth' | 'lastMonth' | 'last3Months'>(
    loadFromStorage('activeQuickFilter', 'all')
  );
  const [isFilterExpanded, setIsFilterExpanded] = useState(loadFromStorage('isFilterExpanded', false));
  
  // Save filter state changes to localStorage
  useEffect(() => {
    saveToStorage('searchTerm', searchTerm);
    saveToStorage('sortField', sortField);
    saveToStorage('sortDirection', sortDirection);
    saveToStorage('startDate', startDate);
    saveToStorage('endDate', endDate);
    saveToStorage('activeQuickFilter', activeQuickFilter);
    saveToStorage('isFilterExpanded', isFilterExpanded);
  }, [searchTerm, sortField, sortDirection, startDate, endDate, activeQuickFilter, isFilterExpanded]);

  // Reset to page 1 if expenses list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [expenses.length]);

  // Filter and sort expenses whenever dependencies change
  useEffect(() => {
    let result = [...expenses];
    
    // Apply date range filter
    if (startDate || endDate) {
      setIsDateFilterActive(true);
      result = result.filter(expense => {
        const expenseDate = new Date(expense.date);
        let matchesFilter = true;
        
        if (startDate) {
          const startDateObj = new Date(startDate);
          matchesFilter = matchesFilter && expenseDate >= startDateObj;
        }
        
        if (endDate) {
          const endDateObj = new Date(endDate);
          // Set time to end of day for inclusive end date
          endDateObj.setHours(23, 59, 59, 999);
          matchesFilter = matchesFilter && expenseDate <= endDateObj;
        }
        
        return matchesFilter;
      });
    } else {
      setIsDateFilterActive(false);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(expense => 
        expense.description.toLowerCase().includes(term) || 
        expense.category.name.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else {
        // description
        const descA = a.description.toLowerCase();
        const descB = b.description.toLowerCase();
        return sortDirection === 'asc' 
          ? descA.localeCompare(descB) 
          : descB.localeCompare(descA);
      }
    });
    
    setFilteredExpenses(result);
  }, [expenses, searchTerm, sortField, sortDirection, startDate, endDate]);

  // Handle sort toggle
  const toggleSort = (field: 'date' | 'amount' | 'description') => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Apply quick date filter
  const applyQuickDateFilter = (filter: 'all' | 'currentMonth' | 'lastMonth' | 'last3Months') => {
    setActiveQuickFilter(filter);
    const currentDate = new Date();
    
    if (filter === 'all') {
      setStartDate('');
      setEndDate('');
      return;
    }
    
    let newStartDate = '';
    let newEndDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
    
    switch (filter) {
      case 'currentMonth':
        newStartDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
        newEndDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
        break;
      case 'lastMonth':
        newStartDate = format(startOfMonth(subMonths(currentDate, 1)), 'yyyy-MM-dd');
        newEndDate = format(endOfMonth(subMonths(currentDate, 1)), 'yyyy-MM-dd');
        break;
      case 'last3Months':
        newStartDate = format(startOfMonth(subMonths(currentDate, 2)), 'yyyy-MM-dd');
        break;
    }
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Reset all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setIsDateFilterActive(false);
    setActiveQuickFilter('all');
  };

  // Toggle filter visibility
  const toggleFilterVisibility = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  if (expenses.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <p className="text-gray-500 mb-3">No expenses found.</p>
        <p className="text-sm text-gray-400">Track your spending by adding your first expense.</p>
      </div>
    );
  }

  // Calculate pagination values
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate summary statistics
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Format date range for display
  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${format(new Date(startDate), 'MMM d, yyyy')} - ${format(new Date(endDate), 'MMM d, yyyy')}`;
    } else if (startDate) {
      return `From ${format(new Date(startDate), 'MMM d, yyyy')}`;
    } else if (endDate) {
      return `Until ${format(new Date(endDate), 'MMM d, yyyy')}`;
    }
    return '';
  };

  // Count active filters
  const activeFilterCount = [
    isDateFilterActive ? 1 : 0,
    searchTerm ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      {/* Filter Bar - Always Visible */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center">
            <button 
              onClick={toggleFilterVisibility}
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors mr-3"
              aria-expanded={isFilterExpanded}
              aria-controls="filter-panel"
            >
              <FiFilter className="mr-2" />
              <span className="font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2 py-0.5">
                  {activeFilterCount}
                </span>
              )}
              {isFilterExpanded ? (
                <FiChevronUp className="ml-2" />
              ) : (
                <FiChevronDown className="ml-2" />
              )}
            </button>
          </div>

          {/* Quick Search - Always Visible */}
          <div className="flex flex-1 max-w-sm ml-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                className="pl-10 pr-4 py-2 h-9 w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Always Visible Sort Buttons */}
          <div className="hidden sm:flex gap-1 ml-2">
            <Button 
              variant={sortField === 'date' ? 'primary' : 'secondary'}
              onClick={() => toggleSort('date')}
              className="flex items-center gap-1 h-9 text-xs px-2"
              title="Sort by date"
            >
              <span>Date</span>
              {sortField === 'date' && (sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />)}
            </Button>
            <Button 
              variant={sortField === 'amount' ? 'primary' : 'secondary'}
              onClick={() => toggleSort('amount')}
              className="flex items-center gap-1 h-9 text-xs px-2"
              title="Sort by amount"
            >
              <span>Amount</span>
              {sortField === 'amount' && (sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />)}
            </Button>
          </div>

          {/* Mobile-only sort button */}
          <div className="sm:hidden">
            <Button
              variant="secondary"
              onClick={() => toggleSort(sortField)}
              className="flex items-center gap-1 h-9 text-xs px-2"
            >
              <span>Sort</span>
              {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
            </Button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <div 
          id="filter-panel" 
          className={`border-t border-gray-200 transition-all duration-300 ease-in-out ${
            isFilterExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          {/* Date Range Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FiCalendar className="text-gray-500 mr-2" />
                <h3 className="font-medium">Date Range</h3>
              </div>
              <Button 
                variant="secondary" 
                onClick={clearFilters} 
                className="text-xs px-2 py-1"
                disabled={!isDateFilterActive && !searchTerm}
              >
                Clear Filters
              </Button>
            </div>
            
            {/* Quick Date Filters */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Button 
                variant={activeQuickFilter === 'all' ? 'primary' : 'secondary'}
                onClick={() => applyQuickDateFilter('all')}
                className="text-xs h-8 px-3"
              >
                All Time
              </Button>
              <Button 
                variant={activeQuickFilter === 'currentMonth' ? 'primary' : 'secondary'}
                onClick={() => applyQuickDateFilter('currentMonth')}
                className="text-xs h-8 px-3"
              >
                Current Month
              </Button>
              <Button 
                variant={activeQuickFilter === 'lastMonth' ? 'primary' : 'secondary'}
                onClick={() => applyQuickDateFilter('lastMonth')}
                className="text-xs h-8 px-3"
              >
                Last Month
              </Button>
              <Button 
                variant={activeQuickFilter === 'last3Months' ? 'primary' : 'secondary'}
                onClick={() => applyQuickDateFilter('last3Months')}
                className="text-xs h-8 px-3"
              >
                Last 3 Months
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="start-date" className="block text-xs font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  className="w-full h-9 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setActiveQuickFilter('all');
                  }}
                  max={endDate || undefined}
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-xs font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  className="w-full h-9 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setActiveQuickFilter('all');
                  }}
                  min={startDate || undefined}
                />
              </div>
            </div>
          </div>

          {/* Additional Sort Options for Mobile */}
          <div className="p-4 pt-0 sm:hidden">
            <label className="block text-xs font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex gap-2">
              <Button 
                variant={sortField === 'date' ? 'primary' : 'secondary'}
                onClick={() => toggleSort('date')}
                className="flex-1 text-xs py-1"
              >
                Date
              </Button>
              <Button 
                variant={sortField === 'amount' ? 'primary' : 'secondary'}
                onClick={() => toggleSort('amount')}
                className="flex-1 text-xs py-1"
              >
                Amount
              </Button>
              <Button
                variant={sortField === 'description' ? 'primary' : 'secondary'}
                onClick={() => toggleSort('description')}
                className="flex-1 text-xs py-1"
              >
                Name
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(isDateFilterActive || searchTerm) && (
        <div className="bg-blue-50 p-3 rounded-md mb-3 text-sm flex flex-wrap items-center gap-2">
          <span className="font-medium text-blue-800">Active filters:</span>
          
          {isDateFilterActive && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1">
              <span className="mr-1">{getDateRangeText()}</span>
            </span>
          )}
          
          {searchTerm && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1">
              <span className="mr-1">Search: "{searchTerm}"</span>
            </span>
          )}
          
          <div className="flex-grow"></div>
          
          <span className="text-sm text-blue-800">
            Showing {filteredExpenses.length} of {expenses.length} expenses
            {filteredExpenses.length > 0 && (
              <span className="ml-2 font-medium">Total: {formatCurrency(totalAmount)}</span>
            )}
          </span>
        </div>
      )}

      <div className="space-y-2">
        {currentExpenses.length > 0 ? (
          currentExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
              compact={compact}
            />
          ))
        ) : (
          <div className="p-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-500 mb-2">No matching expenses found.</p>
            {(isDateFilterActive || searchTerm) && (
              <Button variant="secondary" onClick={clearFilters} className="mt-2">
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1"
            >
              <FiChevronLeft />
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1"
            >
              <FiChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedExpenseList; 