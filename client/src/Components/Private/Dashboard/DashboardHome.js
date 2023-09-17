import React from 'react';

import '/src/Assets/Private/Dashboard/DashboardHome.css';

function DashboardHome() {

  return (
    <div className="dashboard-home">
      <h2>To enable phone calls and texts, please visit </h2>

      <label for="calls">Allow calls?</label>
      <input type="checkbox" id="calls" name="calls"/>

      <br/>

      <label for="texts">Allow texts?</label>
      <input type="checkbox" id="texts" name="texts"/>
    </div>
  );
}

export default DashboardHome;