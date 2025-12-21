import { uploader } from "@/lib/uploader/uploader";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import Auth from "../../_core/error-handler/auth";
import { ApiErrors } from "../../_core/errors/api-error";
import { passwordHelper } from "../../_core/helper/password-security";
/**
 * Title: ''
 * Description: ''
 * Author: 'Masum Rana'
 * Date: 31-05-2025
 *
 */

const createUser = async (req: Request) => {
  const session = await Auth([Role.ADMIN, Role.SUPER_ADMIN]);

  const { password, ...payload } = await req.json();

  if (payload.role === Role.SUPER_ADMIN && session.user.role === "ADMIN") {
    throw ApiErrors.Forbidden("you are not allow to create super_admin");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw ApiErrors.BadRequest("This email already existed");
  }

  // Hash password
  const hashedPassword = await passwordHelper.convertHashPassword(password);

  const readyData = { ...payload, password: hashedPassword };

  // Create user
  const user = await prisma.user.create({
    data: readyData,
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const getAllUser = async () => {
  await Auth([Role.ADMIN, Role.SUPER_ADMIN]);
  const result = await prisma.user.findMany({});
  return result;
};

const updateUser = async (req: Request) => {
  const session = await Auth([Role.ADMIN, Role.SUPER_ADMIN]);

  const id = session.user.id;

  const isExistUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!isExistUser) {
    throw ApiErrors.NotFound("User not found");
  }

  const formData = await req.formData();
  const file = formData.get("imgFile") as File;
  const payloadStr = formData.get("payload") as string;

  const payload: any = {};
  if (payloadStr) {
    Object.assign(payload, JSON.parse(payloadStr));
  }

  const { newPassword, oldPassword, ...other } = payload;

  const readyData: any = { ...other };

  // ✅ Handle file if uploaded
  if (file) {
    const savedFile = await uploader.uploadImages([file]);
    const url = savedFile[0].fileUrl;
    readyData.avatar = url;
  }

  // ✅ Verify old password
  if (newPassword && oldPassword) {
    const isMatchOldPassword = await passwordHelper.verifyPassword(
      oldPassword,
      isExistUser.password
    );

    if (!isMatchOldPassword) {
      throw ApiErrors.BadRequest(
        "Your old password is incorrect. Please try again."
      );
    }

    const hashedPassword = await passwordHelper.convertHashPassword(
      newPassword
    );
    readyData.password = hashedPassword;
  }

  const updatedUser = await prisma.user.update({
    data: readyData,
    where: { id },
  });

  if (file) {
    await uploader.deleteImage(isExistUser.avatar as string);
  }
  const { password, ...safeUser } = updatedUser;
  return safeUser;
};

const deleteUser = async (req: Request) => {
  const session = await Auth([Role.ADMIN, Role.SUPER_ADMIN]);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) throw ApiErrors.BadRequest("user id is required");
  if (session.user.id == id) {
    throw ApiErrors.BadRequest("you not allow delete you");
  }

  const isExistUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExistUser) {
    throw ApiErrors.NotFound("user not found");
  }

  if (
    isExistUser.role === Role.SUPER_ADMIN &&
    session.user.role === Role.ADMIN
  ) {
    throw ApiErrors.Forbidden("you are not allow to delete super_admin");
  }

  await prisma.user.delete({ where: { id } });
};

export const UserService = {
  createUser,
  getAllUser,
  deleteUser,
  updateUser,
};
