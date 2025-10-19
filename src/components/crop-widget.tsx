"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState, useRef, useCallback } from "react";
import { Field } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { getFieldsByUser } from "@/actions";
import { Sprout } from "lucide-react";
import { useTranslations } from "next-intl";

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

export default function CropWidget() {
  const { user } = useUser();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [dbFields, setDbFields] = useState<Field[]>([]);
  const [categoryPercentages, setCategoryPercentages] = useState<
    { category: string; color: string; percentage: number }[]
  >([]);
  const t = useTranslations();

  const categoryColors: Record<string, string> = {
    Wheat: "#F4A261",
    Tomato: "#E63946",
    Olive: "#2A9D8F",
    Corn: "#FFD166",
    Rice: "#06D6A0",
    Soybean: "#118AB2",
  };

  const categoryColorsRef = useRef(categoryColors);

  // Function to get translated crop name
  const getTranslatedCropName = useCallback(
    (cropName: string): string => {
      const cropKey = cropName.toLowerCase();
      return t(`crops.${cropKey}` as keyof typeof t) || cropName;
    },
    [t]
  );

  useEffect(() => {
    const fetchData = async () => {
      const fields = await getFieldsByUser();
      setDbFields(fields ?? []);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!dbFields || dbFields.length === 0) {
      return;
    }

    const categoryCounts: Record<string, number> = {};
    dbFields.forEach((field: Field) => {
      if (field.categories && field.categories.length > 0) {
        field.categories.forEach((category) => {
          categoryCounts[category.type] =
            (categoryCounts[category.type] || 0) + 1;
        });
      }
    });

    const totalFields = dbFields.length;
    const colors = categoryColorsRef.current;

    const percentages = Object.keys(categoryCounts).map((category) => ({
      category,
      color: colors[category] || "#CCCCCC",
      percentage: Math.round((categoryCounts[category] / totalFields) * 100),
    }));

    setChartData({
      labels: Object.keys(categoryCounts).map((category) =>
        getTranslatedCropName(category)
      ),
      datasets: [
        {
          label: t("crops.categories"),
          data: Object.values(categoryCounts),
          backgroundColor: Object.keys(categoryCounts).map(
            (category) => colors[category] || "#CCCCCC"
          ),
          borderWidth: 2,
        },
      ],
    });

    setCategoryPercentages(percentages);
  }, [dbFields, getTranslatedCropName, t]);

  if (!chartData) {
    return (
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-6">
        <div className="flex items-center gap-3 pb-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
            <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {t("crops.cropDistribution")}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            {t("crops.noCropDataAvailable")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-6">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
            <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {t("crops.cropDistribution")}
          </h2>
        </div>
        <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
          2025
        </span>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28">
          <Doughnut
            data={chartData}
            options={{
              cutout: "70%",
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: true,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  titleColor: "white",
                  bodyColor: "white",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderWidth: 1,
                  cornerRadius: 8,
                },
              },
            }}
          />
        </div>

        <div className="w-full max-w-xs">
          <div className="grid grid-cols-1 gap-2">
            {categoryPercentages.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium truncate">
                    {getTranslatedCropName(item.category)}
                  </span>
                </div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400 font-semibold flex-shrink-0">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
