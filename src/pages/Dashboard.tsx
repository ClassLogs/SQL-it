import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Trophy, Target, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { fetchLessons } from '@/utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchLessons();
      if (result.success && result.data) {
        setLessons(result.data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const completedCount = user?.completedLessons?.length || 0;
  const totalLessons = lessons.length;
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const stats = [
    { icon: BookOpen, label: 'Lessons Completed', value: completedCount, color: 'text-primary' },
    { icon: Trophy, label: 'Total Score', value: user?.score || 0, color: 'text-accent' },
    { icon: Target, label: 'Current Streak', value: '0 days', color: 'text-warning' },
    { icon: Award, label: 'Rank', value: '#-', color: 'text-secondary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-hero bg-clip-text text-transparent">{user?.name}</span>!
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your SQL learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="animate-scale-in hover:shadow-card transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Track your journey to SQL mastery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedCount} / {totalLessons} lessons
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
              <p className="text-sm text-muted-foreground">
                {progress >= 100
                  ? '🎉 Congratulations! You\'ve completed all lessons!'
                  : `Keep going! You're ${Math.round(progress)}% through the course.`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/lessons">
                <Button className="w-full">View Lessons</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader>
              <Code className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Practice SQL</CardTitle>
              <CardDescription>Write and test queries</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/practice">
                <Button className="w-full" variant="outline">Start Practicing</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader>
              <Trophy className="h-8 w-8 text-warning mb-2" />
              <CardTitle>View Leaderboard</CardTitle>
              <CardDescription>See how you rank</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/leaderboard">
                <Button className="w-full" variant="outline">Check Rankings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
