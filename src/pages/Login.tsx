import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface LoginProps {
  onNavigate: (page: string) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (userType: string) => {
    // Mock login - redirect to appropriate dashboard
    if (userType === 'applicant') {
      onNavigate('applicant-dashboard');
    } else if (userType === 'lg-admin') {
      onNavigate('lg-admin-dashboard');
    } else if (userType === 'super-admin') {
      onNavigate('super-admin-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl text-foreground">LGCIVS</div>
              <div className="text-xs text-muted-foreground">Login to your account</div>
            </div>
          </div>
        </div>

        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose your account type to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="applicant" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="applicant">Applicant</TabsTrigger>
                <TabsTrigger value="lg-admin">LG Admin</TabsTrigger>
                <TabsTrigger value="super-admin">Super Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="applicant" className="space-y-4 mt-6">
                <LoginForm 
                  onLogin={() => handleLogin('applicant')}
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                />
              </TabsContent>
              
              <TabsContent value="lg-admin" className="space-y-4 mt-6">
                <LoginForm 
                  onLogin={() => handleLogin('lg-admin')}
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                />
              </TabsContent>
              
              <TabsContent value="super-admin" className="space-y-4 mt-6">
                <LoginForm 
                  onLogin={() => handleLogin('super-admin')}
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <button 
                onClick={() => onNavigate('register')}
                className="text-sm text-primary hover:underline"
              >
                Don't have an account? Register here
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <button 
            onClick={() => onNavigate('landing')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onLogin, email, password, setEmail, setPassword }: any) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email or NIN</Label>
        <Input 
          id="email"
          type="text" 
          placeholder="Enter your email or NIN"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password"
          type="password" 
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg"
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span className="text-muted-foreground">Remember me</span>
        </label>
        <button type="button" className="text-primary hover:underline">
          Forgot password?
        </button>
      </div>
      <Button type="submit" className="w-full rounded-lg">
        Sign In
      </Button>
    </form>
  );
}
