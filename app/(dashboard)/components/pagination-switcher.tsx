"use client";
import { paginationHelpers } from "@/app/(backend)/_core/helper/pagination-helper";
import { IMeta } from "@/app/(backend)/_core/interface/response";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  selectAppointmentQueryArgs,
  setPagination,
} from "@/redux/slices/appointment-slice";
import React, { useMemo } from "react";

const PaginationSwitcher = ({
  paginationMeta,
  isFetching,
  isLoading,
}: {
  paginationMeta: IMeta;
  isLoading: boolean;
  isFetching: boolean;
}) => {
  const { limit, page } = useAppSelector(selectAppointmentQueryArgs);

  const {
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    totalPagesLabel,
  } = useMemo(() => {
    return paginationHelpers.derivePaginationStats({
      limit: limit,
      page: page,
      total: paginationMeta?.total,
    });
  }, [paginationMeta, limit, page]);

  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="text-sm text-muted-foreground">
        Showing {startIndex || 0}-{endIndex || 0} of{" "}
        {paginationMeta?.total || 0} appointments
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            hasPreviousPage &&
              dispatch(
                setPagination({ page: (paginationMeta?.page || 0) - 1 })
              );
          }}
          disabled={!hasPreviousPage || isLoading || isFetching}
        >
          Previous
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          Page {paginationMeta?.page} of {totalPagesLabel}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            hasNextPage &&
              dispatch(
                setPagination({ page: (paginationMeta?.page || 0) + 1 })
              );
          }}
          disabled={!hasNextPage || isLoading || isFetching}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaginationSwitcher;
