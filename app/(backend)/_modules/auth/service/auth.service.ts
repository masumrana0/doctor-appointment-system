import { AuthUtils } from "@/app/(backend)/_core/error-handler/auth";
import { ApiErrors } from "@/app/(backend)/_core/errors/api-error";
import { passwordHelper } from "@/app/(backend)/_core/helper/password-security";

import { prisma } from "@/lib/prisma";

const login = async (req: Request): Promise<string> => {
  const { email, password } = await req.json();

  if (!email || !password) {
    throw ApiErrors.BadRequest("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw ApiErrors.Unauthorized("Invalid email or password, please try again");
  }
  const isValidPassword = await passwordHelper.verifyPassword(
    password,
    user.password
  );

  if (!isValidPassword) {
    throw ApiErrors.Unauthorized("Invalid password please try again");
  }

  const { password: _, ...userWithoutPassword } = user;

  const token = AuthUtils.createToken(userWithoutPassword);

  return token;
};

const passwordChange = async (req: Request): Promise<void> => {
  const session = await AuthUtils.requireAuth();
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    throw ApiErrors.BadRequest(
      "Current password and new password are required"
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
  });

  if (!user) {
    throw ApiErrors.NotFound("User not found");
  }

  const passwordMatch = await passwordHelper.verifyPassword(
    currentPassword,
    user?.password
  );

  if (!passwordMatch) {
    throw ApiErrors.Unauthorized("Current password is incorrect");
  }
  const hashedNewPassword = await passwordHelper.convertHashPassword(
    newPassword
  );

  await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      password: hashedNewPassword,
    },
  });
};

export const AuthService = { login, passwordChange };
