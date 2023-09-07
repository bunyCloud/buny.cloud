import React from 'react';

function UnixTimestamp(props) {
  const timestamp = props.timestamp;
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds

  return (
    <div>
      <p>Unix timestamp: {timestamp}</p>
      <p>Human-readable date: {date.toString()}</p>
    </div>
  );
}

export default UnixTimestamp;
