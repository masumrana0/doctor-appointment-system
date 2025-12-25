import { ID, IUpdateQueryType, Notice } from "@/interface";
import { baseQuery } from "./base-query";

const noticeQuery = baseQuery.injectEndpoints({
  endpoints: (build) => ({
    getAllNotice: build.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["notice"],
    }),
    createNotice: build.mutation({
      query: (data: Notice) => ({
        url: "/notice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notice"],
    }),
    updateNotice: build.mutation({
      query: ({ data, id }: IUpdateQueryType<Notice>) => ({
        url: `/notice/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["notice"],
    }),
    deleteNotice: build.mutation({
      query: (id: ID) => ({
        url: "/notice",
        method: "PATCH",
      }),
      invalidatesTags: ["notice"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateNoticeMutation,
  useGetAllNoticeQuery,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = noticeQuery;
