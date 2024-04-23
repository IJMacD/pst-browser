import React, { useEffect, useRef, useState } from 'react';
import { useSavedState } from '../hooks/useSavedState';
import { AttachmentView } from './AttachmentView';
import { ValueView } from "./ValueView";

const KEY_DEFAULT_VIEW = "pst-browser.messagePreview.defaultView";

const RECIPIENT_TYPE = {
  0x01: "To",
  0x02: "CC",
  0x03: "Bcc"
};

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

  return (
    <div className="MessageView" ref={containerRef}>
      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="plain">Plain</option>
        <option value="html">HTML</option>
        <option value="html-source">HTML (source)</option>
        <option value="props">Properties</option>
        <option value="attach">Attachments</option>
      </select>
      <h3>{message.subject}</h3>
      <p style={{ margin: 0 }}>From: {props.senderName}</p>
      <ul style={{margin:0,padding:0,listStyle:"none"}}>
        {
          message.getAllRecipients().map((recipient, i) => <li key={i}>{RECIPIENT_TYPE[recipient.recipientType]}: {recipient.displayName}</li>)
        }
      </ul>
      {mode === "plain" &&
        <div style={{wordBreak:"break-word"}}>
          <p style={{ margin: 0, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{message.body}</p>
        </div>}
      {mode === "html" &&
        <iframe
          srcDoc={`<base target="_blank">${message.bodyHTML}`}
          style={{ width: "100%", height: iframeHeight, border: "none", background: "white", marginTop: "1em" }}
          title="Message Preview"
          onLoad={e => setIframeHeight(e.currentTarget.contentDocument?.documentElement.scrollHeight||800)}
          sandbox="allow-popups"
        />}
      {mode === "html-source" &&
        <div style={{wordBreak:"break-word"}}>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}><code>{message.bodyHTML}</code></pre>
        </div>
      }
      {mode === "props" &&
        <div style={{wordBreak:"break-word"}}>
          <dl style={{ fontFamily: "monospace" }}>
            {Object.entries(props).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt style={{ fontWeight: "bold" }}>{key}</dt>
                <dd><ValueView value={value} /></dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      }
      { mode === "attach" &&
        <AttachmentView message={message} />
      }
    </div>
  );
}
