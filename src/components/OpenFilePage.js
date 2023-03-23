import React, { useState } from "react";
import { useSavedState } from "../hooks/useSavedState";
import { areFilesEqual } from "../util/areFilesEqual";
import { useOlderFileHistory } from "../hooks/useOlderFileHistory";
import { FilePickerButton } from "./FilePickerButton";
import { formatSize } from "../util/formatSize";
import "./OpenFilePage.css";

const KEY_DEFAULT_VIEW = "pst-browser.messagePreview.defaultView";


/**
 * @param {object} props
 * @param {(file: File?) => void} props.onChange
 * @param {File[]} props.fileHistory
 */
export function OpenFilePage ({ onChange, fileHistory }) {
    const [ page, setPage ] = useState("open");
    const [ defaultView, setDefaultView ] = useSavedState(KEY_DEFAULT_VIEW, "plain");
    const [ isDragging, setIsDragging ] = useState(false);

    const [ olderFileHistory, saveFileHistory, deleteFileHistory ] = useOlderFileHistory();

    /**
     * @param {React.DragEvent<HTMLDivElement>} e
     */
    function handleDrag (e) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }

    /**
     * @param {React.DragEvent<HTMLDivElement>} e
     */
    function handleDragEnd (e) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }

    /**
     * @param {React.DragEvent<HTMLDivElement>} e
     */
    function handleDrop (e) {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];

        onChange(file || null);

        if (file) {
            const { name, size } = file;
            // @ts-ignore
            e.dataTransfer.items[0].getAsFileSystemHandle().then(handle => {
                saveFileHistory({handle, name, size});
            });
        }
    }

    const remainingOlderHistory = olderFileHistory
        .filter(file => !fileHistory.some(other => areFilesEqual(file, other)))
        .reverse();

    return (
        <div className="OpenFilePage" onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDragEnd} onDrop={handleDrop}>
            <div className="OpenFilePage-Sidebar">
                <ul>
                    <li className={page==="open"?"active":void 0}>
                        <button onClick={() => setPage("open")}>Open</button>
                    </li>
                    <li className={page==="settings"?"active":void 0}>
                        <button onClick={() => setPage("settings")}>Settings</button>
                    </li>
                    <li className={page==="about"?"active":void 0}>
                        <button onClick={() => setPage("about")}>About</button>
                    </li>
                </ul>
            </div>
            {
                page === "open" &&
                <div className="OpenFilePage-Main">
                    <h1>PST File Browser</h1>
                    <p>Choose a <code>.pst</code> file on your computer to get started.</p>
                    <FilePickerButton onChange={onChange} saveFileHistory={saveFileHistory} />
                    <h2>Recent Files</h2>
                    <ol className="OpenFilePage-RecentList">
                        {
                            fileHistory.map((file, i) => <RecentFileListItem key={i} file={file} onClick={() => onChange(file)} />)
                        }
                    </ol>
                    {
                        remainingOlderHistory.length > 0 &&
                        <>
                            <h3>Older Files</h3>
                            <ol className="OpenFilePage-RecentList">
                                {
                                    remainingOlderHistory
                                    .map((file, i) => (
                                        <RecentFileListItem
                                            key={i}
                                            file={file}
                                            onClick={async () => {
                                                // @ts-ignore
                                                const permission = await file.handle.requestPermission();
                                                if (permission === "granted") {
                                                    onChange(await file.handle.getFile());
                                                }
                                            }}
                                            onDelete={() => deleteFileHistory(file)}
                                        />
                                    ))
                                }
                            </ol>
                        </>
                    }
                </div>
            }
            {
                page === "settings" &&
                <div className="OpenFilePage-Main OpenFilePage--Settings">
                    <h1>Settings</h1>
                    <h2>Message Preview</h2>
                    <label>
                        <span>Default Message View</span>
                        <select value={defaultView} onChange={e => setDefaultView(e.target.value)}>
                            <option value="plain">Plain</option>
                            <option value="html">HTML</option>
                            <option value="html-source">HTML (source)</option>
                            <option value="props">Properties</option>
                        </select>
                    </label>
                </div>
            }
            {
                page === "about" &&
                <div className="OpenFilePage-Main">
                    <h1>About</h1>
                    <p>View on github <a href="https://github.com/IJMacD/pst-browser">IJMacD/pst-browser</a>.</p>
                    <p>Built with <code>pst-parser</code> library <a href="https://github.com/IJMacD/pst-parser">IJMacD/pst-parser</a>.</p>
                </div>
            }
            { isDragging && <div className="OpenFilePage-DragOverlay"><p>Drop to Open</p></div> }
        </div>
    )
}

/**
 *
 * @param {object} props
 * @param {{ name: string, size: number }} props.file
 * @param {() => void} props.onClick
 * @param {() => void} [props.onDelete]
 * @returns
 */
function RecentFileListItem ({ file, onClick, onDelete }) {
    return (
        <li onClick={onClick} className="RecentFileListItem">
            <div>
                {file.name}<br />
                <span>{formatSize(file.size)}</span>
            </div>
            { onDelete &&
                <button
                    onClick={e => { e.stopPropagation(); onDelete(); }}
                    title="Forget"
                >
                    ❌︎
                </button>
            }
        </li>
    );
}

