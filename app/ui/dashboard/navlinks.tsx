"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, UserCircle, Settings, ClipboardCheck, Package, Layers } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Customers", path: "/dashboard/customer" },
  { icon: ShoppingBag, label: "Items", path: "/dashboard/item" },
  { icon: UserCircle, label: "Users", path: "/dashboard/user" },
  { icon: Users, label: "Staff", path: "/dashboard/staff" },
  { icon: Package, label: "Orders", path: "/dashboard/order" },
  { icon: Layers, label: "Transactions", path: "/dashboard/transaction" },
  { icon: ClipboardCheck, label: "Attendance", path: "/dashboard/attendance" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className=" space-y-2 flex-grow">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.label}
            href={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors
              ${isActive ? "bg-sky-100 text-blue-600" : "hover:bg-gray-100 text-gray-600 hover:text-blue-600"}`}
          >
            <IconComponent className="h-5 w-5" />
            <span className="ml-3">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
