"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Droplets,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[var(--color-surface)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[var(--color-border)]">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-full ocean-gradient flex items-center justify-center">
            <Droplets size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-[var(--color-primary)] leading-none text-sm">
              Delight Admin
            </h1>
            <p className="text-[10px] text-[var(--color-muted-foreground)]">Water Shop</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-aqua)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] transition-colors"
          >
            <LogOut size={18} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[var(--color-border)] flex items-center px-6 gap-4">
          <nav className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)]">
            <Link href="/admin" className="hover:text-[var(--color-foreground)]">Admin</Link>
            <ChevronRight size={14} />
            <span className="text-[var(--color-foreground)] font-medium capitalize">
              {pathname.split("/").pop() || "Dashboard"}
            </span>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
