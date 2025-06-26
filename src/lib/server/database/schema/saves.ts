// Library
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

// --------------
// SAVE ITEM TYPE
// --------------

const validItemTypes = ['article', 'video', 'audio', 'image', 'pdf', 'bookmark', 'generic'] as const

export const ItemTypeSchema = z.enum(validItemTypes)
export type ItemType = z.infer<typeof ItemTypeSchema>

// -----------
// SAVE SCHEMA
// -----------

export const saves = sqliteTable('saves', {

    // Unique identifier for the item
    id: integer('id').primaryKey({ autoIncrement: true }),

    // URL of the item
    url: text('url').notNull(),

    // Display title of the item
    title: text('title').notNull(),

    // The type of item
    type: text('type', { enum: validItemTypes }),

    // Full HTML/Text content
    content: text('content'),

    // Text content of the article, with all the HTML tags removed
    textContent: text('textContent'),

    // Length of the article, in characters
    length: integer('length'),

    // Article description, or short excerpt from the content
    excerpt: text('excerpt'),

    // Author metadata
    byline: text('byline'),

    // Content direction
    dir: text('dir'),

    // Name of the site
    siteName: text('siteName'),

    // Content Language
    lang: text('lang'),

    // Published time
    publishedTime: text('publishedTime'),

    // Comma-separated tags/labels
    tags: text('tags'),

    // Timestamps
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull()

});

export const savesSchema = {
    SELECT: createSelectSchema(saves),
    INSERT: createInsertSchema(saves),
    UPDATE: createUpdateSchema(saves),
}
