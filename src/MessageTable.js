import React from 'react';
import { stripSubject } from './App';

/**
 * @param {object} props
 * @param {object[]} props.messages
 * @param {(nid: number) => void} props.onClick
 * @param {number} [props.selectedMessageNid]
 */

export function MessageTable({ messages, onClick, selectedMessageNid }) {

  const tdStyle = { border: "1px solid #CCC" };
  const thStyle = { border: "1px solid #CCC", background: "#F8F8F8" };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={thStyle}>Subject</th>
          <th style={thStyle}>Date</th>
        </tr>
      </thead>
      <tbody>
        {messages.map(msg => {
          return (
            <tr
              key={msg.nid}
              style={{
                fontWeight: msg.messageFlags ? "normal" : "bold",
                cursor: "pointer",
                backgroundColor: selectedMessageNid === msg.nid ? "#FFFFC0" : "transparent"
              }}
              onClick={() => onClick(msg.nid)}
            >
              <td style={tdStyle}>{stripSubject(msg.subject)}</td>
              <td style={tdStyle}>{msg.messageDeliveryTime.toISOString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
