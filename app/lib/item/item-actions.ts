"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { del, put } from "@vercel/blob";

export async function createItem(formData: FormData) {
  try {
    let imagePath = null;
    const file = formData.get("image") as File;

    if (file && file.size > 0) {
      const blob = await put(`assets/${file.name}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      imagePath = `/${blob.pathname}`;
    }

    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const size = formData.get("size") as string;
    const qty = formData.get("qty") as string;
    const status = formData.get("status") as string;

    await sql`
      INSERT INTO items (name, image, price, size, qty, status)
      VALUES (${name}, ${imagePath}, ${price}, ${size}, ${qty}, ${status})
    `;

    revalidatePath("/dashboard/item");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create item.");
  }
}

export async function updateItem(id: string, formData: FormData) {
  try {
    let imagePath = null;

    const oldImage = formData.get("removeImage") as string;
    if (oldImage) {
      del(`${process.env.NEXT_PUBLIC_BLOB_URL}${oldImage}`);
    }

    const file = formData.get("image") as File;
    if (file && file.size > 0) {
      const blob = await put(`assets/${file.name}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      imagePath = `/${blob.pathname}`;
    }
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const size = formData.get("size") as string;
    const qty = formData.get("qty") as string;
    const status = formData.get("status") as string;

    await sql`
      UPDATE items
      SET name = ${name},
          image = ${imagePath},
          price = ${price},
          size = ${size},
          qty = ${qty},
          status = ${status}
      WHERE id = ${id}
    `;
    revalidatePath("/dashboard/item");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update item.");
  }
}

export async function deleteItem(id: string, image: string) {
  try {
    del(`${process.env.NEXT_PUBLIC_BLOB_URL}${image}`);
    await sql`DELETE FROM items WHERE id = ${id}`;
    revalidatePath("/dashboard/item");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete item.");
  }
}
