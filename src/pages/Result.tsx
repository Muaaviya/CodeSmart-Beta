import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Result() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 items-center">
          <p className="text-center">Result page (coming soon)</p>
          <Button variant="default">Go Back</Button>
        </CardContent>
      </Card>
    </div>
  );
}
