// Library
import { getAllItems } from '$lib/server/database/saves'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ request }) => {
    try {
        const items = await getAllItems()
        return json(items)
    } catch (e) {
        return new Response('Failed to get all items', { status: 500 })
    }
}
