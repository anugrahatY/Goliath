function Stats(){
    return(
        <div className="stats stats-vertical lg:stats-horizontal shadow">
  <div className="stat">
    <div className="stat-title">No. of Devices</div>
    <div className="stat-value">1</div>
    <div className="stat-desc">Jan 1st - Feb 1st</div>
  </div>

  <div className="stat">
    <div className="stat-title">Current Location</div>
    <div className="stat-value">A535 - floor 5</div>
    <div className="stat-desc">↘ 400 (22%)</div>
  </div>

  <div className="stat">
    <div className="stat-title">Heading Towards</div>
    <div className="stat-value">A711- floor </div>
    <div className="stat-desc">↗ 90 (14%)</div>
  </div>
</div>
    )
}

export default Stats;