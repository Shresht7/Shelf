// Library
import { defineConfig } from 'drizzle-kit'

// Check if the DATABASE_URL environment variable is set
if (!process.env.DATABASE_URL) { throw new Error('DATABASE_URL is not set') }

// Configure drizzle
export default defineConfig({
	dialect: 'sqlite',
	schema: './src/lib/server/database/schema',
	out: "./src/lib/server/db/migrations",
	dbCredentials: { url: process.env.DATABASE_URL },
	verbose: true,
	strict: true
})
