// Database
import { db } from '.'
import { saves } from './schema/saves'
import { eq } from 'drizzle-orm'

/**
 * Saves the given item to the database
 * @param i The item to save to the database
 * @returns The id of the saved item
 */
export async function saveItem(i: typeof saves.$inferInsert) {
    return db.insert(saves)
        .values(i)
        .returning()
}

/**
 * Returns a collection of all items from the database
 * @returns All items from the database
 */
export async function getAllItems() {
    return db.select().from(saves).all()
}

/**
 * Retrieves a specific item from the database corresponding to the given ID
 * @param id The unique identifier of the item
 * @returns The corresponding item
 */
export async function getItemById(id: number) {
    return db.select().from(saves)
        .where(eq(saves.id, id))
        .get()
}
