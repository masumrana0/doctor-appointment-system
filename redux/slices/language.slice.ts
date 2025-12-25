import { LANGUAGE_KEY } from "@/constants/keys";
import { LocalStorage } from "@/lib/localstorage";
import { createSlice } from "@reduxjs/toolkit";

export type ILanguage = "en" | "bn";

export interface ILanguageState {
  currentLanguage: ILanguage;
}

const initialState: ILanguageState = {
  currentLanguage: (localStorage?.getItem(LANGUAGE_KEY) as ILanguage) || "bn",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action) {
      LocalStorage.setItem(LANGUAGE_KEY, action.payload);
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
