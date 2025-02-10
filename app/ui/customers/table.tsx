"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2, UserPlus, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CustomerModal } from "./customer-modal";
import { createCustomer, updateCustomer, deleteCustomer } from "@/app/lib/customer-actions";
import { Customer, CustomerFormData } from "@/app/lib/types";

export default function CustomerTable({ customers }: { customers: Customer[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("view");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleAction = (action: "view" | "edit" | "add", customer?: Customer) => {
    setModalMode(action);
    setSelectedCustomer(customer || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: CustomerFormData) => {
    if (modalMode === "add") {
      await createCustomer(formData);
    } else if (modalMode === "edit" && selectedCustomer) {
      await updateCustomer(selectedCustomer.id, formData);
    }
    setIsModalOpen(false);
  };

  async function handleRemove(id: string) {
    await deleteCustomer(id);
  }

  return (
    <>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              params.set("query", e.target.value);
              replace(`${pathname}?${params.toString()}`);
            }}
            defaultValue={searchParams.get("query")?.toString()}
          />
        </div>
        <button onClick={() => handleAction("add")} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors max-w-md">
          <UserPlus className="h-5 w-5 mr-2" />
          Add Customer
        </button>
      </div>
      <div className="bg-white mb-8 rounded-lg shadow-sm overflow-hidden border border-gray-300">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-295px)]">
          <table className="min-w-full divide-y divide-gray-200 relative">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {[
                  { field: "name", label: "Name" },
                  { field: "email", label: "Email" },
                  { field: "mobile", label: "Mobile" },
                  { field: "address", label: "Address" },
                ].map(({ field, label }) => (
                  <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  group bg-gray-50">
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                    </div>
                  </th>
                ))}
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.address}</td>
                  <td className="flex px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button onClick={() => handleAction("view", customer)} className="text-blue-600 hover:text-blue-900 mx-2">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleAction("edit", customer)} className="text-amber-600 hover:text-amber-900 mx-2">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleRemove(customer.id)} className="text-red-600 hover:text-red-900 mx-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} initialData={selectedCustomer || undefined} onSubmit={handleSubmit} />
    </>
  );
}
