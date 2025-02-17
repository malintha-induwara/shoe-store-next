"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcrypt';
import { z } from "zod";
import { User } from "../types";

const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "sales", "inventory", "manager"], {
    invalid_type_error: "Please select a valid role",
  }),
});

function validateUserFields(formData: FormData) {
  return userSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
}

export async function createUser(formData: FormData) {
  const validatedFields = validateUserFields(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }
  try {
    const { email, password, role } = validatedFields.data;
    const encryptedPassword = await bcrypt.hash(password, 1);

    await sql`
      INSERT INTO users (email, password, role)
      VALUES (${email}, ${encryptedPassword}, ${role});
    `;
    revalidatePath("/dashboard/user");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Create User." };
  }
}

export async function updateUser(id: string, formData: FormData) {
  const validatedFields = validateUserFields(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update User.",
    };
  }

  try {
    const { email, password, role } = validatedFields.data;
    const encryptedPassword = await bcrypt.hash(password, 1);
    await sql`
      UPDATE users
      SET email = ${email}, password = ${encryptedPassword}, role = ${role}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/user");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Update User." };
  }
}

export async function updateUserPassword(id: string,oldPassword:string, newPassword: string) {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE id = ${id}`;
    const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
    if(!isMatch){
      return {
        message: "Password is incorrect." };
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 1);
    await sql`
      UPDATE users
      SET password = ${encryptedPassword}
      WHERE id = ${id};
    `;
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Update Password." };
  }
}

export async function deleteUserWithPassword(id: string, password: string) {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE id = ${id}`;
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if(!isMatch){
      return {
        message: "Password is incorrect." };
    }
    await sql`
      DELETE FROM users
      WHERE id = ${id};
    `;
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Delete User." };
  }
}

export async function deleteUser(id: string) {
  try {
    await sql`
      DELETE FROM users
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/user");
  } catch (error) {
    console.error("Database Error:", error);
  }
}
