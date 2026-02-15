import { useEffect } from "react";
import L from "leaflet";
import campusMap from "./maproom.png";
import "./App.css";

function App() {
  useEffect(() => {

    // Create map with simple coordinate system
    const map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: -1,
    });

    // Define image size (IMPORTANT)
    // Replace with YOUR image pixel dimensions
    const bounds = [
      [0, 0],        // top-left
      [1000, 1500],  // bottom-right (height, width)
    ];

    // Add image overlay
    L.imageOverlay(campusMap, bounds).addTo(map);

    map.fitBounds(bounds);

    // Example marker
    const marker = L.marker([500, 750]).addTo(map);

    // Example WebSocket update
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket("ws://localhost:3262/ws");


    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Now data.lat and data.lng must be pixel coordinates
      marker.setLatLng([data.lat, data.lng]);
    };

    return () => {
      ws.close();
      map.remove();
    };

  }, []);

  return <div id="map" className="map-container" />;
}

export default App;
