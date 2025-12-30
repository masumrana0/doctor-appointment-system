import status from "http-status";
import catchAsync from "@/app/(backend)/_core/shared/catch-async";
import sendResponse from "@/app/(backend)/_core/shared/api-response";
import { NoticeService } from "../service/notice.service";
import type { Notice } from "@/app/generated/prisma/client";

const getAllNotice = catchAsync(async (req: Request) => {
  const result = await NoticeService.getAllNotice(req);

  return sendResponse<Notice[]>({
    statusCode: status.OK,
    message: "Notice fetched successfully",
    data: result,
  });
});

const createNotice = catchAsync(async (req: Request) => {
  const result = await NoticeService.createNotice(req);

  return sendResponse({
    statusCode: status.CREATED,
    message: "Notice created successfully",
    data: result,
  });
});

const updateNotice = catchAsync(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop() as string;

  const result = await NoticeService.updateNotice(req, id);

  return sendResponse({
    statusCode: status.OK,
    message: "Notice updated successfully",
    data: result,
  });
});

const deleteNotice = catchAsync(async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop() as string;

  await NoticeService.deleteNotice(id);

  return sendResponse({
    statusCode: status.OK,
    message: "Notice deleted successfully",
    data: null,
  });
});

export const NoticeController = {
  getAllNotice,
  createNotice,
  updateNotice,
  deleteNotice,
};
