"use client";
import { store } from "@/redux/store";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/shared/error-boundary";
import { toast } from "sonner";

// Client-side language initializer component

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  // Global client-side error handlers to prevent uncaught errors from bubbling to users
  React.useEffect(() => {
    const onUnhandledRejection = (ev: PromiseRejectionEvent) => {
      // Prevent default logging to console in some browsers
      ev.preventDefault();
      try {
        toast.error("An unexpected error occurred");
      } catch {}
      // Send to server log endpoint
      try {
        fetch("/api/log/error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "unhandledrejection",
            reason: String(ev.reason),
            url: location.href,
            userAgent: navigator.userAgent,
          }),
        });
      } catch {}
    };

    const onError = (msg: string | Event, source?: string, lineno?: number, colno?: number, error?: Error) => {
      try {
        toast.error("An unexpected error occurred");
      } catch {}
      try {
        fetch("/api/log/error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "error",
            message: typeof msg === "string" ? msg : String(msg),
            source,
            lineno,
            colno,
            stack: error?.stack,
            url: location.href,
            userAgent: navigator.userAgent,
          }),
        });
      } catch {}
      // returning false lets the error be reported to console as well, keep it true to suppress if desired
      return false;
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection as EventListener);
    // @ts-ignore - window.onerror has a different signature
    window.onerror = onError as OnErrorEventHandler;

    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection as EventListener);
      // @ts-ignore
      window.onerror = null;
    };
  }, []);

  return (
    <Provider store={store}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        <ErrorBoundary>{children}</ErrorBoundary>
      </NextThemesProvider>
    </Provider>
  );
};

export default RootProvider;
