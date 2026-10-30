
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import campusMap from "/cbi2.png";
import "./App.css";
import { Drawer } from "./Navbar";
import "./index.css";
import Footer from "./Footer";
import { NODES, GRAPH } from "./nodes";
import { useMarkerTracking } from "./utils/useMarkerTracking";

// Coordinate scaling: original 1920 x 1080 -> map 1350 x 780
const SCALE_X = 1350 / 1920;
const SCALE_Y = 780 / 1080;

function findPath(start, end) {
  const queue = [[start]];
  const visited = new Set();

  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === end) {
      return path;
    }

    if (!visited.has(node)) {
      visited.add(node);

      for (const n of GRAPH[node] || []) {
        if (!visited.has(n)) {
          queue.push([...path, n]);
        }
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
  const { position, trackingData, connected } = useMarkerTracking();

  const [currentLocation, setCurrentLocation] = useState({
    x: 1030 * SCALE_X,
    y: 400 * SCALE_Y,
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const roadsRef = useRef([]);

  const destinationRef = useRef("R4");

  const bounds = [
    [0, 0],
    [780, 1350],
  ];

  const center_map = L.latLng(
    bounds[1][0] / 2,
    bounds[1][1] / 2
  );

  function updatePath(current) {
    if (!mapRef.current) return;

    const destination = destinationRef.current;
    const startNode = getNearestNode(current);

    if (!startNode || !NODES[destination]) return;

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

  // Initialize map, marker, and graph.
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map", {
      crs: L.CRS.Simple,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      maxZoom: 2,
      center: center_map,
    });

    L.imageOverlay(campusMap, bounds).addTo(map);

    map.fitBounds(bounds);
    map.setMinZoom(map.getZoom());

    mapRef.current = map;

    // Initial position uses the same scaled coordinates as NODES.
    const marker = L.marker([
      currentLocation.y,
      currentLocation.x,
    ]).addTo(map);

    markerRef.current = marker;

    const drawn = new Set();

    for (const node in GRAPH) {
      for (const neighbor of GRAPH[node] || []) {
        if (!NODES[node] || !NODES[neighbor]) continue;

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

        roadsRef.current.push(line);
      }
    }

    updatePath(currentLocation);

    return () => {
      map.remove();

      mapRef.current = null;
      markerRef.current = null;
      polylineRef.current = null;
      roadsRef.current = [];
    };
  }, []);

  // FIX: Scale incoming coordinates to match NODES.
  useEffect(() => {
    if (!markerRef.current) return;

    const rawX = Number(position.x);
    const rawY = Number(position.y);

    if (
      !Number.isFinite(rawX) ||
      !Number.isFinite(rawY)
    ) {
      return;
    }

    const x = rawX * SCALE_X;
    const y = rawY * SCALE_Y;

    const newLoc = { x, y };

    console.log("Raw coordinates:", { rawX, rawY });
    console.log("Scaled marker coordinates:", newLoc);

    // Leaflet expects [y, x].
    markerRef.current.setLatLng([y, x]);

    setCurrentLocation(newLoc);
    updatePath(newLoc);
  }, [position]);

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
