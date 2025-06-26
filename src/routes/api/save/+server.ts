// Library
import { saveItem } from '$lib/server/database/saves'
import { json, error, type RequestHandler } from '@sveltejs/kit'

// Helpers
import { unfurl } from '$lib/server/helpers/unfurl'
import { z } from 'zod'

// Type Definitions
import type { saves } from '$lib/server/database/schema/saves'

export const POST: RequestHandler = async ({ request }) => {
    const { url, tags } = await request.json() as typeof saves.$inferInsert

    const { success, error: e } = z.string().url('Malformed URL').safeParse(url)
    if (!success) {
        throw new Response(e.message, { status: 400 })
    }

    try {
        const metadata = await unfurl(url)
        const result = await saveItem({
            url,
            ...metadata,
            tags,
            createdAt: new Date()
        })
        return json(result)
    } catch (e) {
        return new Response('Failed to save item', { status: 500 })
    }
}
