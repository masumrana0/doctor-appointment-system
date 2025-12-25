import { AuthController } from "@/app/(backend)/_modules/auth/controller/auth.controller";

export const POST = AuthController.login;
export const PATCH = AuthController.passwordChange;
