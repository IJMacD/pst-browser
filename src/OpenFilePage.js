import React, { useState } from "react";
import { useSavedState } from "./useSavedState";

const KEY_DEFAULT_VIEW = "pst-browser.messagePreview.defaultView";

export function OpenFilePage ({ onChange }) {
    const [ page, setPage ] = useState("open");
    const [ defaultView, setDefaultView ] = useSavedState(KEY_DEFAULT_VIEW, "plain");

    return (
        <div className="OpenFilePage">
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
                    <label className="OpenFilePage-Button">
                        <span>📂</span>
                        Open File
                        <input type="file" onChange={e => { onChange(e.target.files?.[0]||null); e.target.value = ""; }} />
                    </label>
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
        </div>
    )
}