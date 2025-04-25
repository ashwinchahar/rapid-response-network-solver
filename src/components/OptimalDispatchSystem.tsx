
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Road {
  u: number; // source zip code
  v: number; // destination zip code
  d: number; // distance
}

interface Vehicle {
  zip: number; // zip code location
  type: string; // vehicle type
  count: number; // number of vehicles
}

interface Request {
  zip: number; // requested zip code
  type: string; // requested vehicle type
}

interface Graph {
  [key: number]: { [key: number]: number };
}

interface VehicleInventory {
  [key: number]: { [key: string]: number };
}

const OptimalDispatchSystem = () => {
  const [input, setInput] = useState(
    "5 6\n1 2 5\n1 3 10\n2 3 2\n2 4 3\n3 5 1\n4 5 2\n3\n1 1 1\n3 2 1\n5 3 1\n4\n2 1\n3 2\n1 3\n5 1"
  );
  const [output, setOutput] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const parseInput = (inputText: string): { roads: Road[]; vehicles: Vehicle[]; requests: Request[] } => {
    const lines = inputText.trim().split("\n");
    const [n, m] = lines[0].split(" ").map(Number);
    
    const roads: Road[] = [];
    for (let i = 1; i <= m; i++) {
      const [u, v, d] = lines[i].split(" ").map(Number);
      roads.push({ u, v, d });
    }
    
    const k = parseInt(lines[m + 1]);
    const vehicles: Vehicle[] = [];
    for (let i = m + 2; i < m + 2 + k; i++) {
      const [zip, type, count] = lines[i].split(" ");
      vehicles.push({ 
        zip: parseInt(zip), 
        type: type === "1" ? "ambulance" : type === "2" ? "fire" : "police", 
        count: parseInt(count) 
      });
    }
    
    const q = parseInt(lines[m + 2 + k]);
    const requests: Request[] = [];
    for (let i = m + 3 + k; i < m + 3 + k + q; i++) {
      const [zip, type] = lines[i].split(" ");
      requests.push({ 
        zip: parseInt(zip),
        type: type === "1" ? "ambulance" : type === "2" ? "fire" : "police"
      });
    }
    
    return { roads, vehicles, requests };
  };

  const buildGraph = (roads: Road[]): Graph => {
    const graph: Graph = {};
    
    roads.forEach(road => {
      if (!graph[road.u]) graph[road.u] = {};
      if (!graph[road.v]) graph[road.v] = {};
      
      graph[road.u][road.v] = road.d;
      graph[road.v][road.u] = road.d; // Assuming bidirectional roads
    });
    
    return graph;
  };

  const initializeVehicleInventory = (vehicles: Vehicle[]): VehicleInventory => {
    const inventory: VehicleInventory = {};
    
    vehicles.forEach(vehicle => {
      if (!inventory[vehicle.zip]) inventory[vehicle.zip] = {};
      inventory[vehicle.zip][vehicle.type] = vehicle.count;
    });
    
    return inventory;
  };

  const findNearestVehicle = (
    graph: Graph, 
    start: number, 
    vehicleType: string, 
    inventory: VehicleInventory
  ): number => {
    // Implement Dijkstra's Algorithm to find nearest vehicle
    const distances: { [key: number]: number } = {};
    const visited: { [key: number]: boolean } = {};
    const queue: [number, number][] = []; // [zip, distance]
    
    // Initialize distances
    for (const zip in graph) {
      distances[parseInt(zip)] = Infinity;
    }
    distances[start] = 0;
    queue.push([start, 0]);
    
    // Check if vehicle is available at the start location
    if (
      inventory[start] && 
      inventory[start][vehicleType] && 
      inventory[start][vehicleType] > 0
    ) {
      inventory[start][vehicleType]--; // Use the vehicle
      return 0; // Distance is 0 since vehicle is at the requested location
    }
    
    while (queue.length > 0) {
      queue.sort((a, b) => a[1] - b[1]); // Priority queue based on distance
      const [current, dist] = queue.shift() as [number, number];
      
      if (visited[current]) continue;
      visited[current] = true;
      
      // Check if vehicle is available at this location
      if (
        inventory[current] && 
        inventory[current][vehicleType] && 
        inventory[current][vehicleType] > 0
      ) {
        inventory[current][vehicleType]--; // Use the vehicle
        return distances[current];
      }
      
      // Explore neighbors
      for (const neighbor in graph[current]) {
        const newDist = distances[current] + graph[current][parseInt(neighbor)];
        if (newDist < distances[parseInt(neighbor)]) {
          distances[parseInt(neighbor)] = newDist;
          queue.push([parseInt(neighbor), newDist]);
        }
      }
    }
    
    return -1; // No vehicle available
  };

  const handleCalculate = () => {
    try {
      setIsCalculating(true);
      const { roads, vehicles, requests } = parseInput(input);
      const graph = buildGraph(roads);
      const inventory = initializeVehicleInventory(vehicles);
      
      const results: string[] = [];
      
      requests.forEach(request => {
        const distance = findNearestVehicle(graph, request.zip, request.type, inventory);
        results.push(distance.toString());
      });
      
      setOutput(results);
      toast({
        title: "Calculation Complete",
        description: "The optimal dispatch routes have been calculated.",
      });
    } catch (error) {
      console.error("Error calculating optimal routes:", error);
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: "Please check your input data format.",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emergency Vehicle Optimal Dispatch System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="input" className="font-medium">
              Input Data (Network and Requests)
            </label>
            <Textarea
              id="input"
              placeholder="Enter input data..."
              className="min-h-[200px] font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button onClick={handleCalculate} disabled={isCalculating}>
            {isCalculating ? "Calculating..." : "Calculate Optimal Routes"}
          </Button>
        </CardContent>
      </Card>

      {output.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results (Minimum Distance)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-md font-mono">
              {output.map((distance, index) => (
                <div key={index}>{distance}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimalDispatchSystem;
