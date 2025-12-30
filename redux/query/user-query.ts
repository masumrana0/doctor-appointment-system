import { User } from "@/interface";
import { baseQuery } from "./base-query";

const userQuery = baseQuery.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation({
      query: (data: Partial<User>) => ({
        url: `/user/create-user`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: build.mutation({
      query: (id: string) => ({
        url: `/user?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    getAllUser: build.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getLoggedInUser: build.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateLoggedInUser: build.mutation({
      query: (data: Partial<User>) => ({
        url: `/user/profile`,
        method: "PATCH",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["user"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateUserMutation,
  useUpdateLoggedInUserMutation,
  useDeleteUserMutation,
  useGetAllUserQuery,
  useGetLoggedInUserQuery,
} = userQuery;
