import React from "react";
// import { Card, CardTitle } from "./Card"; // Adjust import paths if necessary
import { Biohazard } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
// import { Biohazard } from "./"; // Adjust import paths if necessary

export default function TopData({ data }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="space-y-3 flex flex-col p-5 justify-center">
        <Biohazard />
        <CardTitle>Total Wastes</CardTitle>
        <p>Total waste items processed</p>
        <h1>{data.totalWastes}</h1>
      </Card>

      <Card className="space-y-3 flex flex-col p-5 justify-center">
        <Biohazard />
        <CardTitle>Biodegradable</CardTitle>
        <p>Number of biodegradable items</p>
        <h1>{data.totalBiodegradable}</h1>
      </Card>

      <Card className="space-y-3 flex flex-col p-5 justify-center">
        <Biohazard />
        <CardTitle>Non-Biodegradable</CardTitle>
        <p>Number of non-biodegradable items</p>
        <h1>{data.totalNonBiodegradable}</h1>
      </Card>
{/* 
      {Object.entries(data.categoryCounts).map(([category, count]) => (
        <Card
          key={category}
          className="space-y-3 flex flex-col p-5 justify-center"
        >
          <Biohazard />
          <CardTitle>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </CardTitle>
          <p>Count of {category} items</p>
          <h1>{count}</h1>
        </Card>
      ))} */}
    </div>
  );
}
