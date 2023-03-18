import React, { useState } from 'react';
import { stripSubject } from './App';
import { ValueView } from "./ValueView";

/**
 *
 * @param {object} props
 * @param {import("pst-parser").Message} props.message
 * @returns
 */
export function MessageView({ message }) {
  const [mode, setMode] = useState("plain");

  const props = message.getAllProperties();

  if (mode === "debug") {
    console.log(props);
  }

  return (
    <div>
      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="plain">Plain</option>
        <option value="html">HTML</option>
        <option value="html-source">HTML (source)</option>
        <option value="props">Properties</option>
      </select>
      <h3>{stripSubject(message.subject)}</h3>
      <p style={{ margin: 0 }}>From: {props.senderName}</p>
      <p style={{ margin: 0 }}>To: {props.receivedByName}</p>
      <div style={{overflow:"auto"}}>
        {mode === "plain" &&
          <>
            <p style={{ margin: 0, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{message.body}</p>
          </>}
        {mode === "html" &&
          <iframe srcDoc={message.bodyHTML} style={{ width: "100%", height: 800 }} title="Message Preview" />}
        {mode === "html-source" &&
          <pre style={{ whiteSpace: "pre-wrap" }}><code>{message.bodyHTML}</code></pre>}
        {mode === "props" &&
          <dl style={{ fontFamily: "monospace" }}>
            {Object.entries(props).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt style={{ fontWeight: "bold" }}>{key}</dt>
                <dd><ValueView value={value} /></dd>
              </React.Fragment>
            ))}
          </dl>}
      </div>
    </div>
  );
}
