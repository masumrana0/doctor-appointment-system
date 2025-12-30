import { Auth } from "@/app/(backend)/_core/error-handler/auth";
import { ApiErrors } from "@/app/(backend)/_core/errors/api-error";
import { passwordHelper } from "@/app/(backend)/_core/helper/password-security";
import { User } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const login = async (
  req: Request
): Promise<{ token: string; user: Omit<User, "password"> }> => {
  const auth = Auth.getInstance();
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

  const token = await auth.createToken(userWithoutPassword);

  return { token: token, user: userWithoutPassword };
};

const passwordChange = async (req: Request): Promise<void> => {
  const auth = Auth.getInstance();
  const session = await auth.requireAuth();

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
