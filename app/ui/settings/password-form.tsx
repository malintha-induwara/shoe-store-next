'use client'
import { Lock } from "lucide-react";
import { useState } from "react";

export default function ChangePassword() {
      const [currentPassword, setCurrentPassword] = useState("");
      const [newPassword, setNewPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const initialPasswordState = { message: null };
      const [passwordError, setPasswordError] = useState<{ message: string | null }>(initialPasswordState);
    
      const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      };
    
     
  return (
    <div className="w-full max-w-xl ">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 w-full  rounded-lg py-2 px-3 border-neutral-300 border-2 outline-none focus:border-blue-500"
                placeholder="Enter current password"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 " />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 w-full  rounded-lg py-2 px-3 border-neutral-300 border-2 outline-none focus:border-blue-500"
                placeholder="Enter new password"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 w-full rounded-lg py-2 px-3 border-neutral-300 border-2 outline-none focus:border-blue-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
