"use client";
import { UserPlus } from "lucide-react";
import { CustomerModal } from "./customer-modal";
import { useState } from "react";
import { CustomerFormData } from "@/app/lib/types";
import { createCustomer } from "@/app/lib/customer/customer-actions";

export default function CreateCustomer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: CustomerFormData) => {
    await createCustomer(formData);
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={handleAction} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors max-w-md">
        <UserPlus className="h-5 w-5 mr-2" />
        Add Customer
      </button>
      <CustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode="add" initialData={undefined} onSubmit={handleSubmit} />
    </>
  );
}
