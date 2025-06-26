// Library
import { JSDOM } from 'jsdom'
import { isProbablyReaderable, Readability } from '@mozilla/readability'

// Type Definitions
import type { ItemType } from '../../server/database/schema/saves'

type URLMetadata = {
    /** Title of the article */
    title: string,
    /** The type of the article */
    type: ItemType,
    /** HTML string of the processed article content */
    content?: string,
    /** Text Content of the article, with all the HTML tags removed */
    textContent?: string,
    /** Length of an article, in characters */
    length?: number,
    /** Article description, or short excerpt from the content */
    excerpt?: string,
    /** Author metadata */
    byline?: string,
    /** Content direction */
    dir?: string,
    /** Name of the site */
    siteName?: string,
    /** Content language */
    lang?: string,
    /** Published time */
    publishedTime?: string,
    /** Thumbnail image */
    image?: string,
}

/**
 * Unfurls the URL and extracts all the relevant metadata
 * @param url The URL of the resource to parse
 * @returns The parsed and extracted metadata from the URL resource
 * @throws If the fetch response is not ok
 */
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
    const title =
        readability?.title ||
        dom.getMeta('og:title') ||
        dom.document.title ||
        url

    // TODO: Sanitize the content and use CSP. See https://github.com/mozilla/readability?tab=readme-ov-file#security

    const content = readability?.content ?? undefined
    const textContent = readability?.textContent ?? dom.document.body?.textContent ?? undefined
    const length = readability?.length ?? textContent?.length ?? 0
    const excerpt =
        readability?.excerpt ||
        dom.getMeta('description') ||
        dom.getMeta('og:description') ||
        undefined
    const byline =
        readability?.byline ||
        dom.getMeta('author') ||
        dom.getMeta('article:author') ||
        undefined
    const dir = readability?.dir ?? undefined
    const siteName =
        readability?.siteName ||
        dom.getMeta('og:site_name') ||
        dom.document.location.hostname
    const lang =
        readability?.lang ||
        dom.document.documentElement.lang ||
        undefined
    const publishedTime =
        readability?.publishedTime ||
        dom.getMeta('article:published_time') ||
        dom.getMeta('og:published_time') ||
        undefined
    const image =
        dom.getMeta('og:image') ||
        dom.getMeta('twitter:image') ||
        undefined

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
        type,
        content,
        textContent,
        length,
        excerpt,
        byline,
        dir,
        siteName,
        lang,
        publishedTime,
        image,
    }
}

// -------
// HELPERS
// -------

/** Extends the JSDOM class with some helpers */
class DOM extends JSDOM {
    constructor(html: string, url: string) {
        super(html, { url })
    }

    get document() {
        return this.window.document
    }

    /** @return The content value of the given property's meta tag */
    getMeta(property: string) {
        return this.window.document.querySelector(`meta[property="${property}"]`)?.getAttribute('content') ??
            this.window.document.querySelector(`meta[name="${property}"]`)?.getAttribute('content')
    }
}
