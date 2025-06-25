// Library
import { saveItem } from '$lib/server/database/item'
import { json, type RequestHandler } from '@sveltejs/kit'

// Helpers
import { unfurl } from '$lib/server/helpers/unfurl'

// Type Definitions
import type { item } from '$lib/server/database/schema/item'
import { validItemTypes } from '$lib/server/types'

export const POST: RequestHandler = async ({ request }) => {
    const { url, title, type, content, tags } = await request.json() as typeof item.$inferInsert

    if (!url || !title || !type) {
        return new Response('Missing required fields', { status: 400 })
    }

    if (!validItemTypes.includes(type)) {
        return new Response('Invalid item type', { status: 400 })
    }

    try {
        const metadata = await unfurl(url)

        const result = await saveItem({
            url,
            title: title ?? metadata.title,
            type: metadata.type,
            content: metadata.content,
            tags,
            createdAt: new Date()
        })

        return json(result)
    } catch (e) {
        return new Response('Failed to save item', { status: 500 })
    }
}
