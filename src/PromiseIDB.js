/**
 * @param {string} dbName
 * @param {(db: IDBDatabase, e: IDBVersionChangeEvent) => void} onUpgradeNeeded
 * @param {number} [version]
 * @returns {Promise<{ objectStore: (name: string, mode: "readonly"|"readwrite") => PromiseObjectStore}>}
 */
export function PromiseIDB(dbName, onUpgradeNeeded, version = 1) {
    return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open(dbName, version);
        dbRequest.onupgradeneeded = e => onUpgradeNeeded(dbRequest.result, e);
        dbRequest.onsuccess = () => resolve({ objectStore: (name, mode) => new PromiseObjectStore(dbRequest.result, name, mode) });
        dbRequest.onerror = reject;
    });
}

export class PromiseObjectStore {
    #objectStore;

    get autoIncrement() { return this.#objectStore.autoIncrement; }
    get indexNames() { return this.#objectStore.indexNames; }
    get keyPath() { return this.#objectStore.keyPath; }
    get name() { return this.#objectStore.name; }
    get transaction() { return this.#objectStore.transaction; }

    /**
     * @param {IDBDatabase} db
     * @param {string} objectStore
     * @param {"readonly"|"readwrite"} mode
     */
    constructor(db, objectStore, mode) {
        const transaction = db.transaction(objectStore, mode);
        this.#objectStore = transaction.objectStore(objectStore);
    }

    /**
     * @param {any} value
     * @param {IDBValidKey} [key]
     * @returns {Promise<IDBValidKey>}
     */
    add(value, key) {
        return wrapPromise(this.#objectStore.add(value, key));
    }

    /**
     * @returns {Promise<undefined>}
     */
    clear() {
        return wrapPromise(this.#objectStore.clear());
    }

    /**
     * @param {IDBValidKey|IDBKeyRange} [query]
     * @returns {Promise<number>}
     */
    count(query) {
        return wrapPromise(this.#objectStore.count(query));
    }

    /**
     * @param {IDBValidKey|IDBKeyRange} query
     * @returns {Promise<undefined>}
     */
    delete(query) {
        return wrapPromise(this.#objectStore.delete(query));
    }

    /**
     * @param {IDBValidKey|IDBKeyRange} query
     * @returns {Promise<any>}
     */
    get(query) {
        return wrapPromise(this.#objectStore.get(query));
    }

    /**
     * @param {IDBValidKey|IDBKeyRange|null} [query]
     * @param {number} [count]
     * @returns {Promise<any[]>}
     */
    getAll(query, count) {
        return wrapPromise(this.#objectStore.getAll(query, count));
    }

    /**
     * @param {IDBValidKey|IDBKeyRange|null} [query]
     * @param {number} [count]
     * @returns {Promise<IDBValidKey[]>}
     */
    getAllKeys(query, count) {
        return wrapPromise(this.#objectStore.getAllKeys(query, count));
    }

    /**
     * @param {IDBValidKey|IDBKeyRange} query
     * @returns {Promise<IDBValidKey|undefined>}
     */
    getKey(query) {
        return wrapPromise(this.#objectStore.getKey(query));
    }

    /**
     * @param {string} name
     * @returns {IDBIndex}
     */
    index(name) {
        return this.#objectStore.index(name);
    }

    /**
     * @param {IDBValidKey|IDBKeyRange|null} [query]
     * @param {IDBCursorDirection} [direction]
     * @returns {Promise<IDBCursorWithValue|undefined>}
     */
    openCursor(query, direction) {
        return wrapPromise(this.#objectStore.openCursor(query, direction));
    }

    /**
     * @param {IDBValidKey|IDBKeyRange|null} [query]
     * @param {IDBCursorDirection} [direction]
     * @returns {Promise<IDBCursor|null>}
     */
    openKeyCursor(query, direction) {
        return wrapPromise(this.#objectStore.openKeyCursor(query, direction));
    }

    /**
     * @param {any} value
     * @param {IDBValidKey} [key]
     * @returns {Promise<IDBValidKey>}
     */
    put(value, key) {
        return wrapPromise(this.#objectStore.put(value, key));
    }
}

/**
 * @param {IDBRequest} request
 */
function wrapPromise(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = reject;
    });
}
