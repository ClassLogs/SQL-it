import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { fetchLeaderboard } from '@/utils/api';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const result = await fetchLeaderboard();
      if (result.success && result.data) {
        setLeaderboard(result.data);
      }
      setLoading(false);
    };
    loadLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-warning" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Medal className="h-6 w-6 text-warning/60" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-warning/20 text-warning border-warning/30';
    if (rank === 2) return 'bg-muted/20 text-muted-foreground border-muted/30';
    if (rank === 3) return 'bg-warning/10 text-warning/70 border-warning/20';
    return 'bg-muted/10 text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="h-10 w-10 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">
            See how you rank against other SQL learners
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Rankings based on total score and completed lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No users yet. Be the first to complete lessons!
                  </p>
                ) : (
                  leaderboard.map((entry, index) => {
                    const rank = index + 1;
                    const isCurrentUser = user?.id === entry.id;
                    
                    return (
                      <div
                        key={entry.id}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 animate-fade-in ${
                          isCurrentUser
                            ? 'bg-primary/10 border-2 border-primary shadow-glow'
                            : 'bg-muted/30 hover:bg-muted/50'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center justify-center w-12">
                          {getRankIcon(rank)}
                        </div>

                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-hero text-primary-foreground font-bold">
                            {entry.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{entry.name}</h3>
                            {isCurrentUser && (
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            )}
                            <Badge className={getRankBadge(rank)} variant="outline">
                              Rank #{rank}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {entry.completedLessons} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {entry.score} points
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {entry.score}
                          </div>
                          <div className="text-xs text-muted-foreground">XP</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {user && !leaderboard.find(e => e.id === user.id) && (
            <Card className="mt-6 border-2 border-dashed border-muted-foreground/20">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Complete lessons to appear on the leaderboard!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
