"use client";
import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </Provider>
  );
};

export default RootProvider;
