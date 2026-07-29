import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "Today's Orders",
    value: "12",
    change: "+8%",
    trend: "up",
    icon: ShoppingCart,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Revenue Today",
    value: "Rs 285,000",
    change: "+12%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Total Products",
    value: "145",
    change: "+3",
    trend: "up",
    icon: Package,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "New Customers",
    value: "28",
    change: "-5%",
    trend: "down",
    icon: Users,
    color: "bg-orange-50 text-orange-600",
  },
];

const recentOrders = [
  { id: "DWS-M1ABC-XYZ1", customer: "Kasun Perera", total: 45000, status: "PAID", date: "2 mins ago" },
  { id: "DWS-M1ABC-XYZ2", customer: "Nimal Silva", total: 12500, status: "PROCESSING", date: "15 mins ago" },
  { id: "DWS-M1ABC-XYZ3", customer: "Amara Fernando", total: 85000, status: "PAID", date: "1 hour ago" },
  { id: "DWS-M1ABC-XYZ4", customer: "Ruwan Jayawardena", total: 36500, status: "SHIPPED", date: "2 hours ago" },
  { id: "DWS-M1ABC-XYZ5", customer: "Dilini Samarawickrama", total: 8500, status: "PENDING_PAYMENT", date: "3 hours ago" },
];

const topProducts = [
  { name: "Delight Domestic RO 100 GPD", sales: 42, revenue: 1533000 },
  { name: "PP Spun Filter 10 Inch", sales: 156, revenue: 132600 },
  { name: "RO Antiscalant 20kg", sales: 28, revenue: 350000 },
  { name: "UV Sterilizer Lamp 11W", sales: 35, revenue: 157500 },
  { name: "Delight Commercial RO 500 LPH", sales: 8, revenue: 680000 },
];

const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-5 rounded-xl bg-white border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
            <h3 className="font-heading font-bold">Recent Orders</h3>
            <a href="/admin/orders" className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-[var(--color-muted)]/50">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{order.customer}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {order.id} • {order.date}
                  </p>
                </div>
                <p className="font-bold text-sm">Rs {order.total.toLocaleString()}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
            <h3 className="font-heading font-bold">Top Products</h3>
            <a href="/admin/products" className="text-sm text-[var(--color-primary)] hover:underline">
              View All
            </a>
          </div>
          <div className="p-4 space-y-3">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--color-muted)] text-xs flex items-center justify-center font-bold text-[var(--color-muted-foreground)]">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {product.sales} sales
                  </p>
                </div>
                <p className="text-sm font-bold">Rs {(product.revenue / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
