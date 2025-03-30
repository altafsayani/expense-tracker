# House Expense Tracker

A Next.js application for tracking household expenses.

## Features

- Add, edit, and delete expense categories
- Add, edit, and delete expenses
- View expense reports and summaries
- Filter expenses by category and date

## Tech Stack

- **Frontend**: Next.js 15.2, React 19, TypeScript
- **UI**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Form Handling**: React Hook Form with Zod validation
- **Charting**: Chart.js with react-chartjs-2

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/house-expense-tracker.git
cd house-expense-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```
# Supabase  
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
house-expense-tracker/
├── app/                      # Next.js app router
│   ├── api/                  # API routes
│   ├── categories/           # Categories pages
│   ├── expenses/             # Expenses pages
│   ├── reports/              # Reports pages
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── categories/           # Category components
│   ├── dashboard/            # Dashboard components
│   └── expenses/             # Expense components
├── lib/                      # Library code
│   ├── db.ts                 # Database utilities
│   └── supabase.ts           # Supabase client
├── public/                   # Static assets
├── utils/                    # Utility functions
├── .env                      # Environment variables
└── next.config.mjs           # Next.js configuration
```

## Deployment

The application can be deployed to Vercel:

1. Push your code to a GitHub repository
2. Import your repository to Vercel
3. Set up your environment variables
4. Deploy

## License

This project is licensed under the MIT License.
