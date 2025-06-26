// Library
import { JSDOM } from 'jsdom'
import { isProbablyReaderable, Readability } from '@mozilla/readability'

// Type Definitions
import type { ItemType } from '../../server/database/schema/saves'

type URLMetadata = {
    title: string,
    content?: string,
    type: ItemType,
}

export async function unfurl(url: string): Promise<URLMetadata> {
    // Fetch the URL resource
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
    }

    // Parse the response text as html
    //? This needn't be html all the time, so maybe check content-type for text/html?
    const html = await response.text()

    // Create the Document-Object-Model so that we can start querying the html contents
    const dom = new DOM(html, url) // Important: Set url for relative paths

    // Try to read the page using Mozilla Readability
    let readability: ReturnType<Readability["parse"]> | undefined
    if (isProbablyReaderable(dom.document)) {
        readability = new Readability(dom.document).parse()
    }

    // Extract metadata like title and social image from open-graph tags / html
    const title = readability?.title || dom.getMeta('og:title') || dom.document.title || url
    const image = dom.getMeta('og:image') ?? dom.getMeta('twitter:image')
    const content = readability?.content || dom.document?.textContent || undefined

    // TODO: Readability returns quite a bit of information like lang, textContent, length, excerpt, siteName, publishedTime. Use them. See See https://github.com/mozilla/readability?tab=readme-ov-file#parse
    // TODO: Sanitize the content and use CSP. See https://github.com/mozilla/readability?tab=readme-ov-file#security

    // Determine the content type
    //? Again, maybe content-type or mime-type would be a better indicator?
    const ogType = dom.getMeta('og:type') ?? dom.getMeta('medium') ?? ''
    let type: ItemType = 'bookmark'
    if (ogType.includes('video')) { type = 'video' }
    else if (ogType.includes('audio')) { type = 'audio' }
    else if (ogType.includes('image')) { type = 'image' }
    else if (ogType.includes('pdf')) { type = 'pdf' }
    else { type = 'article' }

    return {
        title,
        content,
        type
    }
}

class DOM extends JSDOM {
    constructor(html: string, url: string) {
        super(html, { url })
    }

    get document() {
        return this.window.document
    }

    getMeta(prop: string) {
        return this.window.document.querySelector(`meta[property="${prop}"]`)?.getAttribute('content') ??
            this.window.document.querySelector(`meta[name="${prop}"]`)?.getAttribute('content')
    }
}
