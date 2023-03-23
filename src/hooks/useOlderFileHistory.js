import { useState, useEffect } from "react";

/**
 * @typedef SavedFile
 * @property {string} name
 * @property {number} size
 * @property {FileSystemFileHandle} handle
 */

/**
 * @returns {[SavedFile[], (file: SavedFile) => void, (file: SavedFile) => void]}
 */
export function useOlderFileHistory () {
    const [ olderFileHistory, setOlderFileHistory ] = useState(/** @type {SavedFile[]} */([]));

    useEffect(() => {
        const request = indexedDB.open("FileHistory");
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction("files", "readonly");
            const req = transaction.objectStore("files").getAll();
            req.onsuccess = () => {
                setOlderFileHistory(req.result);
            };
        };
    }, []);

    /**
     * @param {SavedFile} file
     */
    function saveFile (file) {
        const key = `${file.name}_${file.size}`;
        const r = indexedDB.open("FileHistory", 1);
        r.onupgradeneeded = () => {
            const db = r.result;
            db.createObjectStore("files");
        };
        r.onsuccess = () => {
            const db = r.result;
            const transaction = db.transaction("files", "readwrite");
            transaction.objectStore("files").add(file, key);
        };
    }

    /**
     * @param {SavedFile} file
     */
    function deleteFile (file) {
        const r = indexedDB.open("FileHistory", 1);
        r.onupgradeneeded = () => {
            const db = r.result;
            db.createObjectStore("files");
        };
        r.onsuccess = () => {
            const db = r.result;
            const transaction = db.transaction("files", "readwrite");
            const key = `${file.name}_${file.size}`;
            transaction.objectStore("files").delete(key);
            const req = transaction.objectStore("files").getAll();
            req.onsuccess = () => {
                setOlderFileHistory(req.result);
            };
        };
    }

    return [ olderFileHistory, saveFile, deleteFile ];
}
