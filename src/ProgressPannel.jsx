function ProgressPanel() {
  return (
    <div className="flex flex-col gap-6 w-64">

      {/* Battery */}
      <div>
        <div className="flex justify-between text-sm">
          <span>Battery</span>
          <span>82%</span>
        </div>
        <progress className="progress progress-success w-50" value="82" max="100"></progress>
      </div>

      {/* Signal */}
      <div>
        <div className="flex justify-between text-sm">
          <span>Signal Strength</span>
          <span>65%</span>
        </div>
        <progress className="progress progress-warning w-50" value="65" max="100"></progress>
      </div>

      {/* Temperature */}
      <div>
        <div className="flex justify-between text-sm">
          <span>Temperature</span>
          <span>36°C</span>
        </div>
        <progress className="progress progress-info w-50" value="36" max="100"></progress>
      </div>

    </div>
  );
}

export default ProgressPanel;