// Ingredient.js
import React, { useState, useEffect } from "react";

import ProgressBar from "/src/Components/Tools/ProgressBar";
// import { getIngredientData } from "./api";

import "/src/Assets/Dashboard/Ingredients.css";

const Ingredient = ({ ingredient }) => {
  const { name, value } = ingredient;
  const tooltipText = `${name}: ${value}%`;

  return (
    <div className="ingredient" title={tooltipText}>
      <span className="ingredient-name">{name}</span>
      <ProgressBar value={value} />
    </div>
  );
};

export default Ingredient;