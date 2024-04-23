import { MF_HAS_ATTACH, MF_READ } from 'pst-parser/src/messaging/MessageFlags';
import React from 'react';
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

          const className = [
            "MessageTable-Row",
            selectedMessageNid === msg.nid ? "MessageTable-Row--selected" : "",
            msg.messageFlags & MF_READ ? "MessageTable-Row--read" : "MessageTable-Row--unread",
          ].join(" ");

          return (
            <tr
              key={msg.nid}
              className={className}
              onClick={() => onClick(msg.nid)}
            >
              <td className="subject">{msg.subject} {msg.messageFlags & MF_HAS_ATTACH ? "🔗" :""}</td>
              <td className="date">{msg.messageDeliveryTime?.toISOString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
