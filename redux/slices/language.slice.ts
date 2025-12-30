"use client";
import { LANGUAGE_KEY } from "@/constants/keys";
import { getItem, setItem } from "@/lib/local-storage";
import { createSlice } from "@reduxjs/toolkit";

export type ILanguage = "en" | "bn";

export interface ILanguageState {
  currentLanguage: ILanguage;
}

const initialState: ILanguageState = {
  currentLanguage: getItem<ILanguage>(LANGUAGE_KEY) || "bn",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action) {
      setItem<ILanguage>(LANGUAGE_KEY, action.payload);
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
