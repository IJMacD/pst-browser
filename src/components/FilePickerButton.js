import React from "react";

/**
 *
 * @param {object} props
 * @param {(file: File?) => void} props.onChange
 * @param {(savedFile: import("./hooks/useOlderFileHistory").SavedFile) => void} props.saveFileHistory
 * @returns
 */
export function FilePickerButton({ onChange, saveFileHistory }) {
    if (window.showOpenFilePicker) {
        return (
            <button
                className="OpenFilePage-Button"
                onClick={async () => {
                    /** @type {FileSystemFileHandle[]} */
                    const [handle] = await window.showOpenFilePicker({ types: [{ description: "PST Files", accept: { "application/octet": [".pst"] } }] });
                    const file = await handle.getFile();
                    const { name, size } = file;
                    saveFileHistory({ handle, name, size });
                    onChange(file);
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
