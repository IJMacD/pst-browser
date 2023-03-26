import React, { useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { FolderTree } from "./FolderTree";
import { FolderView } from "./FolderView";
import { MessageView } from "./MessageView";

/**
 *
 * @param {object} props
 * @param {import("pst-parser").MessageStore} props.messageStore
 * @param {() => void} props.onClose
 * @returns
 */
export function ContentsViewPage ({ messageStore, onClose }) {
    const [ selectedFolderNid, setSelectedFolderNid ] = useState(0);
    const [ selectedMessageNid, setSelectedMessageNid ] = useState(0);

    const selectedFolder = selectedFolderNid > 0 ? messageStore?.getFolder(selectedFolderNid) : null;
    const selectedMessage = selectedMessageNid > 0 ? selectedFolder?.getMessage(selectedMessageNid) : null;

    /**
     * @param {number} nid
     */
    function handleFolderClick (nid) {
      setSelectedFolderNid(nid);
      setSelectedMessageNid(-1);
    }

    return (
        <>
            <div className="HeaderBar">
                <button onClick={onClose}>Close</button>
                <h1>{ messageStore.displayName }</h1>
            </div>
            <div style={{display:"flex",flex: 1,overflow:"hidden"}}>
                <ErrorBoundary>
                    <div className="App-FolderPane">
                        <FolderTree folder={messageStore.getRootFolder()} onClick={handleFolderClick} selectedFolderNid={selectedFolderNid} />
                    </div>
                    <div className="App-PreviewPane">
                    {
                        selectedFolder &&
                        <FolderView
                        folder={selectedFolder}
                        onClick={nid => setSelectedMessageNid(nid)}
                        selectedMessageNid={selectedMessageNid}
                        />
                    }
                    {
                        selectedMessage &&
                        <MessageView message={selectedMessage} />
                    }
                    </div>
                </ErrorBoundary>
            </div>
      </>
    )
}