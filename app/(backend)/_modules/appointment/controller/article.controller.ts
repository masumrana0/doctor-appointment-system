import status from "http-status";
import sendResponse from "../../../_core/shared/api-response";
import catchAsync from "../../../_core/shared/catch-async";
import { AppoinmentService } from "../service/Appoinment.service";

const createAppoinment = catchAsync(async (req: Request) => {
  const result = await AppoinmentService.createAppoinment(req);
  return sendResponse({
    statusCode: status.CREATED,
    message: "Appoinment created successfully",
    data: result,
  });
});

const updateAppoinment = catchAsync(async (req: Request) => {
  const result = await AppoinmentService.updateAppoinment(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Appoinment updated successfully",
    data: result,
  });
});

const deleteAppoinment = catchAsync(async (req: Request) => {
  const result = await AppoinmentService.deleteAppoinment(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Appoinment deleted successfully",
    data: result,
  });
});

// for admin
const getAllAppoinment = catchAsync(async (req: Request) => {
  const result = await AppoinmentService.getAllAppoinment(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Appoinment retrieved successfully",
    data: result,
  });
});

// get all featured Appoinment
const getAllFeaturedAppoinment = catchAsync(async (req: Request) => {
  const result = await AppoinmentService.getAllFeaturedAppoinment(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Appoinment retrieved successfully",
    data: result,
  });
});

// get all Latest Appoinment
const getAllLatestAppoinment = catchAsync(async (req: Request) => {
  const result = await AppoinmentService.getAllFeaturedAppoinment(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Appoinment retrieved successfully",
    data: result,
  });
});

const getOneAppoinment = catchAsync(async (req: Request) => {
  const result = await AppoinmentService.getOneAppoinment(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Appoinment retrieved successfully",
    data: result,
  });
});

const getForHomePage = catchAsync(async (req: Request) => {
  const result = await AppoinmentService.getForHomePage(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Home Appoinments retrieved successfully",
    data: result,
  });
});

const getForNavbar = catchAsync(async (req: Request) => {
  const result = await AppoinmentService.getForNavbar(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Navbar Appoinments retrieved successfully",
    data: result,
  });
});

export const AppoinmentController = {
  createAppoinment,
  updateAppoinment,
  deleteAppoinment,
  getAllAppoinment,
  getForHomePage,
  getForNavbar,
  getOneAppoinment,
  getAllFeaturedAppoinment,
  getAllLatestAppoinment,
};
