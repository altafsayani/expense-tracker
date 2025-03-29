# Deploying to Vercel with Turso

This document explains how to deploy the House Expense Tracker app to Vercel while using Turso for the database.

## Overview

- Local development: Uses SQLite via Prisma
- Production (Vercel): Uses Turso DB

## Prerequisites

1. A Turso account and CLI installed
2. A Vercel account
3. Your app code pushed to a Git repository

## Setup Steps

### 1. Local Development

The app uses SQLite locally through Prisma. The database file is located at `prisma/dev.db`.

### 2. Turso Setup

1. Create a Turso database:
   ```
   turso db create expense-tracker
   ```

2. Get your database URL and authentication token:
   ```
   turso db show expense-tracker --url
   turso db tokens create expense-tracker
   ```

3. Add these credentials to your `.env` file:
   ```
   TURSO_DATABASE_URL="libsql://your-db-url-here"
   TURSO_AUTH_TOKEN="your-token-here"
   ```

### 3. Migrate Data to Turso

Run the migration script to transfer your local data to Turso:
```
npm run migrate-to-turso
```

This script:
- Creates the necessary tables in Turso
- Transfers all categories and expenses from your local SQLite database
- Preserves all relationships

### 4. Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Create a new project on Vercel and link your repository

3. Add the following environment variables in Vercel's project settings:
   - `DATABASE_URL`: `file:./dev.db` (needed for Prisma)
   - `TURSO_DATABASE_URL`: Your Turso database URL
   - `TURSO_AUTH_TOKEN`: Your Turso authentication token
   - `NODE_ENV`: `production`

4. Deploy your project

## How It Works

The app detects whether it's running in development or production mode:

- In development (local), it uses Prisma with SQLite
- In production (Vercel), it uses Turso via `@libsql/client`

The switch happens in the `lib/services/dataService.ts` file, which checks the 
`NODE_ENV` environment variable to determine which database client to use.

## Troubleshooting

- If you see database connection errors in Vercel, verify your Turso credentials are correctly set in Vercel's environment variables.
- If you need to rerun migration, you might need to drop the existing tables in Turso first.
- For local development issues, ensure your SQLite database is set up correctly with `prisma migrate dev`. 