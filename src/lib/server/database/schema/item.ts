// Library
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// -----------
// ITEM SCHEMA
// -----------

export const item = sqliteTable('item', {

    // Unique identifier for the item
    id: integer('id').primaryKey({ autoIncrement: true }),

    // URL of the item
    url: text('url').notNull(),

    // Display title of the item
    title: text('title').notNull(),

    // Full HTML/Text content
    content: text('content'),

    // The type of item
    type: text('type', { enum: ['article', 'video', 'audio', 'image', 'pdf', 'bookmark', 'generic'] }),

    // Comma-separated tags/labels
    tags: text('tags'),

    // Timestamps
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull()

});
