import { ApiErrors } from "@/app/(backend)/_core/errors/api-error";
import { passwordHelper } from "@/app/(backend)/_core/helper/password-security";
import prisma from "@/lib/prisma";

const login = async (req: Request) => {
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
  const isValidPassword = passwordHelper.verifyPassword(
    password,
    user.password
  );
  if (!isValidPassword) {
    throw ApiErrors.Unauthorized("Invalid password please try again");
  }

  const token = jwtHelper.generateToken(
    { id: user.id, email: user.email, role: user.role },
    "1d"
  );

  return;
};

export const AuthService = { login };
