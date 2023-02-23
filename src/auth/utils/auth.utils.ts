import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePasswords = async (
  givenPassword: string,
  realPassword: string,
) => {
  const isMatch = await bcrypt.compare(givenPassword, realPassword);
  return isMatch;
};
