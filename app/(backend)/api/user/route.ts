import { UserController } from "../../_modules/user/user.controller";

export const PATCH = UserController.updateUser;

export const DELETE = UserController.deleteUSer;

export const GET = UserController.getAllUser;
