import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./slices/language.slice";
import { baseQuery } from "./query/base-query";
import appointmentQueryReducer from "./slices/appointment-slice";

export const store = configureStore({
  reducer: {
    lang: languageReducer,
    [baseQuery.reducerPath]: baseQuery.reducer,
    appointmentQuery: appointmentQueryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseQuery.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
