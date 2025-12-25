"use client";
import { Button } from "@/components/ui/button";
import { translations } from "@/lib/translation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setLanguage } from "@/redux/slices/language.slice";
import { Languages } from "lucide-react";

export const useTranslation = () => {
  const language = useAppSelector((state) => state.lang.currentLanguage);
  const current =
    translations[language as keyof typeof translations] ?? translations.en;

  return (key: keyof typeof translations.en) => {
    return current[key] ?? key;
  };
};

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
