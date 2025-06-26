import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('/api/saves')
    if (!response.ok) {
        return error(500, 'Failed to fetch resource')
    }

    const saves = await response.json() as { url: string }[]

    return {
        saves
    }
}
