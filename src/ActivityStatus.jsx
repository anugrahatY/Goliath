import ProgressPanel from "./ProgressPannel";
function ActivityStatus({ status }) {
  if (status === "active")
    return <div className="badge badge-outline badge-success">Active</div>;
  else if (status === "idle")
    return <div className="badge badge-outline badge-warning">Idle</div>;
  else
    return <div className="badge badge-outline badge-error">Disconnected</div>;
}

function ActivityDrawer() {
  const status = "active";

  return (
    <div className="collapse bg-base-150">

      {/* Hidden checkbox (controls collapse) */}
      <input type="checkbox" className="peer" />

      {/* Use badge as trigger */}
      <div className="collapse-title cursor-pointer">
        <ActivityStatus status={status} />
      </div>

      {/* Content */}
      <div className="collapse-content text-sm">
        <ProgressPanel/>
      </div>

    </div>
  );
}

export default ActivityDrawer;