"use client";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { ItemModal } from "./item-modal";
import { createItem } from "@/app/lib/item/item-actions";
import { ItemState } from "@/app/lib/types";

export default function CreateItem() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialState: ItemState = { message: null, errors: {} };
  const [errorState, setErrorState] = useState<ItemState>(initialState);

  const handleAction = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
     const response =  await createItem(formData);
    if (response.success) {
      setErrorState(initialState);
      setIsModalOpen(false);
    } else {
      setErrorState({
        message: response.message,
        errors: response.errors,
      });
    }
  };

  return (
    <>
      <button onClick={handleAction} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors max-w-md">
        <UserPlus className="h-5 w-5 mr-2" />
        Add Item
      </button>
      <ItemModal isOpen={isModalOpen} onClose={() => { 
        setErrorState(initialState)
        setIsModalOpen(false)
      }} mode="add" errorState={errorState}  initialData={undefined} onSubmit={handleSubmit} />
    </>
  );
}
