import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/employee", label: "Product Management" },
  { to: "/employee/orders", label: "Order Management" },
];

export default function EmployeeLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-lg border-b">
          Employee Panel
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-4 py-2 rounded ${
                location.pathname === item.to
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center px-6 justify-between">
          <div className="font-semibold text-gray-800 text-lg">Pop Cart Employee</div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Employee</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              E
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}