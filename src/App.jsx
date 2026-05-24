import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import campusMap from "./cbi2.png";
import "./App.css";
import { Drawer } from "./Navbar";
import "./index.css";
import Footer from "./Footer";

const NODES = {
  // LEFT COMB MAIN SPINE

  L1: { x: 420, y: 420 },
  L2: { x: 420, y: 500 },
  L3: { x: 420, y: 580 },
  L4: { x: 420, y: 660 },
  L5: { x: 420, y: 740 },
  L6: { x: 420, y: 820 },
  L7: { x: 420, y: 900 },

  // LEFT BRANCHES

  LL1: { x: 320, y: 420 },
  LL2: { x: 320, y: 500 },
  LL5: { x: 320, y: 740 },

  // RIGHT BRANCHES

  LR1: { x: 520, y: 420 },
  LR2: { x: 520, y: 500 },
  LR3: { x: 520, y: 580 },
  LR4: { x: 520, y: 660 },
  LR5: { x: 520, y: 740 },
  LR6: { x: 520, y: 820 },
  LR7: { x: 520, y: 900 },

  // HORIZONTAL SPINE

  H1: { x: 533, y: 270 },
  H2: { x: 635, y: 270 },
  H3: { x: 737, y: 270 },
  H4: { x: 839, y: 270 },
  H5: { x: 941, y: 270 },
  H6: { x: 1043, y: 270 },
  H7: { x: 1145, y: 270 },
  H8: { x: 1247, y: 270 },
  H9: { x: 1349, y: 270 },

  // UPWARD NODES

  HU1: { x: 533, y: 170 },
  HU2: { x: 635, y: 170 },
  HU3: { x: 737, y: 170 },
  HU4: { x: 839, y: 170 },
  HU5: { x: 941, y: 170 },
  HU6: { x: 1043, y: 170 },
  HU7: { x: 1145, y: 170 },
  HU8: { x: 1247, y: 170 },
  HU9: { x: 1349, y: 170 },

  // RIGHT COMB MAIN SPINE

  R1: { x: 1505, y: 450 },
  R2: { x: 1505, y: 600 },
  R3: { x: 1505, y: 780 },
  R4: { x: 1505, y: 940 },

  // LEFT SIDE

  RL1: { x: 1405, y: 450 },
  RL2: { x: 1405, y: 600 },
  RL3: { x: 1405, y: 780 },
  RL4: { x: 1405, y: 940 },

  // RIGHT SIDE

  RR1: { x: 1605, y: 450 },
  RR2: { x: 1605, y: 600 },
  RR3: { x: 1605, y: 780 },
  RR4: { x: 1605, y: 940 },
};

const GRAPH = {
  // LEFT SPINE

  L1: ["L2", "LL1", "LR1", "H1"],
  L2: ["L1", "L3", "LL2", "LR2"],
  L3: ["L2", "L4", "LR3"],
  L4: ["L3", "L5", "LR4"],
  L5: ["L4", "L6", "LL5", "LR5"],
  L6: ["L5", "L7", "LR6"],
  L7: ["L6", "LR7"],

  // LEFT BRANCHES

  LL1: ["L1"],
  LL2: ["L2"],
  LL5: ["L5"],

  // RIGHT BRANCHES

  LR1: ["L1"],
  LR2: ["L2"],
  LR3: ["L3"],
  LR4: ["L4"],
  LR5: ["L5"],
  LR6: ["L6"],
  LR7: ["L7"],

  // HORIZONTAL COMB

  H1: ["H2", "HU1"],
  H2: ["H1", "H3", "HU2"],
  H3: ["H2", "H4", "HU3"],
  H4: ["H3", "H5", "HU4"],
  H5: ["H4", "H6", "HU5"],
  H6: ["H5", "H7", "HU6"],
  H7: ["H6", "H8", "HU7"],
  H8: ["H7", "H9", "HU8"],
  H9: ["H8", "HU9", "R1"],

  // UPWARD NODES

  HU1: ["H1"],
  HU2: ["H2"],
  HU3: ["H3"],
  HU4: ["H4"],
  HU5: ["H5"],
  HU6: ["H6"],
  HU7: ["H7"],
  HU8: ["H8"],
  HU9: ["H9"],

  // RIGHT COMB

  R1: ["R2", "RL1", "RR1", "H9"],
  R2: ["R1", "R3", "RL2", "RR2"],
  R3: ["R2", "R4", "RL3", "RR3"],
  R4: ["R3", "RL4", "RR4"],

  RL1: ["R1"],
  RL2: ["R2"],
  RL3: ["R3"],
  RL4: ["R4"],

  RR1: ["R1"],
  RR2: ["R2"],
  RR3: ["R3"],
  RR4: ["R4"],
};

