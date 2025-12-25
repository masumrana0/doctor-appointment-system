import status from "http-status";
import sendResponse from "../../_core/shared/api-response";
import catchAsync from "../../_core/shared/catch-async";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req: Request) => {
  const result = await UserService.createUser(req);

  return sendResponse({
    statusCode: status.CREATED,
    message: "The user has been created successfully",
    data: result,
  });
});

const getLoggedInUser = catchAsync(async () => {
  const result = await UserService.getLoggedInUser();
  
  return sendResponse({
    statusCode: status.OK,
    message: "user fetched successful",
    data: result,
  });
});
const getAllUser = catchAsync(async () => {
  const result = await UserService.getAllUser();

  return sendResponse({
    statusCode: status.OK,
    message: "user fetched successful",
    data: result,
  });
});

const updateLoggedInUser = catchAsync(async (req: Request) => {
  const result = await UserService.updateLoggedInUser(req);

  return sendResponse({
    statusCode: status.OK,
    message: "user update  successful",
    data: result,
  });
});

const deleteUSer = catchAsync(async (req: Request) => {
  const result = await UserService.deleteUser(req);

  return sendResponse({
    statusCode: status.OK,
    message: "user delete  successful",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUser,
  updateLoggedInUser,
  deleteUSer,
  getLoggedInUser,
};
