// Library
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { env } from '$env/dynamic/private'

// Ensure that DATABASE_URL environment variable is set
if (!env.DATABASE_URL) { throw new Error('DATABASE_URL is not set') }

// Setup and export the database client
const client = new Database(env.DATABASE_URL)
export const db = drizzle({ client })
