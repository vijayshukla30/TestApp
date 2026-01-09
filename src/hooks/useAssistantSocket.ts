import { useRef } from "react";

export default function useAssistantSocket({
  agent,
  consumer,
  userId,
  onMessage,
}: any) {
  const wsRef = useRef<WebSocket | null>(null);
  const pendingQueue = useRef<any[]>([]);

  const connect = () => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const url = `ws://${agent.seoName}.${process.env.EXPO_PUBLIC_WSS_URL}`;
    console.log("url :>> ", url);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "metadata",
          consumerId: consumer.uuid,
          userId,
          consumerAssistantId: agent.uuid,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      );
      // 🔥 Flush queued messages
      pendingQueue.current.forEach((msg) => ws.send(msg));
      pendingQueue.current = [];
    };

    ws.onmessage = (e) => {
      if (typeof e.data === "string") {
        onMessage?.(JSON.parse(e.data));
      }
    };

    ws.onerror = (e) => {
      console.log("❌ WS error", e);
    };

    return ws;
  };

  const safeSend = (payload: string | Blob) => {
    if (!wsRef.current) {
      connect();
      pendingQueue.current.push(payload);
      return;
    }

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(payload);
    } else {
      pendingQueue.current.push(payload);
    }
  };

  const sendText = (text: string) => {
    safeSend(
      JSON.stringify({
        type: "user_message",
        message: text,
      })
    );
  };

  const sendAudio = (blob: Blob) => {
    safeSend(blob);
  };

  const close = () => {
    wsRef.current?.close();
    wsRef.current = null;
    pendingQueue.current = [];
  };
  return { wsRef, connect, sendText, sendAudio, close };
}
