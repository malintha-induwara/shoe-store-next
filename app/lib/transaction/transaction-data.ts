import { sql } from "@vercel/postgres";
import { Transaction } from "../types";

const TRANSACTIONS_PER_PAGE = 10;


function resultFilter (result: Transaction[]) {

  const orderMap = new Map();

  result.forEach(order => {
      if (!orderMap.has(order.order_id)) {
          const newOrder = {
              order_id: order.order_id,
              customer_name: order.customer_name,
              total_amount: order.total_amount,
              order_date: order.order_date,
              items: [{
                  item_name: order.item_name,
                  quantity: order.quantity,
                  price: order.price,
                  total_price: order.total_price
              }]
          };
          orderMap.set(order.order_id, newOrder);
      } else {
          const existingOrder = orderMap.get(order.order_id);
          existingOrder.items.push({
              item_name: order.item_name,
              quantity: order.quantity,
              price: order.price,
              total_price: order.total_price
          });
      }
  });
  return Array.from(orderMap.values());
}



export async function fetchFilteredTransactions(query: string, currentPage: number) {
  const offset = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  try {
    const transactions = await sql<Transaction>`
      SELECT 
        o.id AS order_id,
        c.name AS customer_name,
        o.total_amount,
        o.order_date,
        i.name AS item_name,
        oi.quantity,
        oi.price,
        (oi.quantity * oi.price) AS total_price
      FROM 
        orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN items i ON oi.item_id = i.id
      WHERE
        c.name ILIKE ${`%${query}%`} OR
        i.name ILIKE ${`%${query}%`}
      ORDER BY 
        o.order_date DESC, 
        o.id
      LIMIT ${TRANSACTIONS_PER_PAGE} OFFSET ${offset}
    `;
    return resultFilter(transactions.rows);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transactions.");
  }
}

export async function fetchTransactionPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN items i ON oi.item_id = i.id
      WHERE
        c.name ILIKE ${`%${query}%`} OR
        i.name ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / TRANSACTIONS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of transactions.");
  }
}
