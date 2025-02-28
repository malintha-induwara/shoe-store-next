import { ReactNode } from "react";
import SideNav from "../ui/dashboard/sidenav";

export default function DashboardLayout({ children, }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
        <SideNav />
        <main className="flex-grow pt-16 lg:pt-0 px-4 md:px-6 lg:ml-64">{children}</main>
    </div>
  );
}
  