/**
 * Title: 'Calculate pagination helper made by Masum Rana'
 * Description: ''
 * Author: 'Masum Rana'
 * createdAt: 28-04-2025
 *
 */

import { IMeta } from "../interface/response";

type SortOrder = "asc" | "desc";
type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
};

const calculatePagination = (options: IOptions): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 20);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

const derivePaginationStats = (meta: IMeta) => {
  const totalPages = Math.ceil((meta?.total || 0) / (meta?.limit || 1));
  const hasNextPage = (meta?.page || 0) < totalPages;
  const hasPreviousPage = (meta?.page || 0) > 1;
  const startIndex =
    meta?.total === 0 ? 0 : (meta?.page! - 1) * meta?.limit! + 1;
  const endIndex = Math.min(meta?.page! * meta?.limit!, meta?.total || 0);
  const totalPagesLabel = totalPages;
  return {
    totalPages,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    totalPagesLabel,
  };
};

export const paginationHelpers = {
  calculatePagination,
  derivePaginationStats,
};
