import { useEffect, useState } from 'react';
import { Shield, ChevronRight, Upload, BarChart3, AlertTriangle, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const WelcomeScreen = ({ onStart, isDark, toggleDarkMode }: WelcomeScreenProps) => {
  const [showContent, setShowContent] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setShowFeatures(true), 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const features = [
    { icon: Upload, title: 'Upload CSV', description: 'Drag & drop your transaction data' },
    { icon: BarChart3, title: 'Instant Analysis', description: 'AI-powered fraud detection' },
    { icon: AlertTriangle, title: 'Risk Assessment', description: 'Detailed risk scoring' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Dark mode toggle in top-right corner */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="relative overflow-hidden rounded-full hover:bg-muted transition-all duration-300 glass-card"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-warning transition-transform hover:rotate-45" />
          ) : (
            <Moon className="h-5 w-5 text-primary transition-transform hover:-rotate-12" />
          )}
        </Button>
      </div>

      {/* Simplified background - removed heavy blur circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 gradient-primary rounded-full opacity-10" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 gradient-accent rounded-full opacity-10" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Animated logo */}
        <div className={`mb-8 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative inline-block">
            <div className="absolute inset-0 gradient-primary rounded-3xl blur-2xl opacity-50 animate-pulse-glow" />
            <div className="relative gradient-primary p-6 rounded-3xl">
              <Shield className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1
          className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-1000 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <span className="gradient-text drop-shadow-lg">Fraud Detection</span>
          <br />
          <span className="text-foreground drop-shadow-sm">System</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg md:text-xl text-muted-foreground mb-12 max-w-xl mx-auto transition-all duration-1000 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          Upload your CSV to detect fraudulent transactions with advanced AI-powered analysis
        </p>

        {/* Features */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 transition-all duration-1000 ${showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:glow-primary"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <feature.icon className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={onStart}
          size="lg"
          className={`gradient-primary text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group ${showFeatures ? 'animate-bounce-in' : 'opacity-0'}`}
        >
          Get Started
          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
