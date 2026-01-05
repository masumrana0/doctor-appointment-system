"use client";
import React from "react";
import Link from "next/link";

export default function GlobalError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mb-4">
          An unexpected error occurred. We have been notified and are looking
          into it. Please try again later.
        </p>
        <div className="flex gap-2 justify-center">
          <Link href="/" className="px-4 py-2 rounded bg-primary text-primary-foreground">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
