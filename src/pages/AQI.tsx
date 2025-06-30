
import AQIPredictor from "@/components/AQI/AQIPredictor";
import AQIVisualization from "@/components/AQI/AQIVisualization";
import AQIHistory from "@/components/AQI/AQIHistory";
import { useState } from "react";

export interface AQIPrediction {
  location: string;
  aqi: number;
  category: string;
  color: string;
  timestamp: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
  };
}

const AQI = () => {
  const [predictions, setPredictions] = useState<AQIPrediction[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<AQIPrediction | null>(null);

  const handleNewPrediction = (prediction: AQIPrediction) => {
    setCurrentPrediction(prediction);
    setPredictions(prev => [prediction, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-teal-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            AQI Prediction System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced Air Quality Index prediction using machine learning algorithms
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <AQIPredictor onPrediction={handleNewPrediction} />
          <AQIVisualization prediction={currentPrediction} />
        </div>

        <AQIHistory predictions={predictions} />
      </div>
    </div>
  );
};

export default AQI;
