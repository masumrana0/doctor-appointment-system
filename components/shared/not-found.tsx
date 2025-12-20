"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Phone, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);

  

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ backgroundColor: "oklch(0.646 0.222 41.116)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            backgroundColor: "oklch(0.6 0.118 184.704)",
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{
            backgroundColor: "oklch(0.828 0.189 84.429)",
            animationDelay: "2s",
          }}
        />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
        {/* Animated Medical Cross */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <div className="relative">
            {/* Pulsing ring */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: "oklch(0.6 0.118 184.704)" }}
            />
            {/* Medical cross container */}
            <div
              className="relative flex h-32 w-32 items-center justify-center rounded-full backdrop-blur-xl border border-white/20"
              style={{ backgroundColor: "oklch(0.6 0.118 184.704 / 0.15)" }}
            >
              {/* Cross shape */}
              <div className="relative h-16 w-16">
                <div
                  className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 rounded-sm"
                  style={{ backgroundColor: "oklch(0.6 0.118 184.704)" }}
                />
                <div
                  className="absolute top-1/2 left-0 h-4 w-full -translate-y-1/2 rounded-sm"
                  style={{ backgroundColor: "oklch(0.6 0.118 184.704)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 404 Text with staggered animation */}
        <div
          className={`flex items-center gap-2 transition-all duration-700 delay-300 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <span
            className="text-8xl md:text-9xl font-bold"
            style={{ color: "oklch(0.646 0.222 41.116)" }}
          >
            4
          </span>
          {/* Animated stethoscope/heartbeat icon */}
          <div className="relative mx-2">
            <svg
              viewBox="0 0 100 100"
              className="h-20 w-20 md:h-24 md:w-24"
              style={{ color: "oklch(0.6 0.118 184.704)" }}
            >
              {/* Heartbeat line */}
              <path
                d="M 0 50 L 25 50 L 35 30 L 45 70 L 55 40 L 65 60 L 75 50 L 100 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
                style={{
                  strokeDasharray: "200",
                  strokeDashoffset: mounted ? "0" : "200",
                  transition: "stroke-dashoffset 2s ease-in-out",
                }}
              />
            </svg>
          </div>
          <span
            className="text-8xl md:text-9xl font-bold"
            style={{ color: "oklch(0.646 0.222 41.116)" }}
          >
            4
          </span>
        </div>

        {/* Message */}
        <div
          className={`mt-6 text-center transition-all duration-700 delay-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Page Not Found
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
            Oops! It seems the page you&apos;re looking for has been moved or
            doesn&apos;t exist. Let us help you find your way back to your
            health journey.
          </p>
        </div>

        {/* Action buttons with glassmorphic style */}
        <div
          className={`mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-700 delay-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden backdrop-blur-xl border border-white/20 text-white hover:scale-105 transition-transform"
            style={{ backgroundColor: "oklch(0.6 0.118 184.704)" }}
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="backdrop-blur-xl border-white/20 bg-white/5 hover:bg-white/10 hover:scale-105 transition-transform"
          >
            <Link href="/appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
            </Link>
          </Button>
        </div>

        {/* Quick links */}
        <div
          className={`mt-12 transition-all duration-700 delay-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div
            className="rounded-2xl p-6 backdrop-blur-xl border border-white/10"
            style={{ backgroundColor: "oklch(0.6 0.118 184.704 / 0.05)" }}
          >
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Need immediate assistance?
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
              <Link
                href="/contact"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone
                  className="h-4 w-4"
                  style={{ color: "oklch(0.646 0.222 41.116)" }}
                />
                Contact Support
              </Link>
              <span className="hidden sm:inline text-border">|</span>
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft
                  className="h-4 w-4"
                  style={{ color: "oklch(0.6 0.118 184.704)" }}
                />
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Floating medical icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Pill icon */}
          <div
            className={`absolute top-20 left-10 transition-all duration-1000 delay-500 ${
              mounted ? "opacity-20 translate-y-0" : "opacity-0 -translate-y-10"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 animate-bounce"
              style={{
                color: "oklch(0.646 0.222 41.116)",
                animationDelay: "0.5s",
                animationDuration: "3s",
              }}
            >
              <path
                fill="currentColor"
                d="M4.22 11.29l5.67-5.67a5 5 0 0 1 7.07 7.07l-5.67 5.67a5 5 0 0 1-7.07-7.07zm2.83 4.24a2 2 0 0 0 2.83 0l2.83-2.83l-2.83-2.83l-2.83 2.83a2 2 0 0 0 0 2.83z"
              />
            </svg>
          </div>
          {/* Heart icon */}
          <div
            className={`absolute top-32 right-20 transition-all duration-1000 delay-700 ${
              mounted ? "opacity-20 translate-y-0" : "opacity-0 -translate-y-10"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10 animate-pulse"
              style={{ color: "oklch(0.577 0.245 27.325)" }}
            >
              <path
                fill="currentColor"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </div>
          {/* Stethoscope */}
          <div
            className={`absolute bottom-32 left-20 transition-all duration-1000 delay-900 ${
              mounted ? "opacity-15 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-12 w-12 animate-bounce"
              style={{
                color: "oklch(0.6 0.118 184.704)",
                animationDelay: "1s",
                animationDuration: "4s",
              }}
            >
              <path
                fill="currentColor"
                d="M19 8c0-3.31-2.69-6-6-6h-2v2h2c2.21 0 4 1.79 4 4v6c0 2.21-1.79 4-4 4s-4-1.79-4-4v-1H7v1c0 3.31 2.69 6 6 6s6-2.69 6-6V8zM5 8c0-1.1.9-2 2-2h2V4H7c-2.21 0-4 1.79-4 4v6c0 2.21 1.79 4 4 4h2v-2H7c-1.1 0-2-.9-2-2V8zm14 11c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2z"
              />
            </svg>
          </div>
          {/* Clipboard */}
          <div
            className={`absolute bottom-20 right-10 transition-all duration-1000 delay-1100 ${
              mounted ? "opacity-15 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 animate-pulse"
              style={{
                color: "oklch(0.828 0.189 84.429)",
                animationDelay: "1.5s",
              }}
            >
              <path
                fill="currentColor"
                d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
