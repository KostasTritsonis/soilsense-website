"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { Field } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { getFieldsByUser } from "@/actions";

Chart.register(ArcElement, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderWidth?: number;
  }[];
}

export default function CropDistribution() {
  const { user } = useUser();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [dbFields, setDbFields] = useState<Field[]>([]);
  const [categoryPercentages, setCategoryPercentages] = useState<
    { category: string; color: string; percentage: number }[]
  >([]);

  // Define a set of colors for categories
  const categoryColors: Record<string, string> = {
    Wheat: "#F4A261",
    Tomato: "#E63946",
    Olive: "#2A9D8F",
    Corn: "#FFD166",
    Rice: "#06D6A0",
    Soybean: "#118AB2",
  };

  // Store categoryColors in a ref
  const categoryColorsRef = useRef(categoryColors);

  // First useEffect - fetch data when user changes
  useEffect(() => {
    const fetchData = async () => {
      const fields = await getFieldsByUser();
      setDbFields(fields ?? []);
    };
    fetchData();
  }, [user]); // This is correct - dependency on user

  // Second useEffect - update chart when dbFields changes
  
  useEffect(() => {
    
    if (!dbFields || dbFields.length === 0) {
      toast.info("No fields found in database.");
      return;
    }

    // Count occurrences of each category
    const categoryCounts: Record<string, number> = {};
    dbFields.forEach((field: Field) => {
      if (field.categories && field.categories.length > 0) {
        field.categories.forEach((category) => {
          categoryCounts[category.type] = (categoryCounts[category.type] || 0) + 1;
        });
      }
    });

    const totalFields = dbFields.length;
    const colors = categoryColorsRef.current;
    
    const percentages = Object.keys(categoryCounts).map((category) => ({
      category,
      color: colors[category] || "#CCCCCC", // Default gray color if category is unknown
      percentage: Math.round((categoryCounts[category] / totalFields) * 100),
    }));

    setChartData({
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: "Categories",
          data: Object.values(categoryCounts),
          backgroundColor: Object.keys(categoryCounts).map(
            (category) => colors[category] || "#CCCCCC"
          ),
          borderWidth: 2,
        },
      ],
    });

    setCategoryPercentages(percentages);
  }, [dbFields]); // Keep this dependency - we want the chart to update when fields change

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center">
      <Doughnut
        data={chartData}
        options={{
          cutout: "70%",
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
            },
          },
        }}
      />
      <div className="ml-8">
        {categoryPercentages.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <div
              className="w-4 h-4 mr-2 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm">
              {item.category} - {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}