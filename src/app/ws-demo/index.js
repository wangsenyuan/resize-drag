import React, { useCallback, useMemo, useState } from "react";

import useWebSocket from "@/ws-socket";

const url = "ws://localhost:8080/ws-connect?token=xxxx";

const bearerToken = "xxxxxx";

function Page({}) {
  const [messages, setMessages] = useState([]);

  const onMessage = useCallback((data) => {
    console.log("onMessage => " + JSON.stringify(data));
    setMessages((prev) => {
      let current = [...prev, data];
      return current;
    });
  }, []);

  const { send } = useWebSocket({ url, onMessage });

  const [name, setName] = useState("");

  const onClick = useCallback(() => {
    setName((current) => {
      if (current && current.length > 0) {
        send({ name: current });
      }
      return "";
    });
  }, [send, setName]);

  return (
    <div>
      <div className="input-area">
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={onClick}>Say Hello</button>
      </div>
      <div className="messages">
        <ol>
          {messages.map((cur) => (
            <li key={cur}>{cur}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Page;
