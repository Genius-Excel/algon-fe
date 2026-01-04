import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Shield } from 'lucide-react';

export function Navigation() {
  const navigate = useNavigate(); // ✅ Use hook directly

  return (
    <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-foreground font-semibold">LGCIVS</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/verify')}
            >
              Verify Certificate
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}