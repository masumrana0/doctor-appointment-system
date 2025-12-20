"use client";
import { Button } from "@/components/ui/button";
import { translations } from "@/lib/translation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setLanguage } from "@/redux/slices/language.slice";
import { Languages } from "lucide-react";

export const selectT = (key: keyof typeof translations.en) => {
  const language = useAppSelector((state) => state.lang.currentLanguage);
  return translations[language][key] ?? key;
};

export const t = (key: keyof typeof translations.en) => selectT(key);

export const LanguageSwitch = () => {
  const language = useAppSelector((state) => state.lang.currentLanguage);
  const dispatch = useAppDispatch();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => dispatch(setLanguage(language === "en" ? "bn" : "en"))}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">
        {language === "en" ? "English" : "বাংলা"}
      </span>
    </Button>
  );
};
