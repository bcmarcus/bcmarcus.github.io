import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import Recipe from "./Recipe";

import "/src/Assets/Dashboard/Recipe.css";

const RecipeList = ({ columns }) => {
  const [recipes, setRecipes] = useState([]);

  // useEffect(() => {
  //   const fetchRecipes = async () => {
  //     try {
  //       const response = await axios.get("your-firebase-function-url-here");
  //       setRecipes(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchRecipes();
  // }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Replace the Axios call with dummy data including random UUIDs
        const dummyRecipes = [
          {
            id: uuidv4(),
            name: "Spaghetti Bolognese",
            ingredients: ["Spaghetti", "Ground Beef", "Onion", "Tomato Sauce", "Garlic", "Basil"],
            nutritionalValues: { calories: 450, protein: 25, carbs: 70, fat: 10 },
          },
          {
            id: uuidv4(),
            name: "Veggie Burger",
            ingredients: ["Veggie Patty", "Whole Wheat Bun", "Lettuce", "Tomato", "Onion", "Pickles"],
            nutritionalValues: { calories: 350, protein: 18, carbs: 45, fat: 9 },
          },
          {
            id: uuidv4(),
            name: "Veggie Burger",
            ingredients: ["Veggie Patty", "Whole Wheat Bun", "Lettuce", "Tomato", "Onion", "Pickles"],
            nutritionalValues: { calories: 350, protein: 18, carbs: 45, fat: 9 },
          },
          {
            id: uuidv4(),
            name: "Veggie Burger",
            ingredients: ["Veggie Patty", "Whole Wheat Bun", "Lettuce", "Tomato", "Onion", "Pickles"],
            nutritionalValues: { calories: 350, protein: 18, carbs: 45, fat: 9 },
          },
          {
            id: uuidv4(),
            name: "Veggie Burger",
            ingredients: ["Veggie Patty", "Whole Wheat Bun", "Lettuce", "Tomato", "Onion", "Pickles"],
            nutritionalValues: { calories: 350, protein: 18, carbs: 45, fat: 9 },
          },
          {
            id: uuidv4(),
            name: "Chicken Caesar Salad",
            ingredients: ["Romaine Lettuce", "Grilled Chicken", "Croutons", "Parmesan Cheese", "Caesar Dressing"],
            nutritionalValues: { calories: 400, protein: 30, carbs: 20, fat: 22 },
          },
          {
            id: uuidv4(),
            name: "Pad Thai",
            ingredients: ["Rice Noodles", "Tofu", "Bean Sprouts", "Eggs", "Peanuts", "Tamarind Sauce"],
            nutritionalValues: { calories: 550, protein: 20, carbs: 85, fat: 15 },
          },
          {
            id: uuidv4(),
            name: "Green Smoothie",
            ingredients: ["Spinach", "Kale", "Banana", "Apple", "Almond Milk", "Chia Seeds"],
            nutritionalValues: { calories: 250, protein: 8, carbs: 45, fat: 5 },
          },
        ];
        setRecipes(dummyRecipes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className={`recipe-list recipe-list-${columns}`}>
      {recipes.map((recipe, index) => (
        <Recipe key={index} recipe={recipe} index={index + 1} />
      ))}
    </div>
  );
};

export default RecipeList;
