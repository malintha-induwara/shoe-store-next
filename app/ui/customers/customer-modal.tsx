'use client'

import { FormEvent, useEffect, useRef } from "react";
import { X, Phone, Mail, MapPin, User } from "lucide-react";
import { Customer, CustomerFormData } from "@/app/lib/types";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "add";
  initialData?: Customer;
  onSubmit: (data: CustomerFormData) => void;
}

export function CustomerModal({
  isOpen,
  onClose,
  mode,
  initialData,
  onSubmit,
}: CustomerModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      return () => {
        dialog.close();
      };
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const customerData: CustomerFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      mobile: formData.get('mobile') as string,
      address: formData.get('address') as string,
    };

    onSubmit(customerData);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "view": return "Customer Details";
      case "edit": return "Edit Customer";
      case "add": return "Add New Customer";
    }
  };

  return (
    <>
      <dialog
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-800/70"
      >
        <div className="bg-white rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900">{getModalTitle()}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} method="dialog">
            <div className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      defaultValue={initialData?.name}
                      placeholder="Enter customer name"
                      className="pl-10 w-full border rounded-lg py-2 px-3 border-gray-300 outline-none"
                      readOnly={mode === "view"}
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      defaultValue={initialData?.email}
                      placeholder="Enter customer email"
                      className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 outline-none"
                      readOnly={mode === "view"}
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="mobile"
                      type="tel"
                      defaultValue={initialData?.mobile}
                      placeholder="Enter customer phone number"
                      className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 outline-none"
                      readOnly={mode === "view"}
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="address"
                      type="text"
                      defaultValue={initialData?.address}
                      placeholder="Enter customer address"
                      className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 outline-none focus:outline-1 focus:outline-blue"
                      readOnly={mode === "view"}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-300">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              {mode !== "view" && (
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {mode === "edit" ? "Save Changes" : "Add Customer"}
                </button>
              )}
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}