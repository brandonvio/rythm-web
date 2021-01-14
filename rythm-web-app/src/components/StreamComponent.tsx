import React, { useState, useEffect } from "react";
const io = require("socket.io-client");
const ENDPOINT = "http://34.215.26.46:3000";

export function StreamComponent() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.on("rythm-oanda-price-stream-topic", (data: any) => {
      setResponse(data);
      console.log(data);
    });
  }, []);

  return (
    <div>
      <h2>Rythm SocketIO</h2>
      <h2>{response}</h2>
    </div>
  );
}
