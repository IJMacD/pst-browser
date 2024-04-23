import React, { useEffect, useState } from 'react';
import { MessageTable } from './MessageTable';

/**
 * @param {object} props
 * @param {import("pst-parser").Folder?} props.folder
 * @param {(nid: number) => void} props.onClick
 * @param {number} [props.selectedMessageNid]
 */

export function FolderView({ folder, onClick, selectedMessageNid }) {
  const [page, setPage] = useState(0);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (folder) {
      const lastPage = Math.floor(folder.contentCount / ITEMS_PER_PAGE);

      if (page > lastPage)
        setPage(0);
    }
  }, [folder, page]);

  if (!folder)
    return null;

  const lastPage = Math.floor(folder.contentCount / ITEMS_PER_PAGE);

  return (
    <div className="FolderView">
      <h2 style={{margin:0}}>{folder.displayName}</h2>
      <p>Total: {folder.contentCount} Unread: {folder.unreadCount}</p>
      <div>
        <button disabled={page <= 0} onClick={() => setPage(0)}>&lt;&lt;</button>{' '}
        <button disabled={page <= 0} onClick={() => setPage(p => Math.max(p - 1, 0))}>&lt;</button>{' '}
        Page {page + 1}{' '}
        <button disabled={page >= lastPage} onClick={() => setPage(p => p + 1)}>&gt;</button>{' '}
        <button disabled={page >= lastPage} onClick={() => setPage(lastPage)}>&gt;&gt;</button>{' '}
        {page * ITEMS_PER_PAGE + 1} &ndash; {Math.min((page + 1) * ITEMS_PER_PAGE, folder.contentCount)} of {folder.contentCount}
      </div>
      <MessageTable
        messages={folder.getContents(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)}
        onClick={onClick}
        selectedMessageNid={selectedMessageNid} />
    </div>
  );
}
