import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "/src/Assets/Dashboard/Recipe.css";

const Recipe = ({ recipe }) => {
  const navigate = useNavigate();

  const handleCreate = () => {
    // Call the Firebase Function using Axios here
  };

  const handleLearnMore = () => {
    const domain = window.location.origin;
    const recipeUrl = `${domain}/recipe/${recipe.id}`;
    navigate(`/recipe/${recipe.id}`);
    console.log("Recipe URL:", recipeUrl);
  };

  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the isOpen state
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`recipe ${isOpen ? "open" : ""}`} onClick={handleClick}>
      <div className="recipe-content">
        <h3>{recipe.name}</h3>
      </div>
      <div className="dropdown">
        <button onClick={handleCreate}>Create</button>
        <button onClick={handleLearnMore}>Learn More</button>
        <div className="nutritional-values">
          <h4>Nutritional Values</h4>
          <ul>
            <li>Calories: {recipe.nutritionalValues.calories}</li>
            <li>Fat: {recipe.nutritionalValues.fat}g</li>
            <li>Carbohydrates: {recipe.nutritionalValues.carbohydrates}g</li>
            <li>Protein: {recipe.nutritionalValues.protein}g</li>
          </ul>
        </div>
        <div className="ingredients">
          <h4>Ingredients</h4>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Recipe;