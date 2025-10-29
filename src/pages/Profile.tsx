import { useNavigate } from 'react-router-dom';
import { User, Mail, Award, BookOpen, Trophy, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/signin');
    return null;
  }

  const stats = [
    { icon: BookOpen, label: 'Lessons Completed', value: user.completedLessons?.length || 0, color: 'text-primary' },
    { icon: Trophy, label: 'Total Points', value: user.score || 0, color: 'text-accent' },
    { icon: Award, label: 'Achievements', value: Math.floor((user.score || 0) / 500), color: 'text-warning' },
    { icon: Calendar, label: 'Days Active', value: '1', color: 'text-secondary' },
  ];

  const achievements = [
    { name: 'First Steps', description: 'Complete your first lesson', earned: (user.completedLessons?.length || 0) >= 1 },
    { name: 'Quick Learner', description: 'Complete 3 lessons', earned: (user.completedLessons?.length || 0) >= 3 },
    { name: 'SQL Novice', description: 'Earn 500 points', earned: (user.score || 0) >= 500 },
    { name: 'Rising Star', description: 'Earn 1000 points', earned: (user.score || 0) >= 1000 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="animate-fade-in-up">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-gradient-hero text-primary-foreground font-bold text-3xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <div className="flex flex-col md:flex-row items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Level {Math.floor((user.score || 0) / 200) + 1}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <Icon className={`h-5 w-5 ${stat.color} mb-2`} />
                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Progress Section */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your journey to SQL mastery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Next Level</span>
                  <span className="text-sm text-muted-foreground">
                    {user.score % 200} / 200 XP
                  </span>
                </div>
                <Progress value={(user.score % 200) / 2} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-warning" />
                Achievements
              </CardTitle>
              <CardDescription>Unlock achievements as you progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      achievement.earned
                        ? 'bg-gradient-card border-primary/30 shadow-glow'
                        : 'bg-muted/30 border-border opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-warning/20' : 'bg-muted'}`}>
                        <Award className={`h-5 w-5 ${achievement.earned ? 'text-warning' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.earned && (
                          <Badge className="mt-2 bg-success/10 text-success border-success/20" variant="outline">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
