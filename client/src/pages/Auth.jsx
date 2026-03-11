import React, { useState } from "react";
import { SignIn, SignUp, useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
import { Lock, Mail, PawPrint, ShieldCheck, Sparkles } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState("signin");
  const { isSignedIn, isLoaded } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card-glass rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember text-white">
            <PawPrint size={20} />
          </span>
          <div>
            <h2 className="text-xl font-semibold">{mode === "signin" ? "Welcome back" : "Join PetCare"}</h2>
            <p className="text-xs text-ink/50">{mode === "signin" ? "Sign in to your account" : "Create your free account"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm mb-6">
          <button
            className={mode === "signin" ? "btn-primary" : "btn-outline"}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            className={mode === "signup" ? "btn-primary" : "btn-outline"}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>
        <div className="clerk-container">
          {mode === "signin" ? (
            <SignIn routing="hash" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard" />
          ) : (
            <SignUp routing="hash" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard" />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-ink/10 bg-white p-8">
          <h2 className="text-xl font-semibold">Secure Authentication</h2>
          <p className="mt-2 text-sm text-ink/60">Powered by Clerk for enterprise-grade security.</p>
          <div className="mt-6 space-y-4">
            {[
              { icon: Mail, title: "Email OTP", desc: "Receive a secure one-time code in your inbox" },
              { icon: ShieldCheck, title: "Google Sign-In", desc: "Quick and secure login with your Google account" },
              { icon: Lock, title: "Session Security", desc: "Encrypted tokens with automatic refresh" }
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-ink/5 p-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-ember/10 text-ember">
                  <item.icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-ink/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-ember/5 p-4 text-xs text-ink/60">
          <span className="flex items-center gap-2 font-semibold text-ink/80">
            <Sparkles size={14} className="text-ember" /> New here?
          </span>
          <p className="mt-1">Sign up to browse listings, request purchases, and chat with sellers.</p>
        </div>
      </div>
    </div>
  );
}
