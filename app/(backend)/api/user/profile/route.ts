import { UserController } from "@/app/(backend)/_modules/user/user.controller";

export const GET = UserController.getLoggedInUser;
export const PATCH = UserController.updateLoggedInUser;
