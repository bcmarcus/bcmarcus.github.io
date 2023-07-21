// ProgressBar.js
import React from "react";
import "/src/Assets/Tools/ProgressBar.css";

const ProgressBar = ({ value }) => {
  const red = value < 50 ? 255 : Math.round(255 - (value - 50) * 5.1);
  const green = value > 50 ? 255 : Math.round(value * 5.1);
  const blue = 0;

  const progressBarStyle = {
    width: `${value}%`,
    backgroundColor: `rgb(${red}, ${green}, ${blue})`,
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={progressBarStyle}></div>
    </div>
  );
};

export default ProgressBar;