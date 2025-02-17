
'use server';

import { sql } from "@vercel/postgres";
import bcrypt from 'bcrypt';
import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";


const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function validateUserFields(formData: FormData) {
  return userSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }



export async function register(formData: FormData) {
  const validatedFields = validateUserFields(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }
  try {
    const { email, password } = validatedFields.data;
    const encryptedPassword = await bcrypt.hash(password, 1);

    await sql`
      INSERT INTO users (email, password, role)
      VALUES (${email}, ${encryptedPassword}, 'other');
    `;
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Create User." };
  }
}