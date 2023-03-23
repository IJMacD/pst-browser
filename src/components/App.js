import * as PST from 'pst-parser';
import React, { useEffect, useState } from 'react';
import { OpenFilePage } from './OpenFilePage';
import { ContentsViewPage } from './ContentsViewPage';
import { areFilesEqual } from '../util/areFilesEqual';
import './App.css';

function App() {
  const [ file, setFile ] = useState(/** @type {File?} */(null));
  const [ pstFile, setPSTFile ] = useState(/** @type {PST.PSTFile?} */(null));
  const [ fileHistory, setFileHistory ] = useState(/** @type {File[]} */([]));

  useEffect(() => {
    if (file) {
      file.arrayBuffer()
        .then(buffer => setPSTFile(new PST.PSTFile(buffer)))
        .catch(e => {
          alert(e.message);
          setFile(null);
        });

      setFileHistory(history => [file, ...history.filter(other => !areFilesEqual(file, other))]);
    }
    else {
      setPSTFile(null);
    }
  }, [file]);

  const messageStore = pstFile && pstFile.getMessageStore();

  if (messageStore) {
    return (
      <div className="App" style={{flexDirection:"column"}}>
        <ContentsViewPage messageStore={messageStore} onClose={() => setFile(null)} />
      </div>
    );
  }

  if (pstFile) {
    return (
      <div className="App">
        <p style={{color:"red"}}>Error with PST file</p>
        <button onClick={() => setFile(null)}>Close</button>
      </div>
    )
  }

  if (file) {
    return (
      <div className="App">
        <div style={{alignSelf:"center",textAlign:"center",width:"100%"}}>Loading</div>
      </div>
    );
  }

  return (
    <div className="App">
      <OpenFilePage onChange={(/** @type {File?} */ file) => setFile(file)} fileHistory={fileHistory} />
    </div>
  );
}

export default App;
