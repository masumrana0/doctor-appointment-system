import { SignJWT, jwtVerify } from "jose";

const createToken = async (
  payload: Record<string, unknown>,
  secret: any,
  expireTime: string
): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expireTime)
    .sign(secret);
};

const verifyToken = (token: string, secret: string) => {
  return jwtVerify(token, secret as any);
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
