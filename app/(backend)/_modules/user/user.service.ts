import { ApiErrors } from "../../_core/errors/api-error";
import { passwordHelper } from "../../_core/helper/password-security";
import { prisma } from "@/lib/prisma";
import { requireAuth, RequireSuperAdmin } from "../../_core/error-handler/auth";

const createUser = async (req: Request) => {
  await RequireSuperAdmin();
  const { password, ...payload } = await req.json();

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

const getLoggedInUser = async () => {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });
  if (!user) {
    throw ApiErrors.NotFound("User not found");
  }
  const { password, ...safeUser } = user;
  return safeUser;
};

const getAllUser = async () => {
  await RequireSuperAdmin();
  const result = await prisma.user.findMany({});
  return result;
};

const updateLoggedInUser = async (req: Request) => {
  const session = await requireAuth();
  console.log("user identified");
  const body = await req.json();
  console.log("Request body:", body);

  const id = session.id;

  const isExistUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!isExistUser) {
    throw ApiErrors.NotFound("User not found");
  }

  // Validate that body has at least one field to update
  if (!body || Object.keys(body).length === 0) {
    throw ApiErrors.BadRequest("No fields provided for update");
  }

  const payload: any = { ...body };

  const { newPassword, oldPassword, ...other } = payload;

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
    other.password = hashedPassword;
  }

  const updatedUser = await prisma.user.update({
    data: other,
    where: { id },
  });

  const { password, ...safeUser } = updatedUser;
  return safeUser;
};

const deleteUser = async (req: Request) => {
  await RequireSuperAdmin();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    throw ApiErrors.BadRequest("User id is required");
  }

  const isExistUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExistUser) {
    throw ApiErrors.NotFound("user not found");
  }

  await prisma.user.delete({ where: { id } });
};

export const UserService = {
  createUser,
  getAllUser,
  deleteUser,
  updateLoggedInUser,
  getLoggedInUser,
};
