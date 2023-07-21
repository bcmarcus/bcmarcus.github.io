// IngredientsList.js
import React, { useState, useEffect } from "react";

// import { getAllIngredientsData } from "./api";
import Ingredient from "./Ingredient";

import "/src/Assets/Dashboard/Ingredients.css";

const IngredientsList = ({ columns }) => {
  const [ingredients, setIngredients] = useState([]);
  const columnClass = columns === 2 ? "ingredient-list-two-columns" : "ingredient-list-one-column";

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getAllIngredientsData();
  //     setIngredients(data);
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    // Dummy data
    const dummyData = [
      { name: "Ingredient 1", value: 20 },
      { name: "Ingredient 2", value: 40 },
      { name: "Ingredient 3", value: 60 },
      { name: "Ingredient 4", value: 80 },
    ];
    setIngredients(dummyData);
  }, []);

  return (
    <div className={`ingredient-list ${columnClass}`}>
      {ingredients.map((ingredient) => (
        <Ingredient key={ingredient.name} ingredient={ingredient} />
      ))}
    </div>
  );
};

export default IngredientsList;