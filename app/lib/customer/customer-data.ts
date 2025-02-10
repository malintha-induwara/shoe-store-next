import { sql } from "@vercel/postgres";
import { Customer } from "../types";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredCustomers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const customers = await sql<Customer>`
      SELECT id, name, email, mobile, address
      FROM customers
      WHERE
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} OR
        mobile ILIKE ${`%${query}%`} OR
        address ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return customers.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customers.");
  }
}

export async function fetchCustomerPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM customers
      WHERE
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} OR
        mobile ILIKE ${`%${query}%`} OR
        address ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of customers.");
  }
}
