import status from "http-status";
import catchAsync from "@/app/(backend)/_core/shared/catch-async";
import sendResponse from "@/app/(backend)/_core/shared/api-response";
import { GadgetBrandService } from "./gadgetBand.service";

const createGadgetBrand = catchAsync(async (req: Request) => {
  const result = await GadgetBrandService.createGadgetBrand(req);

  return sendResponse({
    statusCode: status.CREATED,
    message: "GadgetBrand created done",
    data: result,
  });
});

const updateGadgetBrand = catchAsync(async (req: Request) => {
  const result = await GadgetBrandService.updateGadgetBrand(req);

  return sendResponse({
    statusCode: status.OK,
    message: "GadgetBrand updated done",
    data: result,
  });
});

const getAllGadgetBrand = catchAsync(async (req: Request) => {
  const result = await GadgetBrandService.getAllGadgetBrand(req);

  return sendResponse({
    statusCode: status.OK,
    message: "GadgetBrand Fetched done",
    data: result,
  });
});

const deleteGadgetBrand = catchAsync(async (req: Request) => {
  const result = await GadgetBrandService.deleteGadgetBrand(req);

  return sendResponse({
    statusCode: status.OK,
    message: "GadgetBrand delete successful",
    data: result,
  });
});

export const GadgetBrandController = {
  createGadgetBrand,
  updateGadgetBrand,
  getAllGadgetBrand,
  deleteGadgetBrand,
};
