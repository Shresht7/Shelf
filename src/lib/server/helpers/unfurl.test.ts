// Library
import { unfurl } from './unfurl'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const ARTICLE_HTML = `
<html lang="en">
<head>
    <title>Test Article</title>
    <meta property="og:title" content="OG Article Title">
    <meta property="og:type" content="article">
    <meta property="description" content="A test article for unfurling.">
    <meta property="author" content="Jane Doe">
    <meta property="og:site_name" content="Test Site">
    <meta property="article:published_time" content="2025-06-26T12:00:00Z">
    <meta property="og:image" content="https://example.com/image.jpg">
</head>
<body>
    <article><h1>Heading</h1><p>Some content here.</p></article>
</body>
</html>
`

const VIDEO_HTML = `
<html lang="fr">
<head>
    <meta property="og:title" content="OG Video Title">
    <meta property="og:type" content="video">
    <meta property="og:description" content="A test video for unfurling.">
    <meta property="article:author" content="John Smith">
    <meta property="og:site_name" content="Video Site">
    <meta property="og:published_time" content="2025-06-25T10:00:00Z">
    <meta property="twitter:image" content="https://example.com/video.jpg">
</head>
<body>Video Content</body>
</html>
`

const NO_OG_HTML = `
<html>
<head>
    <title>No OG</title>
</head>
<body>Just a page</body>
</html>
`

describe('unfurl', () => {

    beforeEach(() => {
        global.fetch = vi.fn()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('extracts metadata and content from an article page', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            text: async () => ARTICLE_HTML,
        } as any)

        const result = await unfurl('https://example.com/article')
        expect(result.title).toBe('OG Article Title')
        expect(result.type).toBe('article')
        if (result.content) {
            expect(result.content).toContain('<h1>Heading</h1><p>Some content here.</p>')
        }
        expect(result.textContent).toContain('Some content here')
        expect(result.length).toBeGreaterThan(0)
        expect(result.excerpt).toBe('A test article for unfurling.')
        expect(result.byline).toBe('Jane Doe')
        expect(result.dir).toBeUndefined()
        expect(result.siteName).toBe('Test Site')
        expect(result.lang).toBe('en')
        expect(result.publishedTime).toBe('2025-06-26T12:00:00Z')
        expect(result.image).toBe('https://example.com/image.jpg')
    })

    it('extracts metadata for a video type', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            text: async () => VIDEO_HTML,
        } as any)

        const result = await unfurl('https://example.com/video')
        expect(result.title).toBe('OG Video Title')
        expect(result.type).toBe('video')
        expect(result.content).toBeUndefined()
        expect(result.textContent).toContain('Video Content')
        expect(result.length).toBeGreaterThan(0)
        expect(result.excerpt).toBe('A test video for unfurling.')
        expect(result.byline).toBe('John Smith')
        expect(result.dir).toBeUndefined()
        expect(result.siteName).toBe('Video Site')
        expect(result.lang).toBe('fr')
        expect(result.publishedTime).toBe('2025-06-25T10:00:00Z')
        expect(result.image).toBe('https://example.com/video.jpg')
    })

    it('falls back to document title if no og:title', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            text: async () => NO_OG_HTML,
        } as any)

        const result = await unfurl('https://example.com/no-og')
        expect(result.title).toBe('No OG')
        expect(result.type).toBe('article')
    })

    it('throws on fetch error', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        } as any)

        await expect(unfurl('https://example.com/404')).rejects.toThrow('Failed to fetch')
    })
})
