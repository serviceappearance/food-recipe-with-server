import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './index.css';
import Random from './components/Random';
import Main from './components/Main';
import Rank from './components/Rank';
import Recipe from './components/Recipe';
import LikePage from './components/like-components/LikePage';
import UserRecipe from './components/like-components/UserRecipe';
import EditRecipe from './components/recipe-components/EditPage';
import Ingredient from './components/IngredientChoose';
import DataContext from './context/DataContext';
import IngredientContext from './context/IngredientContext';


const App = () => {
  const [data, setData] = useState([]);
  const [ingredient, setIngredient] = useState([]);
  const [url, setUrl] = useState("");

  const apiKey = process.env.REACT_APP_FOOD_API_KEY;
  useEffect(() => {
    setUrl(`https://openapi.foodsafetykorea.go.kr/api/${apiKey}/COOKRCP01/json/1/100`);
  }, []);

  useEffect(() => {
    if (!url) return;

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        if (data && data.COOKRCP01) {
          setData(data.COOKRCP01.row);
        }
      })
      .catch(error => console.error("Fetching Error:", error));

  }, [url]);

  useEffect(() => {
    if (data && data.length > 0) {
      const ingredientsList = data.map(item => {
        const matches = item.RCP_PARTS_DTLS.match(/([가-힣]+)\s+\d+g[^,)]*/g) || [];
        return matches.map(match => {
          const matchParts = match.match(/([가-힣]+)/);
          return matchParts && matchParts[1];
        });
      }).flat();

      const uniqueIngredients = [...new Set(ingredientsList)];

      uniqueIngredients.sort((a, b) => a.localeCompare(b));

      setIngredient(uniqueIngredients);
    }
  }, [data]);

  return (
    <IngredientContext.Provider value={ingredient}>
      <DataContext.Provider value={data}>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/random" element={<Random />} />
            <Route path="/recipe" element={<Recipe />} />
            <Route path="/user_recipe" element={<UserRecipe />} />
            <Route path="/user_recipe/:recipeId" element={<UserRecipe />} />
            <Route path="/edit_recipe" element={<EditRecipe />} />
            <Route path="/like_page" element={<LikePage />} />
            <Route path="/ingredient" element={<Ingredient />} />
            <Route path="/rank" element={<Rank />} />
          </Routes>
        </Router>
      </DataContext.Provider>
    </IngredientContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);