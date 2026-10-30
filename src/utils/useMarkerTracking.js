
import { useEffect, useState } from "react";

const WS_URL =
  "wss://goliath-backend.nicemoss-f88dce2e.centralindia.azurecontainerapps.io";

export function useMarkerTracking() {
  const [position, setPosition] = useState({
    x: 1030,
    y: 400,
  });

  const [trackingData, setTrackingData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let ws;
    let reconnectTimer;
    let stopped = false;

    function connect() {
      if (stopped) return;

      console.log("[WS] Connecting:", WS_URL);
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("[WS] Connected");
        setConnected(true);
      };

      ws.onmessage = (event) => {
        console.log("[WS] Received:", event.data);

        try {
          const data = JSON.parse(event.data);

          if (data.x == null || data.y == null) {
            console.warn("[WS] Missing coordinates:", data);
            return;
          }

          const x = Number(data.x);
          const y = Number(data.y);

          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            console.warn("[WS] Invalid coordinates:", data);
            return;
          }

          setPosition({ x, y });
          setTrackingData(data);
        } catch (error) {
          console.error("[WS] Invalid JSON:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("[WS] Error:", error);
      };

      ws.onclose = (event) => {
        console.warn(
          "[WS] Closed:",
          event.code,
          event.reason
        );

        setConnected(false);

        if (!stopped) {
          reconnectTimer = setTimeout(connect, 2000);
        }
      };
    }

    connect();

    return () => {
      stopped = true;
      clearTimeout(reconnectTimer);

      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, []);

  return { position, trackingData, connected };
}
