"use client";

import Link from "next/link";
import {
  Package,
  MapPin,
  User,
  Heart,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Clock,
} from "lucide-react";

const menuItems = [
  { href: "/account/orders", icon: Package, label: "My Orders", desc: "Track and manage your orders" },
  { href: "/account/addresses", icon: MapPin, label: "Addresses", desc: "Manage shipping addresses" },
  { href: "/account/profile", icon: User, label: "Profile", desc: "Update your personal info" },
  { href: "/account/wishlist", icon: Heart, label: "Wishlist", desc: "Your saved items" },
];

const recentOrders = [
  {
    id: "DWS-M1ABC-XYZ1",
    date: "July 25, 2026",
    status: "DELIVERED",
    total: 45000,
    items: 3,
  },
  {
    id: "DWS-M1ABC-XYZ2",
    date: "July 20, 2026",
    status: "SHIPPED",
    total: 8500,
    items: 2,
  },
];

const statusColors: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
};

export default function AccountPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold mb-6">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--color-border)]">
              <div className="w-12 h-12 rounded-full ocean-gradient flex items-center justify-center">
                <span className="text-white font-bold">TC</span>
              </div>
              <div>
                <p className="font-heading font-semibold">Test Customer</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">customer@test.com</p>
              </div>
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/auth/sign-in"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white">
              <ShoppingBag size={20} className="text-[var(--color-aqua)] mb-2" />
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Total Orders</p>
            </div>
            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white">
              <Clock size={20} className="text-[var(--color-aqua)] mb-2" />
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Pending</p>
            </div>
            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white">
              <Package size={20} className="text-[var(--color-aqua)] mb-2" />
              <p className="text-2xl font-bold">Rs 125K</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Total Spent</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold">Recent Orders</h3>
              <Link href="/account/orders" className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-sm">Order #{order.id}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {order.date} • {order.items} items
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-sm">Rs {order.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
