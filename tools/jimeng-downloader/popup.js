/* Popup: detect watermark-free image URLs, confirm prompt ID, save into the chosen folder. */
const $ = (id) => document.getElementById(id);
const IMPORT_COMMAND = 'node scripts/import-generated-images.mjs --dir ~/pm-images --apply';

let selectedUrl = '';
let directoryHandle = null;

const setStatus = (message, kind = 'info') => {
    const status = $('status');
    status.textContent = message;
    status.className = `status ${kind}`;
};

const extensionOf = (blobType, url) => {
    const byType = {
        'image/webp': 'webp',
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/avif': 'avif',
        'image/gif': 'gif'
    };
    if (byType[blobType]) return byType[blobType];
    const pathname = (() => {
        try {
            return new URL(url).pathname;
        } catch {
            return '';
        }
    })();
    const match = pathname.match(/\.(webp|png|jpe?g|avif|gif)$/i);
    return match ? match[1].toLowerCase().replace('jpeg', 'jpg') : 'webp';
};

const renderFolderStatus = () => {
    const node = $('folderStatus');
    if (!directoryHandle) {
        node.textContent = '未选择文件夹：下载时会弹保存对话框（首次请选 ~/pm-images）';
        return;
    }
    node.textContent = `保存位置：已选择文件夹「${directoryHandle.name}」`;
};

const storageGet = (key) => new Promise((resolve) => chrome.storage.local.get(key, (result) => resolve(result[key])));

const selectCandidate = (url) => {
    selectedUrl = url;
    $('url').value = url;
    document.querySelectorAll('.candidate').forEach((node) => {
        node.classList.toggle('selected', node.dataset.url === url);
    });
};

const renderCandidates = (candidates) => {
    const container = $('candidates');
    container.textContent = '';
    if (!candidates.length) {
        $('candidateMeta').textContent = '页面里没找到 byteimg.com 图片，可以手动粘贴审查元素里的 URL。';
        return;
    }
    $('candidateMeta').textContent = `找到 ${candidates.length} 个候选，已默认选中推荐项。`;
    candidates.forEach((candidate, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'candidate';
        button.dataset.url = candidate.url;
        button.title = candidate.url;
        const image = document.createElement('img');
        image.src = candidate.url;
        image.alt = `候选 ${index + 1}`;
        image.loading = 'lazy';
        const label = document.createElement('span');
        label.textContent = candidate.width && candidate.height ? `${candidate.width}×${candidate.height}` : `候选 ${index + 1}`;
        button.appendChild(image);
        button.appendChild(label);
        button.addEventListener('click', () => selectCandidate(candidate.url));
        container.appendChild(button);
    });
    selectCandidate(candidates[0].url);
};

const isJimengTab = (url) => {
    try {
        const host = new URL(url).hostname;
        return host.endsWith('jianying.com') || host.endsWith('capcut.com');
    } catch {
        return false;
    }
};

const requestCandidates = async (tab) => {
    if (!tab?.id) return [];
    try {
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'getCandidates' });
        return response?.ok ? response.candidates : [];
    } catch {
        // Content script not injected yet (tab opened before installing the extension).
        try {
            await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
            await new Promise((resolve) => setTimeout(resolve, 150));
            const response = await chrome.tabs.sendMessage(tab.id, { type: 'getCandidates' });
            return response?.ok ? response.candidates : [];
        } catch {
            return [];
        }
    }
};

const refreshCandidates = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url || !isJimengTab(tab.url)) {
        setStatus('当前标签页不是即梦页面：可以在下面手动粘贴图片 URL。', 'warn');
        renderCandidates([]);
        return;
    }
    setStatus('正在检测即梦页面里的图片…');
    const candidates = await requestCandidates(tab);
    renderCandidates(candidates);
    setStatus(candidates.length ? `检测到 ${candidates.length} 张候选图片，请确认文件名后下载。` : '没有检测到图片，可以手动粘贴 URL。', candidates.length ? 'info' : 'warn');
};

const saveToDirectory = async (blob, filename) => {
    const permission = await directoryHandle.requestPermission({ mode: 'readwrite' });
    if (permission !== 'granted') throw new Error('文件夹写入权限未授权，请重新选择文件夹');
    const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
};

const fallbackDownload = (url, name) => new Promise((resolve, reject) => {
    chrome.downloads.download({ url, filename: `pm-images/${name}`, saveAs: true }, (downloadId) => {
        if (chrome.runtime.lastError || !downloadId) {
            reject(new Error(chrome.runtime.lastError?.message || '下载失败'));
            return;
        }
        resolve();
    });
});

const download = async () => {
    const name = $('filename').value.trim();
    const url = $('url').value.trim();
    if (!/^[0-9]{1,32}$/.test(name)) {
        setStatus('请填写数字提示词 ID（例如 16），它决定文件名。', 'error');
        $('filename').focus();
        return;
    }
    if (!/^https?:\/\//i.test(url)) {
        setStatus('请先选择或粘贴图片 URL。', 'error');
        return;
    }

    const button = $('download');
    button.disabled = true;
    button.textContent = '下载中…';
    try {
        // Ask for folder permission while we still have the user gesture.
        if (directoryHandle) {
            const permission = await directoryHandle.requestPermission({ mode: 'readwrite' });
            if (permission !== 'granted') directoryHandle = null;
        }
        setStatus('正在下载无水印原图…');
        const response = await fetch(url, { credentials: 'omit' });
        if (!response.ok) throw new Error(`图片下载失败：HTTP ${response.status}`);
        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) throw new Error(`返回的不是图片（${blob.type || '未知类型'}）`);
        const ext = extensionOf(blob.type, url);
        const filename = `${name}.${ext}`;

        if (directoryHandle) {
            await saveToDirectory(blob, filename);
            setStatus(`已保存 ${filename}（${(blob.size / 1024).toFixed(0)} KB）到「${directoryHandle.name}」。`, 'ok');
        } else {
            await fallbackDownload(url, filename);
            setStatus('已打开浏览器保存对话框：请选择 ~/pm-images（Chrome 会记住上次文件夹），确认文件名后保存。', 'info');
        }

        if (/^[0-9]+$/.test(name)) await chrome.storage.local.set({ lastPromptId: Number(name) });
        $('nextSteps').hidden = false;
    } catch (error) {
        setStatus(`失败：${error.message}`, 'error');
    } finally {
        button.disabled = false;
        button.textContent = '下载到 pm-images';
    }
};

const init = async () => {
    try {
        directoryHandle = await ppGetHandle('imagesDir');
    } catch {
        directoryHandle = null;
    }
    renderFolderStatus();

    const lastId = await storageGet('lastPromptId');
    if (Number.isFinite(lastId)) $('filename').value = String(lastId + 1);

    $('refresh').addEventListener('click', refreshCandidates);
    $('pickFolder').addEventListener('click', () => chrome.runtime.openOptionsPage());
    $('download').addEventListener('click', download);
    $('url').addEventListener('input', () => {
        selectedUrl = $('url').value.trim();
    });
    $('copyCommand').addEventListener('click', async () => {
        await navigator.clipboard.writeText(IMPORT_COMMAND);
        setStatus('导入命令已复制到剪贴板。', 'ok');
    });

    await refreshCandidates();
};

init();
