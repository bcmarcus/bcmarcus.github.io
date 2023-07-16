import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import Recipe from './Recipe/Recipe';
import IngredientList from './Ingredients/IngredientsList';
import ProgressBar from "/src/Components/Tools/ProgressBar";

import '/src/Assets/Dashboard/DashboardHome.css';
import RecipeList from './Recipe/RecipeList';

function DashboardHome() {
  function handleClick(recipe) {
    console.log('Recipe clicked:', recipe);
  }

  const data1 = [
    { name: 'A', value: 100 },
    { name: 'B', value: 300 },
    { name: 'C', value: 200 },
  ];

  const data2 = [
    { name: 'A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'C', uv: 2000, pv: 9800, amt: 2290 },
  ];

  const recipes = [
    { id: 1, name: 'Recipe 1' },
    { id: 2, name: 'Recipe 2' },
    { id: 3, name: 'Recipe 3' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard-home">
      <div className="progress-container">
        <ProgressBar value={50} />
      </div>
      <div className="dashboard-sections">
        <div className="recipes-section">
          <h2>Past Recipes</h2>
          <RecipeList columns={1}/>
        </div>
        <div className="ingredients-section">
          <h2>Ingredient Status</h2>
          <IngredientList columns={2}/>
        </div>
      </div>
      <div className="charts-section">
        <h2>Analytics</h2>
        <div className="content">
          <LineChart width={500} height={300} data={data1} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="linear" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
          <BarChart width={500} height={300} data={data2} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;