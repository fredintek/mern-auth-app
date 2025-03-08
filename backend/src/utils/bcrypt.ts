import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltRounds?: number) => {
  return bcrypt.hash(value, saltRounds || 10);
};

export const compareValue = async (
  value: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(value, hash).catch(() => false);
};
