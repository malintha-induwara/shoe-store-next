'use client'
import { UserX } from "lucide-react";
import { useState } from "react";
import DeleteConfirmModal from "./delete-modal";

export default function DeleteAccount() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const initialDeleteState = { message: null };
  const [deleteError, setDeleteError] = useState<{ message: string | null }>(initialDeleteState);

  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
    setDeletePassword("");
    setDeleteError(initialDeleteState);
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      setDeleteError({
        message: "Password is required to delete account",
      });
      return;
    }

    setDeleteError(initialDeleteState);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h2>
        <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button onClick={() => setShowDeleteDialog(true)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center">
          <UserX className="h-5 w-5 mr-2" />
          Delete Account
        </button>
      </div>
      <DeleteConfirmModal
        showDeleteDialog={showDeleteDialog}
        deleteError={deleteError.message}
        deletePassword={deletePassword}
        handleCloseDialog={handleCloseDialog}
        handleDeleteAccount={handleDeleteAccount}
        setDeletePassword={setDeletePassword}
      />
    </>
  );
}
