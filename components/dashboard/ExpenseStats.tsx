import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { FiArrowUp, FiArrowDown, FiDollarSign, FiCalendar } from 'react-icons/fi';

interface ExpenseStatsProps {
  totalAmount: number | string;
  title?: string;
  isMonetary?: boolean;
  percentChange?: number;
  icon?: 'money' | 'calendar' | 'custom';
  customIcon?: React.ReactNode;
  bgColor?: string;
}

const ExpenseStats: React.FC<ExpenseStatsProps> = ({
  totalAmount,
  title = 'Total Expenses',
  isMonetary = true,
  percentChange,
  icon = 'money',
  customIcon,
  bgColor = 'bg-blue-50',
}) => {
  const displayAmount = isMonetary 
    ? (typeof totalAmount === 'number' ? formatCurrency(totalAmount) : totalAmount)
    : totalAmount;
    
  const getIcon = () => {
    if (customIcon) return customIcon;
    switch (icon) {
      case 'money': return <FiDollarSign className="h-6 w-6" />;
      case 'calendar': return <FiCalendar className="h-6 w-6" />;
      default: return <FiDollarSign className="h-6 w-6" />;
    }
  };
  
  return (
    <div className={`${bgColor} rounded-lg p-4 shadow-sm flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xl font-bold text-gray-800 mt-1">{displayAmount}</p>
        {percentChange !== undefined && (
          <div className="flex items-center mt-1">
            {percentChange > 0 ? (
              <FiArrowUp className="text-red-500 h-4 w-4 mr-1" />
            ) : percentChange < 0 ? (
              <FiArrowDown className="text-green-500 h-4 w-4 mr-1" />
            ) : null}
            <span className={`text-xs font-medium ${
              percentChange > 0 ? 'text-red-500' : 
              percentChange < 0 ? 'text-green-500' : 'text-gray-500'
            }`}>
              {Math.abs(percentChange)}% {percentChange > 0 ? 'increase' : percentChange < 0 ? 'decrease' : 'no change'}
            </span>
          </div>
        )}
      </div>
      <div className={`rounded-full w-10 h-10 flex items-center justify-center ${
        bgColor === 'bg-blue-50' ? 'bg-blue-100 text-blue-800' : 
        bgColor === 'bg-green-50' ? 'bg-green-100 text-green-600' : 
        bgColor === 'bg-purple-50' ? 'bg-purple-100 text-purple-600' : 
        bgColor === 'bg-amber-50' ? 'bg-amber-100 text-amber-600' : 
        'bg-blue-100 text-blue-800'
      }`}>
        {getIcon()}
      </div>
    </div>
  );
};

export default ExpenseStats; 