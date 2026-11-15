/* Minimal service worker: keeps the extension loaded and gives a stable extension ID target. */
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get({ lastPromptId: null }, () => {});
});
