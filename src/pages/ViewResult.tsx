import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertTriangle, CheckCircle, ArrowRight, Lock } from "lucide-react";

function normalizeList(value: string | string[]) {
  if (Array.isArray(value)) return value;
  return value.split(".").filter((v) => v.trim());
}

const ViewResult = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchTaskAndSubscription = async () => {
      if (!taskId) {
        setError("Task ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const { data: taskData, error: taskError } = await supabase
          .from("tasks")
          .select("ai_result")
          .eq("id", taskId)
          .single();

        if (taskError) throw taskError;

        if (taskData) {
          if (typeof taskData.ai_result === "string") {
            setTask(JSON.parse(taskData.ai_result));
          } else {
            setTask(taskData.ai_result);
          }
        } else {
          setError("Task not found.");
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check for admin status directly on the user object first
          if (user.user_metadata?.is_admin || user.app_metadata?.is_admin) {
            setIsSubscribed(true); // Admins get full access
          } else {
            // If not an admin, then check subscription status from profiles table
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("subscription_status")
              .eq("id", user.id);

            if (profileError) throw profileError;

            if (profileData && profileData.length > 0) {
              setIsSubscribed(profileData[0].subscription_status === "active");
            }
          }
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndSubscription();
  }, [taskId]);

  const renderPartialReport = () => (
    <div className="relative">
      <div className="blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <div className="flex gap-3 items-center">
                <CheckCircle className="text-green-500 dark:text-green-400" />
                <CardTitle>Strengths</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-outside text-left pl-5 space-y-2">
                {normalizeList(task.strengths).slice(0, 1).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center pl-5 space-x-2">
              <div className="flex gap-3 items-center">
                <AlertTriangle className="text-yellow-500 dark:text-yellow-400" />
                <CardTitle>Areas for Improvement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-outside text-left space-y-2">
                {normalizeList(task.improvements).slice(0, 1).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Verdict</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{task.verdict.substring(0, 60)}...</p>
            </CardContent>
          </Card>
        </div>
      </div >

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 space-y-4">
        <Lock className="w-16 h-16 text-muted-foreground" />
        <h3 className="text-2xl font-bold">Unlock the Full Report</h3>
        <Button size="lg" onClick={() => navigate(`/paywall/${taskId}`)}>
          Upgrade Now <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div >
  );

  const renderFullReport = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center space-x-2">
            <div className="flex gap-3 items-center">
              <CheckCircle className="text-green-500 dark:text-green-400" />
              <CardTitle>Strengths</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-outside text-left pl-5 space-y-2">
              {normalizeList(task.strengths).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center space-x-2">
            <div className="flex gap-3 items-center">
              <AlertTriangle className="text-yellow-500 dark:text-yellow-400" />
              <CardTitle>Areas for Improvement</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-outside text-left pl-5 space-y-2">
              {normalizeList(task.improvements).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Professional Verdict</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{task.verdict}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  if (loading) {
    return (<div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
    </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading task data...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-4xl">
          <CardContent className="space-y-6 pt-6 text-center">
            <p className="text-lg font-semibold">Overall Score</p>
            <p className="text-6xl font-bold text-blue-600 dark:text-blue-400">{task.score}</p>
            {isSubscribed ? renderFullReport() : renderPartialReport()}
          </CardContent>
        </Card>
      </main>
    </div>)
};

export default ViewResult;
