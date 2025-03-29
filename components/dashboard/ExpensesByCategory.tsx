import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import Card from '../ui/Card';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface CategoryData {
  id: string;
  name: string;
  total: number;
}

interface ExpensesByCategoryProps {
  data: CategoryData[];
  title?: string;
}

const ExpensesByCategory: React.FC<ExpensesByCategoryProps> = ({
  data,
  title = 'Expenses by Category',
}) => {
  // Generate chart colors
  const backgroundColors = [
    '#4f46e5', // indigo-600
    '#0891b2', // cyan-600
    '#4ade80', // green-400
    '#f97316', // orange-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#f43f5e', // rose-500
    '#facc15', // yellow-400
    '#3b82f6', // blue-500
    '#a855f7', // purple-500
  ];

  // If there's more categories than colors, cycle back
  const getColor = (index: number) => backgroundColors[index % backgroundColors.length];

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.total),
        backgroundColor: data.map((_, index) => getColor(index)),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
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
        <Doughnut data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default ExpensesByCategory; 