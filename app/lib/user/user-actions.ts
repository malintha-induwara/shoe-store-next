"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
    console.log(formData)
  const validatedFields = validateUserFields(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }

  try {
    const { email, password, role } = validatedFields.data;
    await sql`
      INSERT INTO users (email, password, role)
      VALUES (${email}, ${password}, ${role});
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
    await sql`
      UPDATE users
      SET email = ${email}, password = ${password}, role = ${role}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/user");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Update User." };
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
