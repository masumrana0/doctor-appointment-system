import bcrypt from "bcrypt";

const convertHashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const passwordHelper = {
  convertHashPassword,
  verifyPassword,
};
