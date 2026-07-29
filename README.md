# 🌊 Delight Water Shop

**E-commerce platform for Delight Water Solutions (Pvt) Ltd**  
*Subdomain: [shop.delightwatersolutions.com](https://shop.delightwatersolutions.com)*

A full-featured water treatment products e-commerce platform built with Next.js 15, featuring Daraz.lk-inspired UI with water/ocean themed branding.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + Custom water theme
- **UI Components:** shadcn/ui patterns
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** Better Auth (Google, Facebook, Email/Password)
- **Payments:** PayHere (Helapay) - Sri Lanka
- **Forms:** React Hook Form + Zod validation
- **Animation:** Framer Motion

## ✨ Features

### Product Architecture
- **Simple Products** — single SKU, one price
- **Variable Products** — multi-size/color variants (e.g., RO plants in 75/100/150 GPD)
- **Composite Products** — build-your-kit systems (industrial RO components)
- **Bulk Products** — tiered pricing for chemicals & consumables

### Storefront (Daraz-inspired)
- Category rail, hero slider, flash sale with countdown
- Product cards with hover effects, wishlist, quick-add
- Full PDP with variant picker, image gallery, tabs
- Cart with coupon codes, free shipping progress bar
- Multi-step checkout with Sri Lankan districts

### Water-Themed Branding
- Ocean color palette (abyss, deep, water, aqua, foam)
- Glassmorphic cards, bubble animations, wave dividers
- Caustic shimmer effects, ripple interactions
- Tasteful water effects (not overwhelming product readability)

### Sri Lanka Specifics
- LKR currency formatting (Rs 24,500.00)
- All 25 Sri Lankan districts for shipping
- PayHere payment gateway integration
- Cash on Delivery (max Rs 50,000)
- Free shipping above Rs 25,000

### Admin Panel
- Dashboard with KPIs (orders, revenue, top products)
- Product CRUD with variants/composites/bulk tiers
- Order management with status updates
- Customer management

## 📁 Project Structure

```
src/
├── app/
│   ├── (marketing)/         # Public storefront pages
│   ├── products/[slug]/     # Product detail pages
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Multi-step checkout
│   ├── account/             # Customer dashboard
│   ├── auth/                # Sign in / Sign up
│   ├── admin/               # Admin panel (role-gated)
│   └── api/                 # API routes
├── components/
│   ├── layout/              # Header, Footer
│   ├── product/             # ProductCard, VariantPicker
│   ├── home/                # HeroSlider, FlashSale, CategoryTiles
│   ├── cart/                # CartItem, CartSummary
│   ├── checkout/            # AddressForm, PaymentMethod
│   ├── auth/                # Login/Signup forms
│   └── admin/               # Admin components
├── lib/
│   ├── prisma.ts            # Database client
│   ├── auth.ts              # Better Auth config
│   ├── payhere.ts           # PayHere integration
│   ├── cart.ts              # Cart helpers
│   ├── products.ts          # Product queries
│   └── utils.ts             # Utilities (cn, formatPriceLKR)
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
└── styles/
    └── globals.css          # Water theme tokens + Tailwind
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- PayHere merchant account (sandbox for development)
- Google/Facebook OAuth credentials

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

### Test Credentials
- **Admin:** admin@delightwatersolutions.com / admin123456
- **Customer:** customer@test.com / customer123
- **Coupons:** WELCOME10, SAVE2000

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-abyss` | #001224 | Footer, dark backgrounds |
| `--color-deep` | #00223d | Gradients |
| `--color-water` | #003b6f | Primary brand |
| `--color-aqua` | #3fc6ff | Accents, links |
| `--color-foam` | #bff1ff | Light backgrounds |
| `--color-deal` | #f57224 | Flash sale, prices |

### Typography
- **Headings:** Poppins (600, 700)
- **Body:** Inter (400, 500, 600)

### Component Styles
- Cards: 16-22px radius, glassmorphic
- Buttons/Pills: 999px radius
- Product cards: near-white backgrounds for readability

## 💳 Payment Integration

### PayHere Setup
1. Create merchant account at [payhere.lk](https://www.payhere.lk)
2. Use sandbox URL for development: `https://sandbox.payhere.lk`
3. Configure notify URL: `https://shop.delightwatersolutions.com/api/payhere/notify`
4. Switch to live URL for production: `https://www.payhere.lk`

### Hash Generation
```
MD5(merchantId + orderId + amount + "LKR" + MD5(merchantSecret))
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Add custom domain: `shop.delightwatersolutions.com`
4. DNS: CNAME to `cname.vercel-dns.com`

### Database
- **Supabase** or **Neon** (free tier works for launch)

### Environment Variables
```
DATABASE_URL=
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
PAYHERE_MERCHANT_ID=
PAYHERE_MERCHANT_SECRET=
PAYHERE_BASE_URL=
NEXT_PUBLIC_APP_URL=
CLOUDINARY_URL=
ADMIN_EMAILS=
```

## 📋 Sprint Progress

- [x] **Sprint 0:** Scaffold, schema, auth, seed data
- [x] **Sprint 1:** Catalog, header, home, PDP, search
- [x] **Sprint 2:** Cart, checkout, PayHere integration
- [ ] **Sprint 3:** Composite/bulk UIs, coupons, wishlist, reviews
- [ ] **Sprint 4:** Admin CRUD, order management
- [ ] **Sprint 5:** Polish, animations, SEO, performance
- [ ] **Launch:** Go live on shop.delightwatersolutions.com

## 🤝 Contributing

This is a private project for Delight Water Solutions (Pvt) Ltd.

## 📄 License

Proprietary - All rights reserved by Delight Water Solutions (Pvt) Ltd.

---

Built with 💧 by the Delight Water Solutions team
