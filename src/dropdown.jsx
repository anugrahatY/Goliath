import { useRef } from "react";
function DropStat({ onSelect }) {
  const popoverRef = useRef(null);

  const options = ["C201","C202","C203","C204","C205","C206","C207","C208"];

  const handleSelect = (opt) => {
    onSelect(opt);                 // update parent
    popoverRef.current?.hidePopover(); // close dropdown
  };

  return (
    <div>
      <button
        className="btn"
        popoverTarget="popover-1"
        style={{ anchorName: "--destination-selector" }}
      >
        Select Destination
      </button>

      <ul
        ref={popoverRef}
        className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id="popover-1"
        style={{ positionAnchor: "--destination-selector" }}
      >
        {options.map((opt) => (
          <li key={opt}>
            <a onClick={() => handleSelect(opt)}>{opt}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropStat;