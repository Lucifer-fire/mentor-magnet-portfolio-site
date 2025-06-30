
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, MapPin, Calendar } from "lucide-react";
import type { AQIPrediction } from "@/pages/AQI";

interface AQIHistoryProps {
  predictions: AQIPrediction[];
}

const AQIHistory = ({ predictions }: AQIHistoryProps) => {
  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Prediction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your recent predictions will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Recent Predictions ({predictions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {predictions.map((prediction, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{prediction.location}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: prediction.color }}>
                  {prediction.aqi}
                </div>
              </div>
              
              <Badge 
                className="mb-2 text-white border-0 text-xs" 
                style={{ backgroundColor: prediction.color }}
              >
                {prediction.category}
              </Badge>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(prediction.timestamp).toLocaleDateString()} {new Date(prediction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AQIHistory;
