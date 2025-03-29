import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Scale,
  ScaleOptionsByType,
} from 'chart.js';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MonthData {
  month: string;
  total: number;
}

interface MonthlyExpensesProps {
  data: MonthData[];
  title?: string;
}

const MonthlyExpenses: React.FC<MonthlyExpensesProps> = ({
  data,
  title = 'Monthly Expenses',
}) => {
  // Format month labels (from YYYY-MM to Month YYYY)
  const formatMonthLabel = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const chartData = {
    labels: data.map((item) => formatMonthLabel(item.month)),
    datasets: [
      {
        label: 'Total Expenses',
        data: data.map((item) => item.total),
        backgroundColor: '#3b82f6', // blue-500
        borderColor: '#2563eb', // blue-600
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            if (typeof value === 'number') {
              // Remove the Rs. prefix for chart labels to avoid cluttering
              return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            return value;
          },
        },
      },
    },
  };

  if (data.length === 0) {
    return (
      <Card title={title}>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={title}>
      <div className="p-2">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default MonthlyExpenses; 