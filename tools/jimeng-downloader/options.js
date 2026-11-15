/* Options page: bind the local pm-images directory. */
const $ = (id) => document.getElementById(id);

const render = async () => {
    let dir = null;
    try {
        dir = await ppGetHandle('imagesDir');
    } catch {
        dir = null;
    }
    const status = $('status');
    if (dir) {
        status.textContent = `已绑定文件夹「${dir.name}」`;
        status.className = 'status ok';
    } else {
        status.textContent = '尚未选择保存文件夹';
        status.className = 'status warn';
    }
};

const pick = async () => {
    const status = $('status');
    if (typeof window.showDirectoryPicker !== 'function') {
        status.textContent = '当前 Chrome 不支持文件系统访问，请升级 Chrome。';
        status.className = 'status error';
        return;
    }
    try {
        const dir = await window.showDirectoryPicker({ id: 'pm-images', mode: 'readwrite' });
        await ppSetHandle('imagesDir', dir);
        await render();
    } catch (error) {
        if (error.name === 'AbortError') return;
        status.textContent = `选择失败：${error.message}`;
        status.className = 'status error';
    }
};

$('pick').addEventListener('click', pick);
$('clear').addEventListener('click', async () => {
    await ppClearHandle('imagesDir');
    await render();
});

render();
