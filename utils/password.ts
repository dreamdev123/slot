import bcryptjs from "bcryptjs";

const SALT_ROUNDS = 10;

export async function saltAndHashPassword(password: string): Promise<string> {
  try {
    const salt = await bcryptjs.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}
