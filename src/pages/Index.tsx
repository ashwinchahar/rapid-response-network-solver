import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ambulance, Bus, Car, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OptimalDispatchSystem from "@/components/OptimalDispatchSystem";

type VehicleType = "ambulance" | "police" | "fire" | "rescue";

interface EmergencyRequest {
  id: string;
  zipCode: string;
  vehicleType: VehicleType;
  timestamp: Date;
}

const Index = () => {
  const [zipCode, setZipCode] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType | "">("");
  const [activeRequests, setActiveRequests] = useState<EmergencyRequest[]>([]);
  const { toast } = useToast();

  const handleDispatch = () => {
    if (!zipCode || !vehicleType) {
      toast({
        variant: "destructive",
        title: "Invalid Request",
        description: "Please enter both ZIP code and vehicle type",
      });
      return;
    }

    const newRequest: EmergencyRequest = {
      id: Math.random().toString(36).substring(7),
      zipCode,
      vehicleType,
      timestamp: new Date(),
    };

    setActiveRequests((prev) => [...prev, newRequest]);
    toast({
      title: "Emergency Request Dispatched",
      description: `${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} dispatched to ${zipCode}`,
    });

    // Reset form
    setZipCode("");
    setVehicleType("");
  };

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case "ambulance":
        return <Ambulance className="mr-2 h-4 w-4" />;
      case "police":
        return <Car className="mr-2 h-4 w-4" />;
      case "fire":
        return <Truck className="mr-2 h-4 w-4" />;
      case "rescue":
        return <Bus className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <Tabs defaultValue="dispatch" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dispatch">Simple Dispatch</TabsTrigger>
          <TabsTrigger value="optimal">Optimal Dispatch System</TabsTrigger>
        </TabsList>
        <TabsContent value="dispatch">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Dispatch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Emergency Location (ZIP Code)</Label>
                    <Input
                      id="zipCode"
                      placeholder="Enter ZIP code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select
                      value={vehicleType}
                      onValueChange={(value: VehicleType) => setVehicleType(value)}
                    >
                      <SelectTrigger id="vehicleType">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ambulance">
                          <div className="flex items-center">
                            <Ambulance className="mr-2 h-4 w-4" />
                            Ambulance
                          </div>
                        </SelectItem>
                        <SelectItem value="police">
                          <div className="flex items-center">
                            <Car className="mr-2 h-4 w-4" />
                            Police Car
                          </div>
                        </SelectItem>
                        <SelectItem value="fire">
                          <div className="flex items-center">
                            <Truck className="mr-2 h-4 w-4" />
                            Fire Truck
                          </div>
                        </SelectItem>
                        <SelectItem value="rescue">
                          <div className="flex items-center">
                            <Bus className="mr-2 h-4 w-4" />
                            Rescue Vehicle
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleDispatch} className="w-full">
                    Request Emergency Vehicle
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Responses</CardTitle>
              </CardHeader>
              <CardContent>
                {activeRequests.length === 0 ? (
                  <p className="text-muted-foreground">No active emergency responses.</p>
                ) : (
                  <div className="space-y-4">
                    {activeRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-2">
                          {getVehicleIcon(request.vehicleType)}
                          <div>
                            <p className="font-medium">
                              {request.vehicleType.charAt(0).toUpperCase() +
                                request.vehicleType.slice(1)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ZIP: {request.zipCode}
                            </p>
                          </div>
                        </div>
                        <time className="text-sm text-muted-foreground">
                          {request.timestamp.toLocaleTimeString()}
                        </time>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="optimal">
          <OptimalDispatchSystem />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;
