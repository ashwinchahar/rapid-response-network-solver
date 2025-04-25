
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Index = () => {
  const [zipCode, setZipCode] = useState("");
  
  const handleDispatch = () => {
    // Will implement dispatch logic later
    console.log("Dispatching to:", zipCode);
  };

  return (
    <Layout>
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
            <p className="text-muted-foreground">No active emergency responses.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
