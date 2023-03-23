import React, { useEffect, useRef, useState } from 'react';
import { stripSubject } from "../util/stripSubject";
import { useSavedState } from '../hooks/useSavedState';
import { ValueView } from "./ValueView";

const KEY_DEFAULT_VIEW = "pst-browser.messagePreview.defaultView";

/**
 *
 * @param {object} props
 * @param {import("pst-parser").Message} props.message
 * @returns
 */
export function MessageView({ message }) {
  const [mode, setMode] = useSavedState(KEY_DEFAULT_VIEW, "plain");
  const [ iframeHeight, setIframeHeight ] = useState(800);
  /** @type {import('react').MutableRefObject<HTMLDivElement?>} */
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current?.scroll(0, 0);
  }, [message]);

  const props = message.getAllProperties();

  if (mode === "debug") {
    console.log(props);
  }

  return (
    <div className="MessageView" ref={containerRef}>
      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="plain">Plain</option>
        <option value="html">HTML</option>
        <option value="html-source">HTML (source)</option>
        <option value="props">Properties</option>
      </select>
      <h3>{stripSubject(message.subject)}</h3>
      <p style={{ margin: 0 }}>From: {props.senderName}</p>
      <p style={{ margin: 0 }}>To: {props.receivedByName}</p>
      <div style={{wordBreak:"break-word"}}>
        {mode === "plain" &&
          <>
            <p style={{ margin: 0, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{message.body}</p>
          </>}
        {mode === "html" &&
          <iframe
            srcDoc={message.bodyHTML}
            style={{ width: "100%", height: iframeHeight, border: "none" }}
            title="Message Preview"
            onLoad={e => setIframeHeight(e.currentTarget.contentDocument?.documentElement.scrollHeight||800)}
          />}
        {mode === "html-source" &&
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}><code>{message.bodyHTML}</code></pre>}
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