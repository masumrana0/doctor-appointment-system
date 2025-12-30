import status from "http-status";
import catchAsync from "@/app/(backend)/_core/shared/catch-async";
import sendResponse from "@/app/(backend)/_core/shared/api-response";
import { SuperAdminService } from "../service/super-admin.service";

const getDashboardStats = catchAsync(async () => {
  const result = await SuperAdminService.getDashboardOverview();

  return sendResponse({
    statusCode: status.OK,
    message: "Dashboard stats fetched successfully",
    data: result,
  });
});

export const SuperAdminController = { getDashboardStats };
