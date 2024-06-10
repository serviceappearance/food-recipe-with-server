import {useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import DataContext from "../context/DataContext";

export default function SlideImg_Random_Bottom({text}) {

  const data = useContext(DataContext);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fitData, setFitData] = useState([]);
  const imgSrcList = useMemo(() => fitData ? fitData.map(item => item.ATT_FILE_NO_MK): []);

  useEffect(() => {
    // text 값에 따라 fitData를 필터링합니다.
    const newFitData = text !== ''
      ? data.filter((item) => item.RCP_PAT2.includes(text))
      : data;
    setFitData(newFitData);
    // console.log(fitData);
    setCurrentIndex(Math.floor(Math.random() * imgSrcList.length));

    // setCurrentIndex(1); // fitData가 변경될 때마다 currentIndex를 0으로 리셋합니다.
  }, [text, data, imgSrcList.length]);


  // fitData를 원소가 있는 배열로 초기화합니다.

  // console.log(imgSrcList.length);

  useEffect(() => {
    if (!imgSrcList.length) return; // imgSrcList가 비어있으면 인터벌 설정을 건너뜀
    const interval = setInterval(() => {
      nextButton();
    }, 3000); // 3초마다 실행

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, [fitData.length]);

  if (!fitData || !fitData.length) {
    return <div>Loading...</div>;
  }
  const nextButton = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imgSrcList.length);
  };

  const prevButton = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fitData.length) % imgSrcList.length);
  };

  const onClick = () => {
    navigate("/recipe", {state: {recipeData: fitData[currentIndex]}});
    console.log(fitData[currentIndex]);
  };


  return (
    <div className = {`relative w-full rounded-3xl mb-0 mr-1 ml-1 `} onClick = {onClick}>
      {/* 화살표 버튼만을 위한 컨테이너 */}
      <div className = "absolute inset-0 z-10 flex justify-between items-center w-full">
        {/* 이전 버튼 */}
        <button
          className = "z-20 absolute left-4 top-1/2 -translate-y-1/2 text-[500%] text-blue-200"
          onClick = {(e) => {
            e.stopPropagation(); // 이벤트 전파 중지
            prevButton();
          }}
        >
          &lt;
        </button>


        {/* 다음 버튼 */}
        <button
          className = "text-4xl z-20 absolute right-4 top-1/2 -translate-y-1/2 text-[500%] text-blue-200"
          onClick = {(e) => {
            e.stopPropagation(); // 이벤트 전파 중지
            nextButton();
          }}
        >
          &gt;
        </button>
      </div>

      {/* 기존 이미지 슬라이더 컨테이너 (사이즈 유지) */}
      <div className = "max-w-md mx-auto relative h-[400px] "> {/* or 원하는 높이 값 */}
        {/* 이미지 슬라이드 */}
        <div className = "flex overflow-hidden h-full p-0 rounded-3xl shadow-lg">
          {imgSrcList.map((el, index) => (
            <img
              key = {index}
              src = {el}
              className = {`transition-opacity duration-1000 ease-linear object-cover w-full h-full rounded-3xl border-2 border-white absolute ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
              alt = "슬라이드 이미지"
            />
          ))}
        </div>
      </div>
    </div>


  );
}