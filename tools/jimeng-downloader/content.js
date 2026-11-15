/**
 * Content script: collects "watermark-free" Jimeng/Dreamina image URLs from the page.
 *
 * Jimeng renders generated images through signed byteimg.com URLs
 * (e.g. https://p9-dreamina-sign.byteimg.com/...~tplv-...-aigc_resize:2400:2400.webp?...).
 * Downloading that URL directly returns the clean image without the visible watermark.
 */
(() => {
    const HOST_RE = /(^|\.)byteimg\.com$/i;

    const isCandidate = (url) => {
        try {
            const parsed = new URL(url);
            return HOST_RE.test(parsed.hostname);
        } catch {
            return false;
        }
    };

    const scoreOf = (url) => {
        let score = 0;
        if (/dreamina-sign/i.test(url)) score += 4;
        if (/aigc_resize/i.test(url)) score += 3;
        if (/tplv/i.test(url)) score += 1;
        if (/\.webp(\?|$)/i.test(url)) score += 1;
        if (/watermark|水印|shuiyin|_wm|wm_/i.test(url)) score -= 6;
        return score;
    };

    const hintSize = (url) => {
        const match = url.match(/aigc_resize[:%3A]*(\d+)[:x%3A]+(\d+)/i);
        return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
    };

    const scan = () => {
        const found = new Map();
        const add = (raw, element) => {
            if (!raw || typeof raw !== 'string') return;
            let url = raw.trim().replace(/^["']|["']$/g, '');
            if (url.startsWith('//')) url = `https:${url}`;
            if (!/^https?:/i.test(url) || !isCandidate(url)) return;
            const naturalWidth = element ? element.naturalWidth || element.width || 0 : 0;
            const naturalHeight = element ? element.naturalHeight || element.height || 0 : 0;
            const hint = hintSize(url);
            const previous = found.get(url) || {};
            found.set(url, {
                url,
                width: hint?.width || previous.width || naturalWidth,
                height: hint?.height || previous.height || naturalHeight,
                score: scoreOf(url),
                inDom: previous.inDom || Boolean(element)
            });
        };

        document.querySelectorAll('img').forEach((img) => {
            add(img.currentSrc || img.src, img);
            if (img.srcset) img.srcset.split(',').forEach((part) => add(part.trim().split(/\s+/)[0], img));
            ['data-src', 'data-original', 'data-lazy-src', 'data-url'].forEach((attr) => add(img.getAttribute(attr), img));
        });

        document.querySelectorAll('a[href*="byteimg"], source[srcset*="byteimg"], video[poster*="byteimg"]').forEach((node) => {
            add(node.href || node.srcset || node.poster, null);
        });

        const urlRegex = /url\((['"]?)([^'")]+)\1\)/g;
        document.querySelectorAll('[style]').forEach((el) => {
            const style = el.getAttribute('style') || '';
            if (!style.includes('byteimg')) return;
            let match;
            while ((match = urlRegex.exec(style))) add(match[2], null);
        });

        performance.getEntriesByType('resource').forEach((entry) => {
            if (entry.name && entry.name.includes('byteimg.com')) add(entry.name, null);
        });

        const list = [...found.values()];
        list.sort((a, b) => b.score - a.score || (b.width * b.height) - (a.width * a.height));
        const withSize = list.filter((item) => item.width * item.height > 0);
        const meaningful = withSize.filter((item) => item.width * item.height >= 40000);
        const pool = meaningful.length ? meaningful : (withSize.length ? withSize : list);
        return pool.slice(0, 24);
    };

    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
        chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
            if (message?.type === 'getCandidates') {
                try {
                    sendResponse({ ok: true, candidates: scan(), pageUrl: location.href });
                } catch (error) {
                    sendResponse({ ok: false, error: String(error) });
                }
                return true;
            }
        });
    }

    // Exposed for diagnostics/testing.
    window.__ppJimengScan = scan;
})();
