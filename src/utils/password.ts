import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (plain: string) => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};

const comparePassword = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

export {
  hashPassword,
  comparePassword,
};
