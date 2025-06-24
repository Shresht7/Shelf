// Library
import { saveItem } from '$lib/server/database/item'
import type { item } from '$lib/server/database/schema/item'
import { json, type RequestHandler } from '@sveltejs/kit'

const validTypes = ['article', 'video', 'audio', 'image', 'pdf', 'bookmark', 'generic']

export const POST: RequestHandler = async ({ request }) => {
    const { url, title, type, content, tags } = await request.json() as typeof item.$inferInsert

    if (!url || !title || !type) {
        return new Response('Missing required fields', { status: 400 })
    }

    if (!validTypes.includes(type)) {
        return new Response('Invalid item type', { status: 400 })
    }

    try {
        const result = await saveItem({
            url,
            title,
            type,
            content,
            tags,
            createdAt: new Date()
        })
        return json(result)
    } catch (e) {
        return new Response('Failed to save item', { status: 500 })
    }
}
