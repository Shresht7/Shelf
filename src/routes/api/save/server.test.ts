// Library
import { POST } from './+server'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { RequestEvent } from '@sveltejs/kit'

function createMockRequest(body: object): RequestEvent {
    return {
        request: new Request('http://localhost/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
    } as unknown as RequestEvent
}

const ARTICLE_HTML = `
<html>
<head>
    <title>Test Article</title>
    <meta property="og:title" content="OG Article Title">
    <meta property="og:type" content="article">
</head>
<body>
    <article><h1>Heading</h1><p>Some content here.</p></article>
</body>
</html>
`


describe('POST /api/save', () => {

    beforeEach(() => {
        global.fetch = vi.fn()
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            text: async () => ARTICLE_HTML,
        } as any)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('saves a valid item and returns id', async () => {
        const response = await POST(
            createMockRequest({
                url: 'http://test.com',
                tags: 'example,test',
            })
        )
        expect(response.status).toBe(200)
        const data = await response.json()
        expect(data?.[0]).toHaveProperty('id')
        expect(data?.[0].url).toBe('http://test.com')
    })

})
