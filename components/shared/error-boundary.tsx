"use client";
import React from "react";
import { toast } from "sonner";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Show friendly toast
    try {
      toast.error("An unexpected error occurred. Reloading may help.");
    } catch (e) {
      // noop during SSR or if toast not available
    }

    // Send minimal error info to server for logging
    if (typeof window !== "undefined") {
      fetch("/api/log/error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          info,
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {
        // swallow errors
      });
    }

    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-lg w-full text-center">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">
              An unexpected error occurred. Please reload the page or try again
              later.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                className="px-4 py-2 rounded bg-primary text-primary-foreground"
                onClick={() => location.reload()}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
