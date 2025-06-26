import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { saves } from "$lib/server/database/schema/saves";

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('/api/saves')
    if (!response.ok) {
        return error(500, 'Failed to fetch resource')
    }

    const data = await response.json() as typeof saves.$inferSelect[]

    return {
        saves: data
    }
}
