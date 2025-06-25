// TYPE DEFINITIONS

export const validItemTypes = ['article', 'video', 'audio', 'image', 'pdf', 'bookmark', 'generic'] as const

export type ItemType = typeof validItemTypes[number]
