import bcrypt from "bcrypt";

export const passwordToHash = async (password) => {
  const passwordEncrypted = await bcrypt.hash(password, 10);
  return passwordEncrypted;
};
