"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Beaker,
  FlaskConical,
  Microscope,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
  Dna,
  Atom,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import apiClient from "@/lib/apiClient";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });

      const token = response.data.token;
      if (!token) throw new Error("Token not found in response");

      localStorage.setItem("token", token);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Login failed. Check your laboratory credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" min-h-screen flex items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 z-0">
        <img
          src="/laboratory-bg.jpg"
          alt="Laboratory Background"
          className="w-full h-full object-cover opacity-20 scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dynamic Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow [animation-delay:2s]" />

        {/* Technical Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Animated Particles (CSS based) */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/40 animate-ping [animation-duration:3s]" />
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-primary/30 animate-ping [animation-duration:4s] [animation-delay:1s]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        {/* Laboratory Brand Header */}
        <div className="flex flex-col items-center mb-10 space-y-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-5 rounded-2xl bg-card border border-primary/20 shadow-2xl animate-float">
              <Beaker className="w-12 h-12 text-primary" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-primary animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90">
              Lab
            </h1>
            <p className="text-sm font-medium text-primary/60 tracking-widest uppercase">
              Inventory Transaction System
            </p>
          </div>
        </div>

        <Card className="border-primary/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] backdrop-blur-xl bg-card/60 overflow-hidden relative">
          {/* Subtle top border gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-center">
               Login
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground/80">
              Enter your credentials to access the Laboratory Inventory 
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Access NAME
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="username"
                    placeholder="Enter researcher ID"
                    className="pl-10 h-12 bg-background/40 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all duration-300 rounded-xl"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <Label
                    htmlFor="password"
                    title="Standard Laboratory Passkey"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Passkey
                  </Label>
                  {/* <a
                    href="#"
                    className="text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                  >
                    Lost Key?
                  </a> */}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 bg-background/40 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all duration-300 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-3 animate-in fade-in zoom-in-95">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-sm font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_20px_-5px_var(--primary)] active:scale-[0.98] rounded-xl bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Synchronizing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Authorize Access
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          {/* <CardFooter className="flex flex-col space-y-4 pb-8">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted/30 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-primary/60" />
              End-to-End Encrypted Session
            </div>
          </CardFooter> */}
        </Card>

        {/* Dynamic Background Icons */}
        <div className="absolute -z-10 -top-16 -left-16 p-4 rounded-full bg-primary/5 blur-sm animate-float [animation-duration:7s]">
          <Microscope className="w-10 h-10 text-primary/10" />
        </div>
        <div className="absolute -z-10 -top-24 right-0 p-4 rounded-full bg-primary/5 blur-sm animate-float [animation-duration:11s]">
          <Dna className="w-12 h-12 text-primary/10 rotate-12" />
        </div>
        <div className="absolute -z-10 bottom-32 -left-20 p-4 rounded-full bg-primary/5 blur-sm animate-float [animation-duration:8s]">
          <Atom className="w-14 h-14 text-primary/10 -rotate-12" />
        </div>
        <div className="absolute -z-10 -bottom-16 -right-16 p-4 rounded-full bg-primary/5 blur-sm animate-float [animation-duration:9s]">
          <FlaskConical className="w-10 h-10 text-primary/10" />
        </div>
      </div>

      {/* Footer Legal/Info */}
      {/* <div className="absolute bottom-6 w-full text-center px-4 pointer-events-none">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
          System Version 2.4.0-Alpha // Authorized Personnel Only
        </p>
      </div> */}
    </div>
  );
}
