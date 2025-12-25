import status from "http-status";
import catchAsync from "@/app/(backend)/_core/shared/catch-async";
import { AuthService } from "../service/auth.service";
import sendResponse from "@/app/(backend)/_core/shared/api-response";
import { AuthUtils } from "@/app/(backend)/_core/error-handler/auth";

const login = catchAsync(async (req: Request) => {
  const token = await AuthService.login(req);

  const res = sendResponse({
    statusCode: status.OK,
    message: "User logged in successfully",
    data: null,
  });

  return AuthUtils.setAuthCookies(res, token);
});

const passwordChange = catchAsync(async (req: Request) => {
  await AuthService.passwordChange(req);

  return sendResponse({
    statusCode: status.OK,
    message: "Password changed successfully",
    data: null,
  });
});

export const AuthController = { login, passwordChange };
