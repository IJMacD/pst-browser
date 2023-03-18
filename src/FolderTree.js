import React from 'react';

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
    <div>
      <p onClick={() => onClick(folder.nid)} style={{ margin: 0, cursor: "pointer", fontWeight: selectedFolderNid === folder.nid ? "bold" : "normal" }}>{folder.displayName} ({folder.contentCount})</p>
      {folder.hasSubfolders && (
        <ul style={{ margin: 0 }}>
          {folder.getSubFolderEntries().map(f => <li key={f.nid}><FolderTree folder={folder.getSubFolder(f.nid)} onClick={onClick} selectedFolderNid={selectedFolderNid} /></li>)}
        </ul>
      )}
    </div>
  );
}
