import React from 'react';
import "./FolderTree.css";

/**
 * @param {object} props
 * @param {import("pst-parser").Folder?} props.folder
 * @param {(nid: number) => void} props.onClick
 * @param {number} [props.selectedFolderNid]
 */
export function FolderTree({ folder, onClick, selectedFolderNid }) {
  if (!folder)
    return null;

  return (
    <div className={`FolderTree ${folder.hasSubfolders ? "FolderTree-Parent" : ""} ${selectedFolderNid === folder.nid ? "FolderTree--selected" : ""}`}>
      <p onClick={() => onClick(folder.nid)}>{folder.displayName} ({folder.contentCount})</p>
      {folder.hasSubfolders && (
        <ul>
          {folder.getSubFolderEntries().map(f => <li key={f.nid}><FolderTree folder={folder.getSubFolder(f.nid)} onClick={onClick} selectedFolderNid={selectedFolderNid} /></li>)}
        </ul>
      )}
    </div>
  );
}
