import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = createApi({
  reducerPath: "baseQuery",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  endpoints: (build) => ({}),

  tagTypes: ["appointment", "user", "settings", "notice"],
});
