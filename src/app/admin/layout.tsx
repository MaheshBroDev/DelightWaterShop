"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  Menu,
  X,
  Bell,
  Search,
  Shield,
  Megaphone,
  BarChart,
  Plus,
  Clock,
  FileEdit,
  List,
  Image,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getRoleDisplayName, getRoleColor } from "@/lib/admin/permissions";

// Mock user data - will be replaced with actual session
const mockUser = {
  id: "admin-1",
  name: "John Admin",
  email: "admin@delightwatersolutions.com",
  role: "SUPER_ADMIN",
  image: null,
};

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  Shield,
  Megaphone,
  BarChart,
  List,
  Plus,
  Clock,
  FileEdit,
  Image,
  Zap,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Products"]);

  const navigation = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: "LayoutDashboard",
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: "Package",
      children: [
        { label: "All Products", href: "/admin/products", icon: "List" },
        { label: "Add Product", href: "/admin/products/new", icon: "Plus" },
        { label: "Pending Review", href: "/admin/products?status=PENDING_REVIEW", icon: "Clock" },
        { label: "Drafts", href: "/admin/products?status=DRAFT", icon: "FileEdit" },
      ],
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: "ShoppingCart",
    },
    {
      label: "Customers",
      href: "/admin/customers",
      icon: "Users",
    },
    {
      label: "Marketing",
      href: "/admin/marketing",
      icon: "Megaphone",
      children: [
        { label: "Coupons", href: "/admin/marketing/coupons", icon: "Tag" },
        { label: "Flash Sales", href: "/admin/marketing/flash-sales", icon: "Zap" },
        { label: "Banners", href: "/admin/marketing/banners", icon: "Image" },
      ],
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: "BarChart",
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: "Settings",
    },
    {
      label: "Users & Roles",
      href: "/admin/users",
      icon: "Shield",
    },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-surface)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[var(--color-border)] transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-full ocean-gradient flex items-center justify-center">
            <Droplets size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-[var(--color-primary)] leading-none text-sm">
              Delight Admin
            </h1>
            <p className="text-[10px] text-[var(--color-muted-foreground)] leading-none">
              Water Shop
            </p>
          </div>
          <button
            className="ml-auto lg:hidden p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const active = isActive(item.href);
            const expanded = expandedMenus.includes(item.label);

            return (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        active
                          ? "bg-[var(--color-aqua)]/10 text-[var(--color-primary)]"
                          : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                      )}
                    >
                      <Icon size={18} />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight
                        size={16}
                        className={cn(
                          "transition-transform",
                          expanded && "rotate-90"
                        )}
                      />
                    </button>
                    {expanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const ChildIcon = iconMap[child.icon] || LayoutDashboard;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <ChildIcon size={14} />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      active
                        ? "bg-[var(--color-aqua)]/10 text-[var(--color-primary)]"
                        : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">
              {mockUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{mockUser.name}</p>
              <span className={cn("text-xs px-1.5 py-0.5 rounded", getRoleColor(mockUser.role as any))}>
                {getRoleDisplayName(mockUser.role as any)}
              </span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="p-1.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              title="Back to store"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[var(--color-border)] flex items-center px-4 lg:px-6 gap-4">
          <button
            className="lg:hidden p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)] flex-1">
            <Link href="/admin" className="hover:text-[var(--color-foreground)]">
              Admin
            </Link>
            <ChevronRight size={14} />
            <span className="text-[var(--color-foreground)] font-medium capitalize">
              {pathname.split("/").filter(Boolean).pop() || "Dashboard"}
            </span>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-9 pl-9 pr-4 w-48 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-aqua)]"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-[var(--color-muted)]">
              <Bell size={20} className="text-[var(--color-muted-foreground)]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
