import {useContext} from "react";
import Header from "./Header";
import {useNavigate} from "react-router-dom";
import DataContext from "../context/DataContext";
import SlideImgMain from "./SlideImgMain";


export default function Main() {

  const navigate = useNavigate();

  const data = useContext(DataContext);
  const toRandom = () => {
    navigate("/random");
  }
  const toIngredient = () => {
    navigate("/ingredient");
  }
  const toRank = () => {
    navigate("/rank");
  }
  return (<>
      <Header />
      <div className = "bg-gradient-to-r from-blue-300 via-blue-400 to-white px-3">
        {data.length === 0 ? <div></div> : <SlideImgMain type = {"main"} />}
        <div
          className = "flex gap-4 flex-col sm:flex-row justify-center items-center space-y-4 mb-0 sm:space-y-0 sm:space-x-4 ">
          <SlideImgMain text = {"메뉴 랜덤 추천"} onClick = {toRandom} />
          <SlideImgMain text = {"재료로 음식 선택"} onClick = {toIngredient} />
          <SlideImgMain text = {"좋아요 순위"} onClick = {toRank} />
        </div>
      </div>

    </>
  );
}