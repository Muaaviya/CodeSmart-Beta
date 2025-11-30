//@ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertTriangle, CheckCircle, ArrowRight, Lock } from "lucide-react";

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
          if (typeof taskData.ai_result === 'string') {
            try {
              setTask(JSON.parse(taskData.ai_result));
            } catch (e) {
              setError("Failed to parse AI result.");
            }
          } else {
            setTask(taskData.ai_result);
          }
        } else {
          setError("Task not found.");
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_status')
            .eq('id', user.id);

          if (profileError) throw profileError;

          if (profileData && profileData.length > 0) {
            setIsSubscribed(profileData[0].subscription_status === 'active');
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
              <CheckCircle className="text-green-500" />
              <CardTitle>Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {task.strengths.split('.').filter(s => s.trim()).slice(0, 1).map((strength, index) => (
                  <li key={index}>{strength.trim()}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <AlertTriangle className="text-yellow-500" />
              <CardTitle>Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {task.improvements.split('.').filter(s => s.trim()).slice(0, 1).map((improvement, index) => (
                  <li key={index}>{improvement.trim()}</li>
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
              <p>{task.verdict.substring(0, 50)}...</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 flex-col space-y-4">
        <Lock className="w-16 h-16 text-gray-400" />
        <h3 className="text-2xl font-bold">Unlock the Full Report</h3>
        <p className="text-gray-600">Subscribe to a plan to get access to the complete evaluation.</p>
        <Button size="lg" onClick={() => navigate(`/paywall/${taskId}`)}>
          Upgrade Now <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderFullReport = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center space-x-2">
            <CheckCircle className="text-green-500" />
            <CardTitle>Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {task.strengths.split('.').filter(s => s.trim()).map((strength, index) => (
                <li key={index}>{strength.trim()}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center space-x-2">
            <AlertTriangle className="text-yellow-500" />
            <CardTitle>Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {task.improvements.split('.').filter(s => s.trim()).map((improvement, index) => (
                <li key={index}>{improvement.trim()}</li>
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
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-8 flex items-center justify-center text-center">
          <div>
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 text-xl">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <p>No data available for this task.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-4xl">
          <CardContent className="space-y-6 pt-6">
            <div className="text-center">
              <p className="text-lg font-semibold">Overall Score</p>
              <p className="text-6xl font-bold text-blue-600">{task.score}</p>
            </div>
            {isSubscribed ? renderFullReport() : renderPartialReport()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ViewResult;
