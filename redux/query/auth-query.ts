import { LoginData } from "@/interface";
import { baseQuery } from "./base-query";

const authQuery = baseQuery.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data: LoginData) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    passwordChange: build.mutation({
      query: (data: { currentPassword: string; newPassword: string }) => ({
        url: "/auth/password-change",
        method: "PATCH",
        body: data,
      }), 
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, usePasswordChangeMutation } = authQuery;
