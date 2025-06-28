import bcrypt from 'bcryptjs';

export async function hashPassword(password: string, saltRounds = 12) {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}