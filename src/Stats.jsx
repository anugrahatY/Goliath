import { useState } from "react";
import DropStat from "./dropdown";
import ActivityDrawer from "./ActivityStatus";
function Stats({ currentLocation }) {
  const landmarks = [
    { name: "C201", x: 810, y: 715 },
    { name: "C202", x: 990, y: 715 },
    { name: "C203", x: 660, y: 715 },
    { name: "C204", x: 510, y: 775 },
    { name: "C205", x: 570, y: 400 },
    { name: "C206", x: 890, y: 400 },
    { name: "C207", x: 1030, y: 400 },
  ];

  const [destination, setDestination] = useState("C202"); // default
  
  const nearestLandmark = currentLocation
    ? landmarks.reduce((closest, landmark) => {
        const closestDistance = Math.hypot(
          currentLocation.x - closest.x,
          currentLocation.y - closest.y
        );
        const landmarkDistance = Math.hypot(
          currentLocation.x - landmark.x,
          currentLocation.y - landmark.y
        );

        return landmarkDistance < closestDistance ? landmark : closest;
      }, landmarks[0])
    : null;

  const currentLocationLabel = currentLocation
    ? `X: ${Math.round(currentLocation.x)}, Y: ${Math.round(currentLocation.y)}`
    : "Waiting for map updates...";

  return (
      <div className="stats stats-vertical shadow bg-neutral text-neutral-content">
        <h1 className="text-2xl font-bold tracking-wide m-2 p-1 pl-3">
        Rover-1
        </h1> 
          
          <div className="stat">
            <div className="stat-title">Status</div>
            <ActivityDrawer/>
            <div className="stat-desc">last updated : Jan 1st 5:50pm </div>
          </div>

          <div className="stat">
            <div className="stat-title">Current Location</div>
            <div className="stat-value">{nearestLandmark?.name || "Unknown"}</div>
            <div className="stat-desc">{currentLocationLabel}</div>
          </div>


          <div className="stat">
            <div className="stat-title">Heading towards</div>
            <div className="stat-value">{destination}</div>
            <div className="stat-desc">Distance remaining : 100m</div>
            <div className="stat-desc">ETA : 5min</div>
          </div>

          <div className="stat">
            <DropStat onSelect={setDestination} />
          </div>

          
      </div>
);}

export default Stats;
