import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Navigation } from '../../components/Navigation';
import { Shield, CheckCircle, Search, Lock, Clock, FileCheck } from 'lucide-react';

export function LandingDesign() {
  const navigate = useNavigate(); // ✅ Use hook directly

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/10">
      <Navigation />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 text-primary">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Official Government Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl max-w-4xl mx-auto">
            Local Government Certificate Issuance & Verification System
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Apply for and verify Local Government Indigene Certificates across all 774 Local Governments in Nigeria
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-6 rounded-xl"
              onClick={() => navigate('/register')} // ✅ Direct navigation
            >
              Apply for Certificate
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 rounded-xl"
              onClick={() => navigate('/verify')} // ✅ Direct navigation
            >
              <Search className="w-5 h-5 mr-2" />
              Verify Certificate
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Clock}
            title="Fast Processing"
            description="Get your certificate processed within 7-14 working days"
          />
          <FeatureCard 
            icon={Lock}
            title="Secure & Verified"
            description="All certificates are digitally signed and verifiable"
          />
          <FeatureCard 
            icon={FileCheck}
            title="Nationwide Coverage"
            description="Available across all 774 Local Governments in Nigeria"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <StepCard 
            step="1"
            title="Register"
            description="Create an account with your NIN"
          />
          <StepCard 
            step="2"
            title="Apply"
            description="Fill the application form and upload documents"
          />
          <StepCard 
            step="3"
            title="Payment"
            description="Pay the processing fee securely"
          />
          <StepCard 
            step="4"
            title="Download"
            description="Receive and download your certificate"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-foreground font-semibold">LGCIVS</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Official certificate issuance platform for all Nigerian Local Governments
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">About Us</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">FAQs</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Contact</div>
              </div>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Privacy Policy</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Terms of Service</div>
              </div>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground">Email: support@lgcivs.gov.ng</div>
                <div className="text-muted-foreground">Phone: +234 800 000 0000</div>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 LGCIVS. All rights reserved. Federal Republic of Nigeria
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

interface StepCardProps {
  step: string;
  title: string;
  description: string;
}

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="text-center space-y-3">
      <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-2xl font-semibold">
        {step}
      </div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}