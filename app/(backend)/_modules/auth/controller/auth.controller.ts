import catchAsync from "@/app/(backend)/_core/shared/catch-async";
import { AuthService } from "../service/auth.service";

const login = catchAsync(async (req: Request) => {
  await AuthService.login(req);


  
  return sendResponse({
    statusCode: status.CREATED,
    message: "Article created successfully",
    data: result,
  });
});
