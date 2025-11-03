import { Button } from "./ui/button";
import { Shield, Menu } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  onNavigate: (page: string) => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate("landing")}
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-foreground">LGCIVS</div>
              <div className="text-xs text-muted-foreground">
                Certificate System
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate("verify")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Verify Certificate
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </button>
            <Button variant="outline" onClick={() => onNavigate("login")}>
              Login
            </Button>
            <Button onClick={() => onNavigate("register")}>Apply Now</Button>
          </div>

          <button
            className="md:hidden"
            aria-label="menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => {
                onNavigate("verify");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-foreground hover:text-primary"
            >
              Verify Certificate
            </button>
            <button
              onClick={() => {
                onNavigate("about");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-foreground hover:text-primary"
            >
              About
            </button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onNavigate("login");
                setMobileMenuOpen(false);
              }}
            >
              Login
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                onNavigate("register");
                setMobileMenuOpen(false);
              }}
            >
              Apply Now
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
