import { sql } from "@vercel/postgres";
import { Item } from "../types";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredItems(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const items = await sql<Item>`
      SELECT id, name, image, price, size, qty, status
      FROM items
      WHERE
        name ILIKE ${`%${query}%`} OR
        status ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return items.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch items.");
  }
}


export async function fetchItemById(id: string) {
  try {
    const items = await sql<Item>`
      SELECT id, name, image, price, size, qty, status
      FROM items
      WHERE id = ${id}
    `;

    return items.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch item.");
  }
}


export async function fetchItemPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM items
      WHERE
        name ILIKE ${`%${query}%`} OR
        status ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of items.");
  }
}
