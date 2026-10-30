import Stats from "./Stats";

function Drawer({ children, currentLocation }) {
  return (
    <div className="drawer lg:drawer-open h-screen">
      <input
        id="my-drawer-3"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content flex flex-col h-screen">
        {children}

        <label
          htmlFor="my-drawer-3"
          className="btn drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          <h1 className="text-4xl font-extrabold tracking-wide mb-6 pl-3">
            Goliath
          </h1>

          <Stats currentLocation={currentLocation} />

          <li>
            <a>LiDAR Mapping</a>
          </li>

          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export { Drawer };