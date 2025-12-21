import catchAsync from "@/app/(backend)/_core/shared/catch-async";
import status from "http-status";
import { GadgetTypeService } from "./gadgetType.service";
import sendResponse from "@/app/(backend)/_core/shared/api-response";
 

const createGadgetType = catchAsync(async (req: Request) => {
 
  const result = await GadgetTypeService.createGadgetType(req);

  return sendResponse({
    statusCode: status.CREATED,
    message: "GadgetType created done",
    data: result,
  });
});

const updateGadgetType = catchAsync(async (req: Request) => {
  const result = await GadgetTypeService.updateGadgetType(req);

  return sendResponse({
    statusCode: status.OK,
    message: "GadgetType updated done",
    data: result,
  });
});

const getAllGadgetType = catchAsync(async (req: Request) => {
  const result = await GadgetTypeService.getAllGadgetType(req);

  return sendResponse({
    statusCode: status.OK,
    message: "GadgetType Fetched done",
    data: result,
  });
});

const deleteGadgetType = catchAsync(async (req: Request) => {
  const result = await GadgetTypeService.deleteGadgetType(req);

  return sendResponse({
    statusCode: status.OK,
    message: "GadgetType delete successful",
    data: result,
  });
});

export const GadgetTypeController = {
  createGadgetType,
  updateGadgetType,
  getAllGadgetType,
  deleteGadgetType,
};
