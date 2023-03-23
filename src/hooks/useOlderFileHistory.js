import { useState, useEffect } from "react";
import { PromiseIDB } from "../PromiseIDB";

/**
 * @typedef SavedFile
 * @property {string} name
 * @property {number} size
 * @property {FileSystemFileHandle} handle
 */

/**
 * @param {IDBDatabase} db
 */
function onUpgradeNeeded (db) {
    db.createObjectStore("files");
}

/**
 * @returns {[SavedFile[], (file: SavedFile) => void, (file: SavedFile) => void]}
 */
export function useOlderFileHistory () {
    const [ olderFileHistory, setOlderFileHistory ] = useState(/** @type {SavedFile[]} */([]));


    useEffect(() => {
        PromiseIDB("FileHistory", onUpgradeNeeded).then(db => {
            db.objectStore("files", "readonly").getAll()
                .then(setOlderFileHistory);
        });
    }, []);

    /**
     * @param {SavedFile} file
     */
    function saveFile (file) {
        const key = `${file.name}_${file.size}`;

        PromiseIDB("FileHistory", onUpgradeNeeded).then(db => {
            db.objectStore("files", "readwrite").add(file, key);
        });
    }

    /**
     * @param {SavedFile} file
     */
    function deleteFile (file) {
        const key = `${file.name}_${file.size}`;
        PromiseIDB("FileHistory", onUpgradeNeeded).then(async db => {
            const objectStore = db.objectStore("files", "readwrite");
            await objectStore.delete(key);
            objectStore.getAll().then(setOlderFileHistory);
        });
    }

    return [ olderFileHistory, saveFile, deleteFile ];
}