function findPath(start, end) {
  const queue = [[start]];
  const visited = new Set();

  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === end) return path;

    if (!visited.has(node)) {
      visited.add(node);

      for (const n of GRAPH[node]) {
        queue.push([...path, n]);
      }
    }
  }

  return null;
}

function getNearestNode(current) {
  let min = Infinity;
  let closest = null;

  for (const key in NODES) {
    const d = Math.hypot(
      current.x - NODES[key].x,
      current.y - NODES[key].y
    );

    if (d < min) {
      min = d;
      closest = key;
    }
  }

  return closest;
}

function App() {
  const [currentLocation, setCurrentLocation] = useState({
    y: 400,
    x: 1030,
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const roadsRef = useRef([]);

  const destinationRef = useRef("R4");

  function updatePath(current) {
    if (!mapRef.current) return;

    const destination = destinationRef.current;

    const startNode = getNearestNode(current);

    const path = findPath(startNode, destination);

    if (!path) return;

    const latlngs = path.map((name) => [
      NODES[name].y,
      NODES[name].x,
    ]);

    if (polylineRef.current) {
      polylineRef.current.remove();
    }

    polylineRef.current = L.polyline(latlngs, {
      color: "blue",
      weight: 8,
    }).addTo(mapRef.current);

    polylineRef.current.bringToFront();
  }

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: -1.5,
    });

    const bounds = [
      [0, 0],
      [1080, 1920],
    ];

    L.imageOverlay(campusMap, bounds).addTo(map);

    map.fitBounds(bounds);

    map.setView([375, 500], 0);

    mapRef.current = map;

    // USER MARKER

    const marker = L.marker([400, 1030]).addTo(map);

    markerRef.current = marker;

    // DRAW GRAPH

    const drawn = new Set();

    for (const node in GRAPH) {
      for (const neighbor of GRAPH[node]) {
        const key = [node, neighbor].sort().join("-");

        if (drawn.has(key)) continue;

        drawn.add(key);

        const p1 = NODES[node];
        const p2 = NODES[neighbor];

        const line = L.polyline(
          [
            [p1.y, p1.x],
            [p2.y, p2.x],
          ],
          {
            color: "grey",
            weight: 8,
            opacity: 1,
          }
        ).addTo(map);

        line.bringToFront();

        roadsRef.current.push(line);
      }
    }

    updatePath(currentLocation);

    // LIVE TRACKING WEBSOCKET

    const ws = new WebSocket("ws://172.16.216.124:3262");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const nextY = Number(data.y);
        const nextX = Number(data.x);

        if (
          !Number.isFinite(nextY) ||
          !Number.isFinite(nextX)
        ) {
          return;
        }

        marker.setLatLng([nextY, nextX]);

        const newLoc = {
          y: nextY,
          x: nextX,
        };

        setCurrentLocation(newLoc);

        updatePath(newLoc);

      } catch (err) {
        console.error(err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };

    ws.onopen = () => {
      console.log("Connected to tracking backend");
    };

    return () => {
      ws.close();

      map.remove();

      mapRef.current = null;
    };

  }, []);

  return (
    <>
      <Drawer
        currentLocation={currentLocation}
        setDestination={(dest) => {
          destinationRef.current = dest;

          updatePath(currentLocation);
        }}
      >
        <div id="map" className="map-container"></div>
      </Drawer>

      <Footer />
    </>
  );
}

export default App;