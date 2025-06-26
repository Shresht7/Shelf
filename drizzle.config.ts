// Library
import { defineConfig } from 'drizzle-kit'

import env from './src/lib/server/helpers/env'

// Configure drizzle
export default defineConfig({
	dialect: 'sqlite',
	schema: './src/lib/server/database/schema',
	out: "./src/lib/server/db/migrations",
	dbCredentials: { url: env.DATABASE_URL },
	verbose: true,
	strict: true
})
