import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, ArrowRight, Trash2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserAndTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: tasksData, error } = await supabase
          .from('tasks')
          .select('id, created_at, title, language, ai_result')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tasks:', error);
        } else if (tasksData) {
          setTasks(tasksData);
        }
      }
    };
    getUserAndTasks();
  }, []);

  const handleAddTask = () => {
    navigate('/submit');
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleDeleteSelected = async () => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .in('id', selectedTasks);

    if (error) {
      console.error('Error deleting tasks:', error);
    } else {
      setTasks(tasks.filter(task => !selectedTasks.includes(task.id)));
      setSelectedTasks([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome, {user?.user_metadata.username || user?.email || 'User'}!</h2>
            <p className="text-muted-foreground">Here's a summary of your recent activity.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleAddTask}>
              <PlusCircle className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Recent Evaluations</CardTitle>
                <CardDescription>
                  Here are the recent tasks you have submitted.
                </CardDescription>
              </div>
              {selectedTasks.length > 0 && (
                <Button variant="destructive" onClick={handleDeleteSelected} className="bg-destructive hover:bg-destructive/90">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedTasks.length})
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="font-bold">Title</TableHead>
                    <TableHead className="font-bold">Language</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Score</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => {
                    let score = 'N/A';
                    if (task.ai_result) {
                      try {
                        const result = JSON.parse(task.ai_result);
                        score = result.score;
                      } catch (e) {
                        console.error("Failed to parse ai_result", e);
                      }
                    }
                    return (
                      <TableRow key={task.id} className="hover:bg-muted">
                        <TableCell>
                          <Checkbox
                            checked={selectedTasks.includes(task.id)}
                            onCheckedChange={() => handleSelectTask(task.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{task.title || 'Untitled'}</TableCell>
                        <TableCell>{task.language}</TableCell>
                        <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-sm font-semibold rounded-full ${
                              parseInt(score) > 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              parseInt(score) > 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {score}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" onClick={() => navigate(`/view-result/${task.id}`)}>
                            View Report
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
