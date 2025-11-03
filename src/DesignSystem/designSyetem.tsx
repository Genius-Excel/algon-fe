// src/components/DesignSystem.tsx
import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../components/ui/utils';

// Page Header Component
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, action, onBack }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                ← Back
              </Button>
            )}
            <div>
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
}

// Logo Component
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        sizes[size],
        "rounded-xl bg-primary flex items-center justify-center"
      )}>
        <Shield className={cn(iconSizes[size], "text-white")} />
      </div>
      {showText && (
        <div>
          <div className="text-foreground font-semibold">LGCIVS</div>
          <div className="text-xs text-muted-foreground">Certificate System</div>
        </div>
      )}
    </div>
  );
}

// Page Container
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '7xl' | 'full';
}

export function PageContainer({ children, className, maxWidth = '7xl' }: PageContainerProps) {
  const maxWidths = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    '3xl': 'max-w-6xl',
    '4xl': 'max-w-7xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  return (
    <div className={cn(
      maxWidths[maxWidth],
      "mx-auto px-4 sm:px-6 lg:px-8 py-8",
      className
    )}>
      {children}
    </div>
  );
}

// Section Header
interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={cn(
        sizes[size],
        "border-2 border-primary border-t-transparent rounded-full animate-spin"
      )} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

// Step Progress Indicator
interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function StepProgress({ currentStep, totalSteps, steps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="relative">
        <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={cn(
              "text-xs transition-colors",
              index + 1 <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}