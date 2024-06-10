import Header from "./Header";
import { useContext, useEffect, useState } from "react";
import IngredientContext from "../context/IngredientContext";

// props로 onIngredientSelect, selectedIngredients를 받습니다.
export default function IngredientList({ onIngredientSelect, selectedIngredients }) {
  const ingredients = useContext(IngredientContext);
  const [showAll, setShowAll] = useState(false);

  // 상태 관리 로직을 props에서 받은 selectedIngredients로 초기화합니다.
  const [selectedIngredientsState, setSelectedIngredientsState] = useState(selectedIngredients);

  const [checkedState, setCheckedState] = useState(
    ingredients ? new Array(ingredients.length).fill(false) : []
  );

  useEffect(() => {
    if (ingredients) {
      setCheckedState(new Array(ingredients.length).fill(false));
    }
  }, [ingredients]);

  useEffect(() => {
    // selectedIngredients props가 변경될 때마다 상태를 업데이트합니다.
    setSelectedIngredientsState(selectedIngredients);
  }, [selectedIngredients]);

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    // 현재 체크된 재료 목록을 계산
    const selectedIngredients = ingredients.filter((_, index) => updatedCheckedState[index]);

    // 선택된 재료 목록을 업데이트
    onIngredientSelect(selectedIngredients);
  };
  const visibleIngredients = showAll ? ingredients : ingredients?.slice(0, 10) || [];

  if (!ingredients || ingredients.length === 0) {
    return (
      <>
        <Header />
        <div className="p-4">로딩중입니다 ^~^</div>
      </>
    );
  }

  return (
    <>
      <div className="bg-slate-50 p-8 rounded-lg shadow-md">
        <form className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-10 gap-4">
          {visibleIngredients.map((ingredient, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`custom-checkbox-${index}`}
                name={ingredient}
                value={ingredient}
                checked={checkedState[index]}
                onChange={() => handleOnChange(index)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 rounded"
              />
              <label
                htmlFor={`custom-checkbox-${index}`}
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {ingredient}
              </label>
            </div>
          ))}
        </form>

        {ingredients.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 text-blue-700 hover:text-blue-900 transition duration-300 ease-in-out bg-white hover:bg-blue-100 text-sm py-2 px-4 rounded shadow"
          >
            {showAll ? '적게 보기' : '더 보기'}
          </button>
        )}
      </div>
    </>
  );
}