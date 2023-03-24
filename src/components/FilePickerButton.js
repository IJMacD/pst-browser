import React from "react";

/**
 * @typedef {import("../hooks/useOlderFileHistory").SavedFile} SavedFile
 */

/**
 *
 * @param {object} props
 * @param {(file: (File|SavedFile)?) => void} props.onChange
 * @returns
 */
export function FilePickerButton({ onChange }) {
    if (window.showOpenFilePicker) {
        return (
            <button
                className="OpenFilePage-Button"
                onClick={async () => {
                    /** @type {FileSystemFileHandle[]} */
                    const [handle] = await window.showOpenFilePicker({ types: [{ description: "PST Files", accept: { "application/octet": [".pst"] } }] });
                    const file = await handle.getFile();
                    const { name, size } = file;
                    onChange({ handle, name, size, lastOpenDate: new Date() });
                }}
            >
                <span>📂</span>
                Open File
            </button>
        );
    }

    return (
        <label
            className="OpenFilePage-Button"
        >
            <span>📂</span>
            Open File
            <input
                type="file"
                className="visually-hidden"
                accept=".pst"
                onChange={e => { onChange(e.target.files?.[0] || null); e.target.value = ""; }} />
        </label>
    );
}
