import { Suspense } from "react";
import { fetchCustomerPages, fetchFilteredCustomers } from "@/app/lib/customer-data";
import CustomerTable from "@/app/ui/customers/table";
import Pagination from "@/app/ui/pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const customers = await fetchFilteredCustomers(query, currentPage);
  const totalPages = await fetchCustomerPages(query);

  return (
    <div className="p-4 lg:p-7 bg-gray-50 h-screen-[calc(100vh-4rem)] overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Customer Management</h1>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CustomerTable customers={customers}  />
      </Suspense>

      <div className="mx-auto w-fit">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
