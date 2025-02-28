"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { del, put } from "@vercel/blob";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  size: z.string().min(1, "Size is required"),
  qty: z.string().regex(/^\d+$/, "Quantity must be a whole number"),
  status: z.enum(["active", "inactive"], { invalid_type_error: "Please select a status" }),
});

function validateFields(formData: FormData) {
  return formSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    size: formData.get("size"),
    qty: formData.get("qty"),
    status: formData.get("status"),
  });
}

export async function createItem(formData: FormData) {
  const validatedFields = validateFields(formData);

  if(!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Item.",
    };
  }

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

    const { name, price, size, qty, status } = validatedFields.data;

    await sql`
      INSERT INTO items (name, image, price, size, qty, status)
      VALUES (${name}, ${imagePath}, ${price}, ${size}, ${qty}, ${status})
    `;

    revalidatePath("/dashboard/item");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Update Item.",
    };
  }
}

export async function updateItem(id: string, formData: FormData) {
  const validatedFields = validateFields(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Item.",
    };
  }

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
    
    const { name, price, size, qty, status } = validatedFields.data;

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
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Update Item.",
    };
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
