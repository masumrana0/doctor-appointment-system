import { ID, IUpdateQueryType, Notice } from "@/interface";
import { baseQuery } from "./base-query";

const noticeQuery = baseQuery.injectEndpoints({
  endpoints: (build) => ({
    getAllNotice: build.query({
      query: () => ({
        url: "/notice",
        method: "GET",
      }),
      providesTags: ["notice"],
    }),
    getActiveNotice: build.query({
      query: () => ({
        url: "/notice?active=true",
        method: "GET",
      }),
      providesTags: ["notice"],
    }),
    getNavPinNotice: build.query({
      query: () => ({
        url: "/notice?pinNav=true",
        method: "GET",
      }),
      providesTags: ["notice"],
    }),
    createNotice: build.mutation({
      query: (data: Pick<Notice, "title" | "content"> & Partial<Notice>) => ({
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
        url: `/notice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notice"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateNoticeMutation,
  useGetAllNoticeQuery,
  useGetActiveNoticeQuery,
  useGetNavPinNoticeQuery,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = noticeQuery;
