import { IRole } from "@/app/(client)/[locale]/(dashboard)/dashboard/users/_interface/user.interface";
import { authOptions } from "@/lib/next-auth/auth";
import { getServerSession, Session } from "next-auth";
import { ApiErrors } from "../../errors/api-error";

const Auth = async (allowedRoles?: IRole[]): Promise<Session> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw ApiErrors.Unauthorized("User is not authenticated.");
  }

  const userRole = session?.user?.role;

  if (!userRole || !(allowedRoles ?? []).includes(userRole)) {
    throw ApiErrors.Forbidden("User does not have the required permissions.");
  }
  return session;
};

export default Auth;
