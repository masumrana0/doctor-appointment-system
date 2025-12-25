"use client";
import { store } from "@/redux/store";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";

// Client-side language initializer component

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        {children}
      </NextThemesProvider>
    </Provider>
  );
};

export default RootProvider;
