import { useState, useEffect } from "react";
import { PromiseIDB } from "../PromiseIDB";

/**
 * @typedef SavedFile
 * @property {string} name
 * @property {number} size
 * @property {Date} lastOpenDate
 * @property {FileSystemFileHandle} handle
 */

/**
 * @param {IDBDatabase} db
 */
function onUpgradeNeeded (db) {
    const objectStore = db.createObjectStore("files");
    objectStore.createIndex("recentlyOpened", "lastOpenDate");
}

/**
 * @returns {[SavedFile[], (file: SavedFile) => void, (file: SavedFile) => void]}
 */
export function useOlderFileHistory () {
    const [ olderFileHistory, setOlderFileHistory ] = useState(/** @type {SavedFile[]} */([]));


    useEffect(() => {
        PromiseIDB("FileHistory", onUpgradeNeeded).then(db => {
            db.objectStore("files", "readonly")
                .index("recentlyOpened")
                .getAll()
                .then(setOlderFileHistory)
                .catch(console.log);
        });
    }, []);

    /**
     * @param {SavedFile} file
     */
    function saveFile (file) {
        const key = `${file.name}`;

        PromiseIDB("FileHistory", onUpgradeNeeded).then(db => {
            db.objectStore("files", "readwrite").put(file, key);
        });
    }

    /**
     * @param {SavedFile} file
     */
    function deleteFile (file) {
        const key = `${file.name}`;
        PromiseIDB("FileHistory", onUpgradeNeeded).then(async db => {
            const objectStore = db.objectStore("files", "readwrite");
            await objectStore.delete(key);
            objectStore.index("recentlyOpened").getAll().then(setOlderFileHistory);
        });
    }

    return [ olderFileHistory, saveFile, deleteFile ];
}
