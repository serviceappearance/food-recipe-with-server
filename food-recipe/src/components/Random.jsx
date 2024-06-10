import Header from "./Header";
import DataContext from "../context/DataContext";
import SlideImg_Random_Top from "./SlideImg_Random_Top";
import SlideImg_Random_Bottom from "./SlideImg_Random_Bottom";
import SlideImgMain from "./SlideImgMain";
import { useContext, useEffect, useState } from "react";

export default function Random() {
  const data = useContext(DataContext);
  const [text, setText] = useState(""); // 초기 상태를 data로 설정합니다.

  // 선택된 데이터를 업데이트하는 함수입니다.
  const onClick = (text) => {
    setText(text);
  console.log(text);
  };


  return (
    <>
      <Header />

      <div className=" bg-gradient-to-r from-blue-300 via-blue-400 to-white">
      {data !== null ? (
        <div className = "rounded-3xl shadow-2xl p-3 mt-0 pt-0 m-2 grid grid-cols-1 sm:grid-cols-4 gap-4 justify-center items-center mt-14">
          <label onClick = {() => onClick("반찬")} className = "grid-item">
                <SlideImg_Random_Top text = {"반찬"} />
            </label>
            <label onClick = {() => onClick("국&찌개")} className = "grid-item">
                <SlideImg_Random_Top text = {"국&찌개"} />
            </label>
            <label onClick = {() => onClick("후식")} className = "grid-item">
                <SlideImg_Random_Top text = {"후식"} />
            </label>
            <label onClick = {() => onClick("밥")} className = "grid-item">
                <SlideImg_Random_Top text = {"밥"} />
            </label>
          </div>
      ) : (
        <div>로딩중...</div>
      )}
        <div className="mt-3.5 pb-3">
      <SlideImg_Random_Bottom text = {text}></SlideImg_Random_Bottom>
        </div>
      </div>

    </>
  );
}