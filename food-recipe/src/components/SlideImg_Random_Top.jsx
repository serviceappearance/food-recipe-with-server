import {useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import DataContext from "../context/DataContext";

export default function SlideImg_Random_Top({text}) {
  const data = useContext(DataContext);
  const fitData = data.find((item) => item.RCP_PARTS_DTLS.includes(text));
  const [currentIndex, setCurrentIndex] = useState();
  const imgSrcList = useMemo(() =>
    data ? data
        .filter(item => item.RCP_PAT2.includes(text))
        .map(item => item.ATT_FILE_NO_MK)
      : [], [data, text]);
  const navigate = useNavigate();
  useEffect(() => {
    if (data.length) {
      setCurrentIndex(Math.floor(Math.random() * imgSrcList.length));
    }
  }, [data.length, imgSrcList.length]); // 의존성 배열 업데이트

  if (!data || !data.length) {
    return <div>Loading...</div>;
  }

  const nextButton = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imgSrcList.length);
  };

  const prevButton = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imgSrcList.length) % imgSrcList.length);
  };


  return (
    <>
      <div className = {`relative w-full bg-white rounded-3xl mb-0 mr-1 ml-1 hover:skew-y-3 `}>
        <div className = "max-w-md mx-auto relative h-[400px] bg-white rounded-3xl">
          {/* 이미지 슬라이드 */}
          <div className = "flex overflow-hidden h-full p-0 rounded-3xl shadow-lg">

            {imgSrcList.map((el, index) => (
              <img
                key = {index}
                src = {el}
                className = {`transition-opacity duration-1000 ease-linear object-cover w-full h-full rounded-3xl border-2 border-white absolute ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className = "absolute inset-0 z-10 flex justify-center items-center">
              <div className = "text-black bg-violet-50 bg-opacity-50 rounded-xl text-3xl">{text}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}