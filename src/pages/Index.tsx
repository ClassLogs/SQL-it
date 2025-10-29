import { Link } from 'react-router-dom';
import { ArrowRight, Database, Code, Trophy, Zap, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Structured Lessons',
      description: 'Learn SQL step-by-step with comprehensive tutorials',
    },
    {
      icon: Code,
      title: 'Interactive Practice',
      description: 'Write and execute real SQL queries in the browser',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get immediate results and learn from mistakes',
    },
    {
      icon: Trophy,
      title: 'Leaderboard',
      description: 'Compete with others and track your progress',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join thousands of learners mastering SQL',
    },
    {
      icon: Database,
      title: 'Real Databases',
      description: 'Practice with actual database scenarios',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center animate-fade-in-up">
            <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight">
              Master SQL
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                The Interactive Way
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Learn SQL through hands-on practice, interactive lessons, and real-world challenges.
              Perfect for beginners and pros alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={user ? '/dashboard' : '/signup'}>
                <Button size="lg" className="group text-lg px-8 shadow-glow">
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/lessons">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Explore Lessons
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Learn SQL
            </h2>
            <p className="text-muted-foreground text-lg">
              A complete platform for interactive SQL education
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden border-border hover:shadow-card transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-card opacity-50" />
                  <CardContent className="relative p-6">
                    <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-primary/20">
            <div className="absolute inset-0 bg-gradient-hero opacity-5" />
            <CardContent className="relative p-12 text-center">
              <h2 className="mb-4 text-3xl md:text-4xl font-bold">
                Ready to Start Your SQL Journey?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join thousands of learners and become a SQL expert today
              </p>
              <Link to={user ? '/dashboard' : '/signup'}>
                <Button size="lg" className="shadow-glow">
                  {user ? 'Continue Learning' : 'Sign Up Now - It\'s Free'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
