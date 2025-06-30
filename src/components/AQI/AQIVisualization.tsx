
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Wind, AlertTriangle } from "lucide-react";
import type { AQIPrediction } from "@/pages/AQI";

interface AQIVisualizationProps {
  prediction: AQIPrediction | null;
}

const AQIVisualization = ({ prediction }: AQIVisualizationProps) => {
  if (!prediction) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            AQI Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Wind className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Make a prediction to see results here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pollutantData = [
    { name: "PM2.5", value: prediction.pollutants.pm25, unit: "μg/m³", max: 100 },
    { name: "PM10", value: prediction.pollutants.pm10, unit: "μg/m³", max: 150 },
    { name: "O₃", value: prediction.pollutants.o3, unit: "μg/m³", max: 200 },
    { name: "NO₂", value: prediction.pollutants.no2, unit: "μg/m³", max: 100 },
    { name: "SO₂", value: prediction.pollutants.so2, unit: "μg/m³", max: 50 },
    { name: "CO", value: prediction.pollutants.co, unit: "mg/m³", max: 10 },
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          AQI Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2" style={{ color: prediction.color }}>
            {prediction.aqi}
          </div>
          <Badge 
            className="mb-2 text-white border-0" 
            style={{ backgroundColor: prediction.color }}
          >
            {prediction.category}
          </Badge>
          <p className="text-sm font-medium">{prediction.location}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(prediction.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Pollutant Breakdown
          </h4>
          {pollutantData.map((pollutant) => (
            <div key={pollutant.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{pollutant.name}</span>
                <span>{pollutant.value} {pollutant.unit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((pollutant.value / pollutant.max) * 100, 100)}%`,
                    backgroundColor: 
                      (pollutant.value / pollutant.max) > 0.8 ? "#DC2626" :
                      (pollutant.value / pollutant.max) > 0.6 ? "#F59E0B" :
                      (pollutant.value / pollutant.max) > 0.4 ? "#EAB308" : "#10B981"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AQIVisualization;
