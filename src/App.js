import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [data, setData] = useState({});
  const [nx, setLocationX] = useState('');  // 사용자 입력 X 좌표
  const [ny, setLocationY] = useState('');  // 사용자 입력 Y 좌표
  const [temperature, setTemperature] = useState(null);  // 온도(T1H) 값
  const [humdity, setHumdity] = useState(null); //
  const [precipitation, setPrecipitation] = useState(null); //
  const apikey = process.env.REACT_APP_API_KEY;

  // searchLocation 함수 정의
  const searchLocation = (event) => {
    if (event.key === 'Enter' && nx && ny) {
      const parsedX = parseInt(nx, 10);  // nx 값을 정수로 변환
      const parsedY = parseInt(ny, 10);
        // ny 값을 정수로 변환

      if (isNaN(parsedX) || isNaN(parsedY)) {
        console.error("Invalid X or Y coordinates");
        return;
      }

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, 0);
      const day = String(today.getDate()).padStart(2,0);
      

      const formattedDate = `${year}${month}${day}`;
      const url = `/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst?pageNo=1&numOfRows=10&dataType=JSON&base_date=${formattedDate}&base_time=1200&nx=${parsedX}&ny=${parsedY}&authKey=${apikey}`;

      axios.get(url)
        .then((response) => {
          setData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    }
  };

  useEffect(() => {
    if (data && data.response && data.response.body && data.response.body.items) {
      const tempData = data.response.body.items.item.find(item => item.category === "T1H");
      const humdData = data.response.body.items.item.find(item => item.category === "REH");
      const precipData = data.response.body.items.item.find(item => item.category === "RN1");

      if (tempData) {
        setTemperature(tempData.obsrValue);  // T1H 값을 temperature에 설정
      }

      if (humdData) {
        setHumdity(humdData.obsrValue);  // REH 값을 humdity에 설정
      }

      if (precipData) {
        setPrecipitation(precipData.obsrValue);  // RN1 값을 precipitation에 설정
      }
    }
  }, [data]);

  return (
    <div>
    <div>
      <div class="block h-20 ">
  
      <input 
        value={nx}
        type="text"
        onChange={(event) => setLocationX(event.target.value)}  // X 좌표 변경 이벤트 핸들러
        onKeyDown={searchLocation}  // Enter 키 이벤트로 검색
        placeholder="Enter locationX" 
      />

      <input 
        value={ny}
        type="text"
        onChange={(event) => setLocationY(event.target.value)}  // Y 좌표 변경 이벤트 핸들러
        onKeyDown={searchLocation}  // Enter 키 이벤트로 검색
        placeholder="Enter locationY" 
      />
     
      </div>
      <div className="grid grid-cols-3 gap-3"> 
      <div className="w-120">
     
      {temperature && precipitation ? (
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <h1 className="font-bold text-8xl">Today's Temperature: {temperature}°C</h1>
            <h2 className="text-5xl">Today's Humidity: {humdity}%</h2>
          </div>
          <h3 className="text-5xl">Today's Precipitation: {precipitation}mm</h3>
        </div>
      ) : (
        <p className="text-lg">Loading weather data...</p>
      )}

      <h3>자연과학대학 물리학과 
      <p>전우영</p>  
      <p>지도교수 제숭근</p></h3>
    
      </div>
      </div>
    </div>
    </div>

  );
}

export default App;
