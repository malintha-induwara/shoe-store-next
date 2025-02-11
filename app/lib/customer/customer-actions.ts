"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export async function createCustomer(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const mobile = formData.get("mobile") as string;
    const address = formData.get("address") as string;

    await sql`
      INSERT INTO customers (name, email, mobile, address, password)
      VALUES (${name}, ${email}, ${mobile}, ${address}, ${address})
    `;
    revalidatePath("/dashboard/customer");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create customer.");
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const mobile = formData.get("mobile") as string;
    const address = formData.get("address") as string;
    await sql`
      UPDATE customers
      SET name = ${name},
          email = ${email},
          mobile = ${mobile},
          address = ${address}
      WHERE id = ${id}
    `;
    revalidatePath("/dashboard/customer");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update customer.");
  }
}

export async function deleteCustomer(id: string) {
  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath("/dashboard/customer");
}
