
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AQIPrediction } from "@/pages/AQI";

interface AQIPredictorProps {
  onPrediction: (prediction: AQIPrediction) => void;
}

const AQIPredictor = ({ onPrediction }: AQIPredictorProps) => {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pythonApiUrl, setPythonApiUrl] = useState("");
  const { toast } = useToast();

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return { category: "Good", color: "#10B981" };
    if (aqi <= 100) return { category: "Moderate", color: "#F59E0B" };
    if (aqi <= 150) return { category: "Unhealthy for Sensitive Groups", color: "#EF4444" };
    if (aqi <= 200) return { category: "Unhealthy", color: "#DC2626" };
    if (aqi <= 300) return { category: "Very Unhealthy", color: "#7C2D12" };
    return { category: "Hazardous", color: "#450A0A" };
  };

  const simulatePrediction = (): AQIPrediction => {
    const aqi = Math.floor(Math.random() * 300) + 1;
    const { category, color } = getAQICategory(aqi);
    
    return {
      location,
      aqi,
      category,
      color,
      timestamp: new Date().toISOString(),
      pollutants: {
        pm25: Math.floor(Math.random() * 100),
        pm10: Math.floor(Math.random() * 150),
        o3: Math.floor(Math.random() * 200),
        no2: Math.floor(Math.random() * 100),
        so2: Math.floor(Math.random() * 50),
        co: Math.floor(Math.random() * 10),
      }
    };
  };

  const handlePredict = async () => {
    if (!location.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (pythonApiUrl) {
        // Call your Python API
        const response = await fetch(pythonApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ location }),
        });

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        const { category, color } = getAQICategory(data.aqi);
        
        const prediction: AQIPrediction = {
          location,
          aqi: data.aqi,
          category,
          color,
          timestamp: new Date().toISOString(),
          pollutants: data.pollutants || {
            pm25: 0, pm10: 0, o3: 0, no2: 0, so2: 0, co: 0
          }
        };

        onPrediction(prediction);
        toast({
          title: "Prediction Complete",
          description: `AQI for ${location}: ${data.aqi} (${category})`,
        });
      } else {
        // Use simulation for demo
        const prediction = simulatePrediction();
        onPrediction(prediction);
        toast({
          title: "Demo Prediction Complete",
          description: `AQI for ${location}: ${prediction.aqi} (${prediction.category})`,
        });
      }
    } catch (error) {
      console.error("Prediction error:", error);
      // Fallback to simulation
      const prediction = simulatePrediction();
      onPrediction(prediction);
      toast({
        title: "Using Demo Data",
        description: "Connect your Python API for real predictions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          AQI Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="python-api">Python API Endpoint (Optional)</Label>
          <Input
            id="python-api"
            placeholder="http://your-python-api.com/predict"
            value={pythonApiUrl}
            onChange={(e) => setPythonApiUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to use demo mode
          </p>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter city or coordinates"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePredict()}
          />
        </div>

        <Button 
          onClick={handlePredict}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Predicting...
            </>
          ) : (
            "Predict AQI"
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>How to connect your Python code:</strong></p>
          <p>1. Deploy your Python AQI model as an API</p>
          <p>2. Enter the API endpoint above</p>
          <p>3. API should accept POST with {"{"}"location": "city"{"}"}</p>
          <p>4. Return {"{"}"aqi": number, "pollutants": {"{...}"}{"}"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AQIPredictor;
