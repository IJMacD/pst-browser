import React from 'react';

export function ValueView({ value }) {
  if (typeof value === "object") {
    if (value instanceof ArrayBuffer) {
      return <BufferView buffer={value} />;
    }

    if (Array.isArray(value)) {
      return (
        <ul style={{ margin: 0, padding: 0 }}>
          {value.map((v, i) => <li key={i}>{v}</li>)}
        </ul>
      );
    }

    if (!value) return null;

    return <span>{value.toString()}</span>;
  }

  if (typeof value === "boolean") {
    return <span>{value ? "true" : "false"}</span>;
  }

  return <span style={{ whiteSpace: "pre-wrap" }}>{value}</span>;
}

/**
 *
 * @param {object} props
 * @param {ArrayBuffer} props.buffer
 */
function BufferView ({ buffer }) {
  return <>{[...new Uint8Array(buffer)].map(v => v.toString(16).toUpperCase().padStart(2, "0")).join(" ")}</>
}