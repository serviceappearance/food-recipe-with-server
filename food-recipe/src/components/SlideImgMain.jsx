import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";

export default function SlideImgMain({ type, text, onClick }) {
  const data = useContext(DataContext);
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState();

  // 이미지 소스 리스트를 메모이제이션하여 매 렌더링 시 재계산을 피함
  const imgSrcList = useMemo(() => (data ? data.map(item => item.ATT_FILE_NO_MK) : []), [data]);

  // data나 imgSrcList가 변경될 때 무작위로 시작 인덱스를 설정
  useEffect(() => {
    if (data.length) {
      setCurrentIndex(Math.floor(Math.random() * imgSrcList.length));
    }
  }, [data.length, imgSrcList.length]);

  // 3초마다 이미지를 변경하는 인터벌 설정
  useEffect(() => {
    if (!imgSrcList.length) return;
    const interval = setInterval(nextButton, 3000);
    return () => clearInterval(interval);
  }, [imgSrcList.length]);

  if (!data || !data.length) {
    return <div>Loading...</div>;
  }

  // 다음 이미지로 이동하는 함수
  const nextButton = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imgSrcList.length);
  };

  // 이전 이미지로 이동하는 함수
  const prevButton = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imgSrcList.length) % imgSrcList.length);
  };

  // 이미지를 클릭하면 레시피 페이지로 이동
  const mainClick = () => {
    navigate("/recipe", { state: { recipeData: data[currentIndex] } });
  };

  return (
    <div
      className={`relative w-full mb-5 ${type === 'main' ? 'mt-14 shadow-xl pb-3 rounded-3xl' : 'mt-0'}`}
      onClick={type === "main" ? mainClick : onClick}
    >
      {type === "main" && (
        <div className="absolute inset-0 z-10 flex justify-between items-center w-full">
          {/* 이전 버튼 */}
          <button
            className="z-20 absolute left-4 top-1/2 -translate-y-1/2 text-[500%] text-blue-200"
            onClick={(e) => {
              e.stopPropagation();
              prevButton();
            }}
          >
            &lt;
          </button>

          {/* 텍스트가 있을 경우 표시 */}
          {text && (
            <div className="px-8 py-4 text-black bg-violet-500 bg-opacity-80 rounded-3xl text-3xl font-semibold shadow-lg hover:bg-violet-600 transition duration-300">
              {text}
            </div>
          )}

          {/* 다음 버튼 */}
          <button
            className="text-4xl z-20 absolute right-4 top-1/2 -translate-y-1/2 text-[500%] text-blue-200"
            onClick={(e) => {
              e.stopPropagation();
              nextButton();
            }}
          >
            &gt;
          </button>
        </div>
      )}

      {/* 이미지 슬라이더 컨테이너 */}
      <div className="max-w-md mx-auto relative h-[400px] bg-white rounded-3xl transition-transform duration-300">
        <div className="flex overflow-hidden h-full p-0 rounded-3xl shadow-lg">
          {imgSrcList.map((el, index) => (
            <img
              key={index}
              src={el}
              className={`transition-opacity duration-1000 ease-linear w-full h-full rounded-3xl border-2 absolute ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
              alt="슬라이드 이미지"
            />
          ))}
        </div>

        {/* 텍스트가 있을 경우 이미지 위에 표시 */}
        {text && (
          <div className="absolute inset-0 z-10 flex justify-center items-center w-full h-full">
            <div className="text-black text-bold rounded-b text-3xl">
              {text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
