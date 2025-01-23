"use client";

import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios to make HTTP requests
import Battery from "./_components/Battery";
import Barchartt from "./_components/Barchartt";
import TopData from "./_components/TopData";
import NonBio from "./_components/NonBio";

const Dashboard = () => {
  const [percentage, setPercentage] = useState(50);
  const [nonpercentage, setNonpercentage] = useState(50);
  const [wasteData, setWasteData] = useState([null]); // State to hold waste data

  useEffect(() => {
    // Fetch waste data from the backend
    const fetchWasteData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/wastes");
        console.log("response is ", response);
        // Adjust URL if necessary
        setWasteData(response.data); // Set the waste data to state
      } catch (error) {
        console.error("Error fetching waste data:", error);
      }
    };

    fetchWasteData(); // Call the function to fetch data on component mount
  }, []);
  // Find the percentage values from the fetched data
  // const biodegradableWaste = wasteData.find(
  //   (waste) => waste.type === "biodegradable"
  // );
  // const nonBiodegradableWaste = wasteData.find(
  //   (waste) => waste.type === "non_biodegradable"
  // );

  // // Set percentage values based on the fetched data
  // useEffect(() => {
  //   if (biodegradableWaste) {
  //     setPercentage(biodegradableWaste.percentage || 50); // Default to 50 if no percentage is available
  //   }
  //   if (nonBiodegradableWaste) {
  //     setNonpercentage(nonBiodegradableWaste.percentage || 50); // Default to 50 if no percentage is available
  //   }
  // }, [wasteData]); // Re-run when wasteData changes

  return (
    <div className="px-[5%] space-y-5">
      <div className="grid grid-cols-3 gap-5 pt-[100px] ">
        <div className="col-span-2">
          <TopData data={wasteData} />
        </div>

        <div className=" bg-gray-100 py-5 row-span-2">
          <h1 className="px-[5%] text-2xl pb-2">Bins:</h1>
          <div className=" flex flex-col items-end pr-[20%] justify-center gap-10 ">
            <div className="flex h-full gap-5">
              <h1 className="font-bold text-primary text-2xl">Biodegradable</h1>
              <Battery percentage={percentage} />
            </div>
            <div className="flex h-full items-center gap-5">
              <h1 className="font-bold text-primary text-2xl">
                NonBiodegradable
              </h1>
              <NonBio percentage={nonpercentage} />
            </div>
          </div>
        </div>
        <div className="mb-5">
          <Barchartt />
        </div>
      </div>

      <div className="col-span-2 flex items-center justify-center">
        <img src="/photos/bin.jpg" />
      </div>
    </div>
  );
};

export default Dashboard;
