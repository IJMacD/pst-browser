import * as PST from 'pst-parser';
import './App.css';
import React, { useEffect, useState } from 'react';
import { MessageView } from './MessageView';
import { FolderView } from './FolderView';
import { FolderTree } from './FolderTree';
import { OpenFilePage } from './OpenFilePage';

function App() {
  const [ file, setFile ] = useState(/** @type {File?} */(null));
  const [ pstFile, setPSTFile ] = useState(/** @type {PST.PSTFile?} */(null));
  const [ selectedFolderNid, setSelectedFolderNid ] = useState(-1);
  const [ selectedMessageNid, setSelectedMessageNid ] = useState(-1);

  useEffect(() => {
    if (file) {
      file.arrayBuffer()
        .then(buffer => setPSTFile(new PST.PSTFile(buffer)))
        .catch(e => {
          alert(e.message);
          setFile(null);
        });
    }
    else {
      setPSTFile(null);
      setSelectedFolderNid(-1);
      setSelectedMessageNid(-1);
    }
  }, [file]);

  const messageStore = pstFile && pstFile.getMessageStore();

  const selectedFolder = selectedFolderNid > 0 && pstFile?.getFolder(selectedFolderNid);
  const selectedMessage = selectedMessageNid > 0 && pstFile?.getMessage(selectedMessageNid);

  /**
   * @param {number} nid
   */
  function handleFolderClick (nid) {
    setSelectedFolderNid(nid);
    setSelectedMessageNid(-1);
  }

  if (!pstFile) {
    if (file) {
      return (
        <div className="App">
          <div style={{alignSelf:"center",textAlign:"center",width:"100%"}}>Loading</div>
        </div>
      );
    }

    return (
      <div className="App">
        <OpenFilePage onChange={file => setFile(file)} />
      </div>
    )
  }

  return (
    <div className="App" style={{flexDirection:"column"}}>
      <div className="HeaderBar">
        {
          messageStore &&
          <>
            <button onClick={() => setFile(null)}>Close</button>
            <h1>{ messageStore.displayName }</h1>
          </>
        }
      </div>
      <div style={{display:"flex"}}>
        {
          messageStore &&
          <div style={{padding: "1em", width: 320}}>
            <FolderTree folder={messageStore.getRootFolder()} onClick={handleFolderClick} selectedFolderNid={selectedFolderNid} />
          </div>
        }
        <div className="PreviewPane">
          {
            selectedFolder && <FolderView folder={selectedFolder} onClick={nid => setSelectedMessageNid(nid)} selectedMessageNid={selectedMessageNid} />
          }
          {
            selectedMessage && <MessageView message={selectedMessage} />
          }
        </div>
      </div>
    </div>
  );
}

export default App;

/**
 * @param {string} subject
 */
export function stripSubject (subject) {
  // eslint-disable-next-line
  return subject && subject.replace(/[\x01-\x0f]/g, "");
}