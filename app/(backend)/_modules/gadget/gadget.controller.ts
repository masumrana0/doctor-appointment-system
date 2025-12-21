import status from "http-status";
import sendResponse from "../../_core/shared/api-response";
import catchAsync from "../../_core/shared/catch-async";
import { GadgetService } from "./gadget.service";

const createGadget = catchAsync(async (req: Request) => {
  const result = await GadgetService.createGadget(req);
  return sendResponse({
    statusCode: status.CREATED,
    message: "Gadget created successfully",
    data: result,
  });
});

const updateGadget = catchAsync(async (req: Request) => {
  const result = await GadgetService.updateGadget(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Gadget updated successfully",
    data: result,
  });
});

const deleteGadget = catchAsync(async (req: Request) => {
  const result = await GadgetService.deleteGadget(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Gadget deleted successfully",
    data: result,
  });
});

// for admin
const getAllGadget = catchAsync(async (req: Request) => {
  const result = await GadgetService.getAllGadget(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Gadget retrieved successfully",
    data: result,
  });
});

const getOneGadget = catchAsync(async (req: Request) => {
  const result = await GadgetService.getOneGadget(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Gadget retrieved successfully",
    data: result,
  });
});

export const GadgetController = {
  createGadget,
  getAllGadget,
  getOneGadget,
  updateGadget,
  deleteGadget,
};
