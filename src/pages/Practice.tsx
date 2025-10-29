import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Database, Loader2, CheckCircle2, XCircle, Lightbulb, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { executeQuery, fetchPracticeTasks } from '@/utils/api';
import { validateSQLQuery, sanitizeInput } from '@/utils/validation';
import { toast } from 'sonner';

const Practice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson');
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const loadTasks = async () => {
      const result = await fetchPracticeTasks(lessonId || undefined);
      if (result.success && result.data) {
        setTasks(result.data);
        setQuery('');
      }
    };
    loadTasks();
  }, [user, navigate, lessonId]);

  const currentTask = tasks[currentTaskIndex];

  const handleExecuteQuery = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!currentTask) return;

    const validationError = validateSQLQuery(query);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setIsExecuting(true);
    const sanitizedQuery = sanitizeInput(query);
    const response = await executeQuery(sanitizedQuery, currentTask.expectedResult);
    setIsExecuting(false);

    if (response.success && response.data) {
      setResult(response.data);
      
      if (response.data.isCorrect) {
        toast.success('Correct! Task completed!');
        if (!completedTasks.includes(currentTask.id)) {
          setCompletedTasks([...completedTasks, currentTask.id]);
        }
      } else {
        toast.error('Query executed but result doesn\'t match expected output. Try again!');
      }
    } else {
      setError(response.error || 'Query execution failed');
      toast.error(response.error || 'Query execution failed');
    }
  };

  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setQuery('');
      setResult(null);
      setError(null);
      setShowHint(false);
    }
  };

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
      setQuery('');
      setResult(null);
      setError(null);
      setShowHint(false);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading practice tasks...</p>
      </div>
    );
  }

  const isTaskCompleted = currentTask && completedTasks.includes(currentTask.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">SQL Practice</h1>
              <p className="text-muted-foreground text-lg">
                Complete tasks to master SQL concepts
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Task {currentTaskIndex + 1} of {tasks.length}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      {currentTask?.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {currentTask?.description}
                    </CardDescription>
                  </div>
                  {isTaskCompleted && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {currentTask?.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {showHint && (
                    <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg animate-fade-in">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-warning mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-warning mb-2">Hint:</h4>
                          <p className="text-sm text-muted-foreground mb-3">{currentTask?.hint}</p>
                          <div className="bg-background p-3 rounded">
                            <code className="text-sm font-mono">{currentTask?.solution}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Query Editor
                </CardTitle>
                <CardDescription>Write your SQL query below</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExecuteQuery} className="space-y-4">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your SQL query..."
                    className="font-mono min-h-[200px] bg-muted/30"
                    maxLength={5000}
                  />
                  {error && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setShowHint(!showHint)}
                      className="flex-1"
                    >
                      <Lightbulb className="mr-2 h-4 w-4" />
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </Button>
                    <Button type="submit" disabled={isExecuting} className="flex-1">
                      {isExecuting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Execute Query
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {result && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${result.isCorrect ? 'text-success' : 'text-warning'}`}>
                    {result.isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    {result.isCorrect ? 'Correct Answer!' : 'Query Executed'}
                  </CardTitle>
                  <CardDescription>
                    {result.rowCount} rows returned in {result.executionTime.toFixed(2)}ms
                    {!result.isCorrect && ' - Result doesn\'t match expected output'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          {result.columns.map((col: string) => (
                            <th key={col} className="text-left p-3 font-semibold bg-muted/50">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row: any, idx: number) => (
                          <tr key={idx} className="border-b border-border hover:bg-muted/30">
                            {result.columns.map((col: string) => (
                              <td key={col} className="p-3 font-mono text-sm">
                                {row[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePreviousTask}
                disabled={currentTaskIndex === 0}
                className="flex-1"
              >
                Previous Task
              </Button>
              <Button
                variant="outline"
                onClick={handleNextTask}
                disabled={currentTaskIndex === tasks.length - 1}
                className="flex-1"
              >
                Next Task
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
                <CardDescription>Available tables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentTask?.schema.map((table: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">{table.name}</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {table.columns.map((col: any, colIdx: number) => (
                          <li key={colIdx}>• {col.name} ({col.type})</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>Tasks completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tasks.map((task, idx) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-2 p-2 rounded ${
                        idx === currentTaskIndex ? 'bg-primary/10' : ''
                      }`}
                    >
                      {completedTasks.includes(task.id) ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className="text-sm">{task.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
