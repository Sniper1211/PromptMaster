/**
 * Client helpers for the build-time static prompt data.
 *
 * Public pages read /data/*.json from the CDN (no database call). In local dev the files do not
 * exist unless you ran the build, so every helper resolves to null and callers fall back to the API.
 */
import { Prompt, Category } from '../types';

export interface StaticIndexEntry {
    id: string;
    createdAt?: string;
    titleZh?: string;
    titleEn?: string;
    descriptionZh?: string;
    descriptionEn?: string;
    category: string;
    tags?: string[];
    previewImageUrl?: string;
    copyCount?: number;
    promptType?: 'text' | 'video';
    sourceLink?: string;
    authorName?: string;
    videoThumbnailUrl?: string;
}

export interface StaticDetailEntry extends StaticIndexEntry {
    content?: string;
    chineseContent?: string;
    expectedOutput?: string;
    usage?: string;
}

const fetchJson = async <T>(url: string): Promise<T | null> => {
    try {
        const response = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!response.ok) return null;
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('json')) return null;
        return (await response.json()) as T;
    } catch {
        return null;
    }
};

let indexPromise: Promise<StaticIndexEntry[] | null> | null = null;

export const fetchStaticIndex = (): Promise<StaticIndexEntry[] | null> => {
    if (!indexPromise) {
        indexPromise = fetchJson<StaticIndexEntry[]>('/data/index.json').then((data) => (Array.isArray(data) ? data : null));
    }
    return indexPromise;
};

export const fetchStaticDetail = (id: string): Promise<StaticDetailEntry | null> =>
    fetchJson<StaticDetailEntry>(`/data/prompts/${encodeURIComponent(id)}.json`);

export const fetchStaticCategories = (): Promise<{ counts: Record<string, number>; videoPromptCount?: number; total?: number } | null> =>
    fetchJson('/data/categories.json');

export const isChinese = (language?: string) => Boolean(language && language.startsWith('zh'));

export const localizedTitle = (entry: StaticIndexEntry, language?: string): string =>
    isChinese(language) ? (entry.titleZh || entry.titleEn || '') : (entry.titleEn || entry.titleZh || '');

export const localizedDescription = (entry: StaticIndexEntry, language?: string): string =>
    isChinese(language) ? (entry.descriptionZh || entry.descriptionEn || '') : (entry.descriptionEn || entry.descriptionZh || '');

export const mapStaticToListPrompt = (entry: StaticIndexEntry, language?: string): Prompt => ({
    id: String(entry.id),
    title: localizedTitle(entry, language),
    description: localizedDescription(entry, language),
    content: '',
    expectedOutput: '',
    category: entry.category as Category,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    previewImageUrl: entry.previewImageUrl || undefined,
    copyCount: entry.copyCount ?? 0,
    createdAt: entry.createdAt,
    promptType: entry.promptType || 'text',
    sourceLink: entry.sourceLink || undefined,
    authorName: entry.authorName || undefined,
    videoThumbnailUrl: entry.videoThumbnailUrl || undefined
});

export const mapStaticToDetailPrompt = (entry: StaticDetailEntry, language?: string): Prompt => ({
    ...mapStaticToListPrompt(entry, language),
    content: entry.content || '',
    chineseContent: entry.chineseContent || undefined,
    expectedOutput: entry.expectedOutput || '',
    usage: entry.usage || undefined
});
