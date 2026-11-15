/* Tiny IndexedDB helper shared by popup and options pages. */
const PP_DB_NAME = 'pp-jimeng-downloader';
const PP_STORE = 'handles';

function ppOpenDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(PP_DB_NAME, 1);
        request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains(PP_STORE)) {
                request.result.createObjectStore(PP_STORE);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function ppSetHandle(key, handle) {
    const db = await ppOpenDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(PP_STORE, 'readwrite');
        tx.objectStore(PP_STORE).put(handle, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function ppGetHandle(key) {
    const db = await ppOpenDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(PP_STORE, 'readonly');
        const request = tx.objectStore(PP_STORE).get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

async function ppClearHandle(key) {
    const db = await ppOpenDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(PP_STORE, 'readwrite');
        tx.objectStore(PP_STORE).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}
