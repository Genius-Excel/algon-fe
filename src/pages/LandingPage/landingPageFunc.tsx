// src/pages/Landing/LandingFunc.tsx
import { LandingDesign } from './landingPageDesign';
import type { NavigationProps } from '../../Types/types';

export function Landing({ onNavigate }: NavigationProps) {
  // Landing page has minimal logic - just pass through navigation
  return <LandingDesign onNavigate={onNavigate} />;
}