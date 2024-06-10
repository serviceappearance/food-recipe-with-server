// IngredientChoose 컴포넌트
import React, {useContext, useMemo, useState} from 'react';
import Header from "./Header";
import IngredientContext from "../context/IngredientContext";
import IngredientList from "./IngredientList";
import IngredientShow from "./IngredientShow";

export default function IngredientChoose() {
  const ingredient = useContext(IngredientContext);
  const [selectedIngredients, setSelectedIngredients] = useState([]); // 선택된 재료의 상태를 여기서 관리
  const handleSelectIngredient = (selected) => {
    setSelectedIngredients(selected);
  };

  return (
    <>
    <div className = "flex flex-col relative"> {/* 상위 요소에 relative 추가 */}
      <Header />
      <div className = "top-0 pt-20 md:pt-14 w-full"> {/* pt-20 또는 적절한 값으로 조정 */}
        {/* IngredientList에 선택 관련 props 전달 */}
        <IngredientList onIngredientSelect = {handleSelectIngredient} selectedIngredients = {selectedIngredients} />
      </div>
    </div>
        <IngredientShow ingredients = {selectedIngredients} />

    </>
  );
}