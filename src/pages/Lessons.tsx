import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, CheckCircle2, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { fetchLessons } from '@/utils/api';
import { toast } from 'sonner';

const Lessons = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const loadLessons = async () => {
      const result = await fetchLessons();
      if (result.success && result.data) {
        setLessons(result.data);
      }
      setLoading(false);
    };
    loadLessons();
  }, [user, navigate]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (!user) return;
    
    const completed = user.completedLessons || [];
    if (!completed.includes(lessonId)) {
      updateUser({
        completedLessons: [...completed, lessonId],
        score: user.score + 100,
      });
      toast.success('Lesson completed! +100 points');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading lessons...</p>
      </div>
    );
  }

  const groupedLessons = {
    Beginner: lessons.filter(l => l.difficulty.toLowerCase() === 'beginner'),
    Intermediate: lessons.filter(l => l.difficulty.toLowerCase() === 'intermediate'),
    Advanced: lessons.filter(l => l.difficulty.toLowerCase() === 'advanced'),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2">SQL Lessons</h1>
          <p className="text-muted-foreground text-lg">
            Master SQL through structured, hands-on lessons
          </p>
        </div>

        {Object.entries(groupedLessons).map(([difficulty, lessonList], sectionIndex) => (
          <div key={difficulty} className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <div className={`h-1 w-12 rounded ${
                difficulty === 'Beginner' ? 'bg-success' : 
                difficulty === 'Intermediate' ? 'bg-warning' : 
                'bg-destructive'
              }`} />
              {difficulty} Level
            </h2>
            <div className="grid gap-6">
              {lessonList.map((lesson, index) => {
                const isCompleted = user?.completedLessons?.includes(lesson.id);
                const globalIndex = lessons.findIndex(l => l.id === lesson.id);
                const isLocked = globalIndex > 0 && !user?.completedLessons?.includes(lessons[globalIndex - 1].id);

                return (
                  <Card
                    key={lesson.id}
                    className={`animate-fade-in hover:shadow-card transition-all duration-300 ${
                      isLocked ? 'opacity-60' : 'hover:scale-[1.02] cursor-pointer'
                    }`}
                    style={{ animationDelay: `${(sectionIndex * 100 + index * 100)}ms` }}
                    onClick={() => !isLocked && navigate(`/lessons/${lesson.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-success/20' : 'bg-primary/20'}`}>
                              {isLocked ? (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                              ) : isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-success" />
                              ) : (
                                <BookOpen className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                          </div>
                          <CardDescription className="text-base">
                            {lesson.description}
                          </CardDescription>
                        </div>
                        <Badge className={getDifficultyColor(lesson.difficulty)} variant="outline">
                          {lesson.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lesson.topics.map((topic: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{lesson.duration}</span>
                          </div>
                          {isCompleted && (
                            <div className="flex items-center gap-1 text-success">
                              <Award className="h-4 w-4" />
                              <span>+100 XP</span>
                            </div>
                          )}
                        </div>
                        <Button
                          disabled={isLocked}
                          variant={isCompleted ? 'outline' : 'default'}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isLocked) navigate(`/lessons/${lesson.id}`);
                          }}
                        >
                          {isLocked ? 'Locked' : isCompleted ? 'Review' : 'Start Lesson'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;
