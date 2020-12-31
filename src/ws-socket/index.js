import { useCallback, useEffect, useRef } from "react";

export function useWebSocket({ url, onMessage }) {
  const clientRef = useRef(null);

  const send = useCallback(
    (data) => {
      clientRef.current?.send(JSON.stringify(data));
    },
    [clientRef]
  );

  const close = useCallback(() => {
    clientRef.current?.close();
  }, [clientRef.current]);

  useEffect(() => {
    try {
      clientRef.current?.close();
      const client = new WebSocket(url);
      clientRef.current = client;
      client.onopen = function () {
        console.log("clientWebSocket.onopen", client);
        console.log("clientWebSocket.readyState", "websocketstatus");
      };
      client.onclose = function (error) {
        console.log("clientWebSocket.onclose", error);
      };
      client.onerror = function (error) {
        console.log("clientWebSocket.onerror", error);
      };
      client.onmessage = function (message) {
        onMessage?.(message.data);
      };
    } catch (error) {
      console.error("initialize websocket fail");
      console.error(error);
    }

    return () => {
      clientRef.current?.close();
    };
  }, [url, clientRef]);

  return { send, close };
}

export default useWebSocket;
