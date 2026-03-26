import { useEffect, useState } from "react";
import L from "leaflet";
import campusMap from "./Picture1.png";
import "./App.css";
import { Navbar,Drawer } from "./Navbar";
import "./index.css";
import Stats from "./Stats";
import Footer from "./Footer";

function App() {
  const [currentLocation, setCurrentLocation] = useState({ y: 400, x: 1030 });

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
    const marker = L.marker([currentLocation.y, currentLocation.x]).addTo(map);

    // Example WebSocket update
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl =
      import.meta.env.VITE_WS_URL ||
      `${wsProtocol}://${window.location.hostname}:3262/ws`;
    const ws = new WebSocket(wsUrl);


    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      const nextY = Number(data.lat ?? data.y);
      const nextX = Number(data.lng ?? data.x);

      if (!Number.isFinite(nextY) || !Number.isFinite(nextX)) {
        return;
      }

      marker.setLatLng([nextY, nextX]);
      setCurrentLocation({ y: nextY, x: nextX });
    };

    return () => {
      ws.close();
      map.remove();
    };

  }, []);

  return (
    <>
    <Drawer currentLocation={currentLocation}>
      <div id="map" className="map-container"></div>
    </Drawer >  
    <Footer />
    </>
  );
}

export default App;
