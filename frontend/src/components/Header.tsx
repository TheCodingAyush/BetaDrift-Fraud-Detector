import { Shield, Moon, Sun, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  onBackToHome?: () => void;
}

const Header = ({ isDark, toggleDarkMode, onBackToHome }: HeaderProps) => {
  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/50 transition-theme">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-xl blur-lg opacity-50 animate-pulse-glow" />
              <div className="relative gradient-primary p-2.5 rounded-xl">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold gradient-text">
                Fraud Detection System
              </h1>
              <div className="h-0.5 w-0 group-hover:w-full gradient-primary transition-all duration-300" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {onBackToHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToHome}
                className="flex items-center gap-2 hover:bg-muted transition-all duration-300"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="relative overflow-hidden rounded-full hover:bg-muted transition-all duration-300"
            >
              <div className={`absolute inset-0 gradient-accent opacity-0 hover:opacity-10 transition-opacity`} />
              {isDark ? (
                <Sun className="h-5 w-5 text-warning transition-transform hover:rotate-45" />
              ) : (
                <Moon className="h-5 w-5 text-primary transition-transform hover:-rotate-12" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
