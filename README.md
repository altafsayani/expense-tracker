# House Expense Tracker

A web application for tracking household expenses. Keep track of daily grocery bills, utility payments, and other expenses, and view reports to understand your spending habits.

## Features

- **Expense Tracking**: Record and manage expenses with details like amount, description, date, and category
- **Category Management**: Create and manage expense categories
- **Reports and Charts**: View visual representations of your expenses by category and month
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM 6.5
- **Styling**: TailwindCSS
- **Forms**: React Hook Form 7.55 with Zod 3.24 validation
- **Charts**: Chart.js 4.4 with react-chartjs-2 5.3
- **Date Handling**: date-fns 4.1
- **Icons**: React Icons 5.5

## Getting Started

### Prerequisites

- Node.js 20.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/house-expense-tracker.git
cd house-expense-tracker
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Initialize the database
```bash
npx prisma migrate dev
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Dashboard**: View a summary of your expenses, including total spent and charts
- **Expenses**: Add, edit, and delete expense entries
- **Categories**: Manage expense categories
- **Reports**: Generate reports for specific date ranges

## Project Structure

```
house-expense-tracker/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   ├── categories/           # Categories page
│   ├── expenses/             # Expenses page
│   ├── reports/              # Reports page
│   └── page.tsx              # Dashboard page
├── components/               # React components
│   ├── categories/           # Category-related components
│   ├── dashboard/            # Dashboard-related components
│   ├── expenses/             # Expense-related components
│   ├── ui/                   # Reusable UI components
│   └── Layout.tsx            # Main layout component
├── lib/                      # Utility functions
│   └── prisma.ts             # Prisma client
├── prisma/                   # Prisma ORM
│   └── schema.prisma         # Database schema
├── utils/                    # Additional utility functions
│   └── formatters.ts         # Formatting utilities
└── public/                   # Static assets
```

## License

This project is open source and available under the [MIT License](LICENSE).
