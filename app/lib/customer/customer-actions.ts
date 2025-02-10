"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { CustomerFormData } from "../types";

export async function createCustomer(formData: CustomerFormData) {
  try {
    await sql`
      INSERT INTO customers (name, email, mobile, address, password)
      VALUES (${formData.name}, ${formData.email}, ${formData.mobile}, ${formData.address}, ${formData.address})
    `;
    revalidatePath("/dashboard/customers");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create customer.");
  }
}

export async function updateCustomer(id: string, formData: CustomerFormData) {
  try {
    await sql`
      UPDATE customers
      SET name = ${formData.name},
          email = ${formData.email},
          mobile = ${formData.mobile},
          address = ${formData.address}
      WHERE id = ${id}
    `;
    revalidatePath("/dashboard/customers");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update customer.");
  }
}

export async function deleteCustomer(id: string) {
  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath("/dashboard/customers");
}
