import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';

// Add globalThis type extension
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var libsql: ReturnType<typeof createClient> | undefined;
}

// Use Prisma with SQLite for local development
export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Create Turso client for production
export function getTursoClient() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    throw new Error('Turso credentials not found in environment variables');
  }

  if (!globalThis.libsql) {
    globalThis.libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  return globalThis.libsql;
}

// Function to determine which database client to use
export function getDb() {
  if (process.env.NODE_ENV === 'production') {
    return getTursoClient();
  }
  return prisma;
} 