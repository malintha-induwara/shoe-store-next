'use client'
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { ItemModal } from "./item-modal";
import { createItem } from "@/app/lib/item/item-actions";

export default function CreateItem() {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleAction = () => {
      setIsModalOpen(true);
    };
  
    const handleSubmit = async (formData: FormData) => {
      await createItem(formData);
      setIsModalOpen(false);
    };
  
    return (
      <>
        <button onClick={handleAction} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors max-w-md">
          <UserPlus className="h-5 w-5 mr-2" />
          Add Item
        </button>
        <ItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode="add" initialData={undefined} onSubmit={handleSubmit} />
      </>
    );
  }
  