import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, ArrowLeft, Code, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { fetchLessonDetail } from '@/utils/api';
import { toast } from 'sonner';

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const loadLesson = async () => {
      if (!id) return;
      const result = await fetchLessonDetail(id);
      if (result.success && result.data) {
        setLesson(result.data);
      } else {
        toast.error('Lesson not found');
        navigate('/lessons');
      }
      setLoading(false);
    };
    loadLesson();
  }, [id, user, navigate]);

  const handleCompleteLesson = () => {
    if (!user || !lesson) return;
    
    const completed = user.completedLessons || [];
    if (!completed.includes(lesson.id)) {
      updateUser({
        completedLessons: [...completed, lesson.id],
        score: user.score + 100,
      });
      toast.success('Lesson completed! +100 points');
    }
    navigate('/lessons');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) return null;

  const isCompleted = user?.completedLessons?.includes(lesson.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/lessons')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lessons
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-3 rounded-lg ${isCompleted ? 'bg-success/20' : 'bg-primary/20'}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : (
                    <BookOpen className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl">{lesson.title}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {lesson.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  {lesson.difficulty}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Lesson Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {lesson.content.map((section: any, index: number) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl font-semibold">{section.heading}</h3>
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                  
                  {section.points && (
                    <ul className="space-y-2 ml-4">
                      {section.points.map((point: string, idx: number) => (
                        <li key={idx} className="text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Example Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lesson.examples.map((example: any, index: number) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold">{example.title}</h4>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <code className="text-sm font-mono">{example.query}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">{example.explanation}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={handleCompleteLesson}
              className="flex-1"
              disabled={isCompleted}
            >
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/practice?lesson=${lesson.id}`)}
              className="flex-1"
            >
              Practice This Lesson
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
