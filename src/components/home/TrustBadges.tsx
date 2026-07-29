import { Truck, Shield, Headphones, Award } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Islandwide Delivery",
    description: "Fast delivery across Sri Lanka",
  },
  {
    icon: Shield,
    title: "1-Year Warranty",
    description: "On all RO systems",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Expert help anytime",
  },
  {
    icon: Award,
    title: "Genuine Parts",
    description: "100% authentic products",
  },
];

export function TrustBadges() {
  return (
    <section className="py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.title}
              className="trust-badge"
            >
              <div className="w-12 h-12 rounded-full ocean-gradient flex items-center justify-center">
                <Icon size={22} className="text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-heading font-semibold text-sm text-[var(--color-foreground)]">
                  {badge.title}
                </h3>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
