import React from 'react';
import { stripSubject } from "../util/stripSubject";
import "./MessageTable.css";

/**
 * @param {object} props
 * @param {object[]} props.messages
 * @param {(nid: number) => void} props.onClick
 * @param {number} [props.selectedMessageNid]
 */

export function MessageTable({ messages, onClick, selectedMessageNid }) {

  return (
    <table className="MessageTable">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Date</th>
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
              <td className="subject">{stripSubject(msg.subject)}</td>
              <td className="date">{msg.messageDeliveryTime.toISOString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
