import {useContext, useEffect, useState} from 'react';
import DataContext from '../context/DataContext';
import {useNavigate} from "react-router-dom";

export default function IngredientShow({ingredients}) {
  const data = useContext(DataContext);
  const [selectedIngredient, setSelectedIngredient] = useState([]);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const filteredIngredients = data.filter(item =>
      ingredients.every(ingredient => item.RCP_PARTS_DTLS.includes(ingredient))
    );
    setSelectedIngredient(filteredIngredients);
  }, [ingredients, data]);

  const onClick = (index) => {
    setCurrentIndex(index); 
    navigate("/recipe", {state: {recipeData: selectedIngredient[index]}});
  };

  return (
    <>
      <div className = "grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 p-4">
        {selectedIngredient.map((item, index) => (
          <div key = {index} className = "flex flex-col overflow-hidden bg-white rounded-3xl shadow-lg">
            <div className = "h-80 w-full flex justify-center items-center overflow-hidden hover:skew-y-3">
              <img src = {item.ATT_FILE_NO_MK} alt = {item.RCP_NM} className = "w-full h-full object-cover"
                   onClick = {() => onClick(index)} />
            </div>
            <div className = "p-2 flex justify-center items-center">
              <span className = "text-sm font-semibold text-gray-700">{item.RCP_NM}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}