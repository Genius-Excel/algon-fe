// src/pages/Login/LoginDesign.tsx
import React from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Logo, PageContainer } from "../../DesignSystem/designSyetem";
import type { UserRole } from "../../Types/types";

interface LoginDesignProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLogin: (userType: UserRole) => void;
  onNavigate: (page: string) => void;
}

export function LoginDesign({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  onNavigate,
}: LoginDesignProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-white flex items-center justify-center p-4">
      <PageContainer maxWidth="sm" className="w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Logo size="lg" />
          </div>
        </div>

        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="applicant" className="w-full">
              <TabsContent value="applicant" className="space-y-4 mt-6">
                <LoginForm
                  onLogin={() => handleLogin("applicant")}
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                />
              </TabsContent>

              <TabsContent value="lg-admin" className="space-y-4 mt-6">
                <LoginForm
                  onLogin={() => handleLogin("lg-admin")}
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                />
              </TabsContent>

              <TabsContent value="super-admin" className="space-y-4 mt-6">
                <LoginForm
                  onLogin={() => handleLogin("super-admin")}
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigate("register")}
                className="text-sm text-primary hover:underline"
              >
                Don't have an account? Register here
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate("landing")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </button>
        </div>
      </PageContainer>
    </div>
  );
}

interface LoginFormProps {
  onLogin: () => void;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

function LoginForm({
  onLogin,
  email,
  password,
  setEmail,
  setPassword,
}: LoginFormProps) {
  return (
    <div className="space-y-4">
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
      <Button onClick={onLogin} className="w-full rounded-lg">
        Sign In
      </Button>
    </div>
  );
}
