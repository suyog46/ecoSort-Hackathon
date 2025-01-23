import React, { useState, useEffect } from 'react';
// import Bubble from './Bubble'; // Assuming Bubble is a separate component

const Battery = ({ percentage }) => {
  // Properly typed state for bubbles
  // const [bubbles, setBubbles] = useState([]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (percentage > 0) {
  //       setBubbles(prevBubbles => [
  //         ...prevBubbles,
  //         {
  //           id: Date.now(),
  //           size: Math.random() * 10 + 5,
  //           position: Math.random() * 60,
  //         }
  //       ]);
  //     }
  //   }, 350);

  //   return () => clearInterval(interval);
  // }, [percentage]);

  // useEffect(() => {
  //   if (bubbles.length > 0) {
  //     const timer = setTimeout(() => {
  //       setBubbles(prevBubbles => prevBubbles.slice(1));
  //     }, 3000); // Bubble removal delay

  //     return () => clearTimeout(timer);
  //   }
  // }, [bubbles]);

  const liquidColor = percentage === 100 ? '#00fa57' : '#4CAF50';

  return (
    <div className="relative flex flex-col items-center ">
      {/* Battery container */}
      <div className="relative w-[70px] h-[150px] border-[5px] border-[#4CAF50] bg-green-200 rounded-sm overflow-hidden">
        {/* Battery cap */}
        <div className="absolute top-[-15px] right-[20px] w-[30px] h-[10px] bg-green-200 rounded-t-sm" />
        {/* Battery liquid */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-500 overflow-hidden"
          style={{
            height: `${percentage}%`,
            backgroundColor: liquidColor,
          }}
        >
          {/* Animated wave */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 animate-wave1">
              <svg
                className="absolute top-[-5px] left-0 w-[200%] h-[10px] fill-current text-white opacity-30"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 600 10"
                preserveAspectRatio="none"
              >
                <path d="M0,0 C150,10 300,0 450,5 L600,0 L600,10 L0,10 Z" />
              </svg>
            </div>
            <div className="absolute inset-0 animate-wave">
              <svg
                className="absolute top-[-2px] left-0 w-[200%] h-[10px] fill-current text-white opacity-20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 600 10"
                preserveAspectRatio="none"
              >
                <path d="M0,5 C150,0 300,10 450,5 L600,5 L600,10 L0,10 Z" />
                {/* <path fill="#00fa57" className="wave" d="M300,300V2.5c0,0-0.6-0.1-1.1-0.1c0,0-25.5-2.3-40.5-2.4c-15,0-40.6,2.4-40.6,2.4
            c-12.3,1.1-30.3,1.8-31.9,1.9c-2-0.1-19.7-0.8-32-1.9c0,0-25.8-2.3-40.8-2.4c-15,0-40.8,2.4-40.8,2.4c-12.3,1.1-30.4,1.8-32,1.9
            c-2-0.1-20-0.8-32.2-1.9c0,0-3.1-0.3-8.1-0.7V300H300z" /> */}
              </svg>
            </div>
          </div>
        
        </div>
      </div>

      {/* Battery percentage */}
      {/* <div className="mt-2 text-3xl font-bold text-gray-800">
        {percentage}<span className="text-lg">%</span>
      </div> */}
    </div>
  );
};

export default Battery;
