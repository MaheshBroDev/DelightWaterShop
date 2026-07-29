import { PrismaClient, ProductType, UserRole } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌊 Seeding Delight Water Shop database...\n");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@delightwatersolutions.com" },
    update: {},
    create: {
      email: "admin@delightwatersolutions.com",
      name: "Delight Admin",
      role: "ADMIN" as UserRole,
      emailVerified: new Date(),
      // Default test password: "admin123456" (hash it in production)
      passwordHash: crypto.createHash("sha256").update("admin123456").digest("hex"),
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create test customer
  const customer = await prisma.user.upsert({
    where: { email: "customer@test.com" },
    update: {},
    create: {
      email: "customer@test.com",
      name: "Test Customer",
      role: "CUSTOMER" as UserRole,
      emailVerified: new Date(),
      passwordHash: crypto.createHash("sha256").update("customer123").digest("hex"),
    },
  });
  console.log("✅ Created test customer:", customer.email);

  // Create brands
  const brands = [
    { name: "Delight", slug: "delight" },
    { name: "Dow FilmTec", slug: "dow-filmtec" },
    { name: "Pentair", slug: "pentair" },
    { name: "Grundfos", slug: "grundfos" },
    { name: "Cuckoo", slug: "cuckoo" },
    { name: "Generic", slug: "generic" },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
  }
  console.log(`✅ Created ${brands.length} brands`);

  // Create categories
  const categories = [
    {
      name: "RO Water Purifiers",
      slug: "ro-water-purifiers",
      icon: "droplets",
      children: [
        { name: "Domestic RO Plants", slug: "domestic-ro-plants" },
        { name: "Commercial RO Plants", slug: "commercial-ro-plants" },
        { name: "Industrial RO Plants", slug: "industrial-ro-plants" },
        { name: "Sea Water RO", slug: "sea-water-ro" },
        { name: "Nano RO", slug: "nano-ro" },
      ],
    },
    {
      name: "Water Filters",
      slug: "water-filters",
      icon: "filter",
      children: [
        { name: "DM/DI Plants", slug: "dm-di-plants" },
        { name: "Water Softeners", slug: "water-softeners" },
        { name: "Iron Removal Filters", slug: "iron-removal-filters" },
        { name: "Glass Media Filters", slug: "glass-media-filters" },
      ],
    },
    {
      name: "Spare Parts",
      slug: "spare-parts",
      icon: "settings",
      children: [
        { name: "Membranes", slug: "membranes" },
        { name: "Housings", slug: "housings" },
        { name: "Pumps", slug: "pumps" },
        { name: "Pressure Gauges", slug: "pressure-gauges" },
        { name: "Flow Meters", slug: "flow-meters" },
        { name: "FRP Vessels", slug: "frp-vessels" },
        { name: "Filter Housings", slug: "filter-housings" },
        { name: "UV Lamps", slug: "uv-lamps" },
      ],
    },
    {
      name: "Chemicals & Consumables",
      slug: "chemicals-consumables",
      icon: "flask-conical",
      children: [
        { name: "Spun Filters", slug: "spun-filters" },
        { name: "Carbon Filters", slug: "carbon-filters" },
        { name: "PP Filters", slug: "pp-filters" },
        { name: "Resin", slug: "resin" },
        { name: "Activated Carbon", slug: "activated-carbon" },
        { name: "Sand Media", slug: "sand-media" },
        { name: "Antiscalant", slug: "antiscalant" },
        { name: "SMBS", slug: "smb" },
        { name: "CIP Chemicals", slug: "cip-chemicals" },
      ],
    },
    {
      name: "Accessories",
      slug: "accessories",
      icon: "wrench",
      children: [
        { name: "Tubing & Fittings", slug: "tubing-fittings" },
        { name: "Valves", slug: "valves" },
        { name: "Tanks", slug: "tanks" },
        { name: "Controllers", slug: "controllers" },
      ],
    },
  ];

  for (const cat of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        isActive: true,
      },
    });

    if (cat.children) {
      for (let i = 0; i < cat.children.length; i++) {
        const child = cat.children[i];
        await prisma.category.upsert({
          where: { slug: child.slug },
          update: { name: child.name, parentId: parent.id },
          create: {
            name: child.name,
            slug: child.slug,
            parentId: parent.id,
            isActive: true,
            sortOrder: i,
          },
        });
      }
    }
  }
  console.log(`✅ Created ${categories.length} category groups with subcategories`);

  // Get category IDs for products
  const domesticRO = await prisma.category.findUnique({ where: { slug: "domestic-ro-plants" } });
  const commercialRO = await prisma.category.findUnique({ where: { slug: "commercial-ro-plants" } });
  const industrialRO = await prisma.category.findUnique({ where: { slug: "industrial-ro-plants" } });
  const membranes = await prisma.category.findUnique({ where: { slug: "membranes" } });
  const carbonFilters = await prisma.category.findUnique({ where: { slug: "carbon-filters" } });
  const spunFilters = await prisma.category.findUnique({ where: { slug: "spun-filters" } });
  const pumps = await prisma.category.findUnique({ where: { slug: "pumps" } });
  const antiscalant = await prisma.category.findUnique({ where: { slug: "antiscalant" } });
  const uvLamps = await prisma.category.findUnique({ where: { slug: "uv-lamps" } });
  const waterSofteners = await prisma.category.findUnique({ where: { slug: "water-softeners" } });

  const delightBrand = await prisma.brand.findUnique({ where: { slug: "delight" } });
  const dowBrand = await prisma.brand.findUnique({ where: { slug: "dow-filmtec" } });
  const genericBrand = await prisma.brand.findUnique({ where: { slug: "generic" } });

  // ============= PRODUCTS =============

  // 1. SIMPLE PRODUCT - Spun Filter
  const spunFilter = await prisma.product.upsert({
    where: { slug: "pp-spun-filter-10-inch" },
    update: {},
    create: {
      type: "SIMPLE" as ProductType,
      name: "PP Spun Filter 10 Inch - 5 Micron",
      slug: "pp-spun-filter-10-inch",
      description: "High-quality polypropylene spun filter for sediment removal. Compatible with all standard 10-inch filter housings. Effective filtration down to 5 microns for clean, clear water.",
      sku: "DEL-SPUN-10-5",
      basePrice: 850,
      categoryId: spunFilters?.id || "",
      brandId: genericBrand?.id || "",
      isActive: true,
      isFeatured: false,
      weight: 0.3,
      images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=PP+Spun+Filter"],
    },
  });

  // 2. SIMPLE PRODUCT - UV Lamp
  const uvLamp = await prisma.product.upsert({
    where: { slug: "uv-sterilizer-lamp-11w" },
    update: {},
    create: {
      type: "SIMPLE" as ProductType,
      name: "UV Sterilizer Lamp 11W",
      slug: "uv-sterilizer-lamp-11w",
      description: "11-watt ultraviolet sterilizer lamp for water purification systems. Eliminates 99.9% of bacteria and viruses. Easy replacement, 9000-hour lifespan.",
      sku: "DEL-UV-11W",
      basePrice: 4500,
      categoryId: uvLamps?.id || "",
      brandId: genericBrand?.id || "",
      isActive: true,
      isFeatured: false,
      weight: 0.5,
      images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=UV+Lamp+11W"],
    },
  });

  // 3. VARIABLE PRODUCT - Domestic RO Plant (multiple sizes/colors)
  const domesticROPlant = await prisma.product.upsert({
    where: { slug: "delight-domestic-ro-plant" },
    update: {},
    create: {
      type: "VARIABLE" as ProductType,
      name: "Delight Domestic RO Water Purifier",
      slug: "delight-domestic-ro-plant",
      description: "Advanced 5-stage domestic reverse osmosis water purifier. Removes dissolved solids, heavy metals, bacteria, and viruses. Perfect for household drinking water purification. Includes installation kit and 1-year warranty.",
      sku: "DEL-RO-DOM",
      basePrice: 32500,
      categoryId: domesticRO?.id || "",
      brandId: delightBrand?.id || "",
      isActive: true,
      isFeatured: true,
      weight: 15,
      images: [
        "https://placehold.co/600x600/003b6f/ffffff?text=Delight+RO+White",
        "https://placehold.co/600x600/3fc6ff/ffffff?text=Delight+RO+Blue",
        "https://placehold.co/600x600/c0c0c0/333333?text=Delight+RO+Silver",
      ],
    },
  });

  // Add options for Domestic RO
  await prisma.productOption.upsert({
    where: { id: "opt-domestic-size" },
    update: {},
    create: {
      id: "opt-domestic-size",
      productId: domesticROPlant.id,
      name: "Capacity",
      values: ["75 GPD", "100 GPD", "150 GPD"],
    },
  });

  await prisma.productOption.upsert({
    where: { id: "opt-domestic-color" },
    update: {},
    create: {
      id: "opt-domestic-color",
      productId: domesticROPlant.id,
      name: "Color",
      values: ["White", "Blue", "Silver"],
    },
  });

  // Add variants for Domestic RO
  const domesticVariants = [
    { capacity: "75 GPD", color: "White", price: 32500, stock: 15 },
    { capacity: "75 GPD", color: "Blue", price: 33500, stock: 10 },
    { capacity: "75 GPD", color: "Silver", price: 34500, stock: 8 },
    { capacity: "100 GPD", color: "White", price: 36500, stock: 12 },
    { capacity: "100 GPD", color: "Blue", price: 37500, stock: 7 },
    { capacity: "100 GPD", color: "Silver", price: 38500, stock: 5 },
    { capacity: "150 GPD", color: "White", price: 42500, stock: 6 },
    { capacity: "150 GPD", color: "Blue", price: 43500, stock: 4 },
    { capacity: "150 GPD", color: "Silver", price: 44500, stock: 3 },
  ];

  for (const v of domesticVariants) {
    const variantSku = `DEL-RO-DOM-${v.capacity.replace(" ", "")}-${v.color.toUpperCase()}`;
    await prisma.productVariant.upsert({
      where: { sku: variantSku },
      update: { price: v.price, stock: v.stock },
      create: {
        productId: domesticROPlant.id,
        sku: variantSku,
        price: v.price,
        compareAtPrice: v.price + 5000,
        stock: v.stock,
        options: { capacity: v.capacity, color: v.color },
        isActive: true,
      },
    });
  }

  // 4. VARIABLE PRODUCT - Commercial RO Plant
  const commercialROPlant = await prisma.product.upsert({
    where: { slug: "delight-commercial-ro-plant" },
    update: {},
    create: {
      type: "VARIABLE" as ProductType,
      name: "Delight Commercial RO System",
      slug: "delight-commercial-ro-plant",
      description: "High-capacity commercial reverse osmosis system ideal for restaurants, offices, and small businesses. Features auto-flush, TDS controller, and stainless steel frame.",
      sku: "DEL-RO-COM",
      basePrice: 85000,
      categoryId: commercialRO?.id || "",
      brandId: delightBrand?.id || "",
      isActive: true,
      isFeatured: true,
      weight: 45,
      images: [
        "https://placehold.co/600x600/003b6f/ffffff?text=Commercial+RO+500LPH",
        "https://placehold.co/600x600/00223d/3fc6ff?text=Commercial+RO+1000LPH",
      ],
    },
  });

  await prisma.productOption.upsert({
    where: { id: "opt-commercial-cap" },
    update: {},
    create: {
      id: "opt-commercial-cap",
      productId: commercialROPlant.id,
      name: "Capacity",
      values: ["500 LPH", "1000 LPH", "2000 LPH"],
    },
  });

  const commercialVariants = [
    { capacity: "500 LPH", price: 85000, stock: 5 },
    { capacity: "1000 LPH", price: 125000, stock: 3 },
    { capacity: "2000 LPH", price: 195000, stock: 2 },
  ];

  for (const v of commercialVariants) {
    await prisma.productVariant.upsert({
      where: { sku: `DEL-RO-COM-${v.capacity.replace(" ", "")}` },
      update: { price: v.price, stock: v.stock },
      create: {
        productId: commercialROPlant.id,
        sku: `DEL-RO-COM-${v.capacity.replace(" ", "")}`,
        price: v.price,
        compareAtPrice: v.price + 15000,
        stock: v.stock,
        options: { capacity: v.capacity },
        isActive: true,
      },
    });
  }

  // 5. BULK PRODUCT - Antiscalant Chemical
  const antiscalantProduct = await prisma.product.upsert({
    where: { slug: "ro-antiscalant-chemical-20kg" },
    update: {},
    create: {
      type: "BULK" as ProductType,
      name: "RO Antiscalant Chemical (20kg Drum)",
      slug: "ro-antiscalant-chemical-20kg",
      description: "Premium quality antiscalant chemical for RO membrane protection. Prevents scale formation and extends membrane life. Suitable for all RO systems.",
      sku: "DEL-ANT-20",
      basePrice: 12500,
      categoryId: antiscalant?.id || "",
      brandId: genericBrand?.id || "",
      isActive: true,
      isFeatured: false,
      weight: 20,
      images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=Antiscalant+20kg"],
    },
  });

  // Add bulk pricing tiers
  const bulkTiers = [
    { minQty: 1, price: 12500 },
    { minQty: 5, price: 11500 },
    { minQty: 10, price: 10500 },
    { minQty: 25, price: 9500 },
  ];

  for (const tier of bulkTiers) {
    await prisma.bulkTier.upsert({
      where: {
        productId_minQty: {
          productId: antiscalantProduct.id,
          minQty: tier.minQty,
        },
      },
      update: { price: tier.price },
      create: {
        productId: antiscalantProduct.id,
        minQty: tier.minQty,
        price: tier.price,
      },
    });
  }

  // 6. BULK PRODUCT - Carbon Filter (Bulk Pack)
  const carbonFilterBulk = await prisma.product.upsert({
    where: { slug: "activated-carbon-filter-bulk-pack" },
    update: {},
    create: {
      type: "BULK" as ProductType,
      name: "Activated Carbon Filter Cartridge (Bulk Pack)",
      slug: "activated-carbon-filter-bulk-pack",
      description: "High-capacity activated carbon filter cartridges for chlorine and organic compound removal. Compatible with standard 10-inch housings.",
      sku: "DEL-CARB-BLK",
      basePrice: 1200,
      categoryId: carbonFilters?.id || "",
      brandId: genericBrand?.id || "",
      isActive: true,
      isFeatured: false,
      weight: 0.4,
      images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=Carbon+Filter"],
    },
  });

  for (const tier of [
    { minQty: 1, price: 1200 },
    { minQty: 10, price: 1050 },
    { minQty: 25, price: 950 },
    { minQty: 50, price: 850 },
  ]) {
    await prisma.bulkTier.upsert({
      where: {
        productId_minQty: {
          productId: carbonFilterBulk.id,
          minQty: tier.minQty,
        },
      },
      update: { price: tier.price },
      create: {
        productId: carbonFilterBulk.id,
        minQty: tier.minQty,
        price: tier.price,
      },
    });
  }

  // 7. COMPOSITE PRODUCT - Industrial RO Plant Build-Your-Kit
  const industrialROKit = await prisma.product.upsert({
    where: { slug: "industrial-ro-plant-custom-build" },
    update: {},
    create: {
      type: "COMPOSITE" as ProductType,
      name: "Industrial RO Plant - Custom Build Kit",
      slug: "industrial-ro-plant-custom-build",
      description: "Build your own industrial RO system with premium components. Select membrane type, pump capacity, vessel size, and control system. Professional installation included.",
      sku: "DEL-RO-IND-KIT",
      basePrice: 250000,
      categoryId: industrialRO?.id || "",
      brandId: delightBrand?.id || "",
      isActive: true,
      isFeatured: true,
      weight: 200,
      images: ["https://placehold.co/600x600/001224/3fc6ff?text=Industrial+RO+Kit"],
    },
  });

  // Component products for the composite
  const membraneComponent = await prisma.product.upsert({
    where: { slug: "dow-filmtec-membrane-8040" },
    update: {},
    create: {
      type: "SIMPLE" as ProductType,
      name: "DOW FilmTec 8040 RO Membrane",
      slug: "dow-filmtec-membrane-8040",
      description: "Premium DOW FilmTec 8-inch reverse osmosis membrane element. High rejection rate for dissolved solids. Industry standard for industrial applications.",
      sku: "DOW-8040",
      basePrice: 45000,
      categoryId: membranes?.id || "",
      brandId: dowBrand?.id || "",
      isActive: true,
      isFeatured: false,
      weight: 5,
      images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=DOW+Membrane+8040"],
    },
  });

  const pumpComponent = await prisma.product.upsert({
    where: { slug: "high-pressure-pump-10bar" },
    update: {},
    create: {
      type: "SIMPLE" as ProductType,
      name: "High Pressure RO Pump (10 Bar)",
      slug: "high-pressure-pump-10bar",
      description: "Heavy-duty high pressure pump for industrial RO systems. 10 bar operating pressure, stainless steel construction, energy efficient.",
      sku: "DEL-PUMP-10B",
      basePrice: 75000,
      categoryId: pumps?.id || "",
      brandId: delightBrand?.id || "",
      isActive: true,
      isFeatured: false,
      weight: 25,
      images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=HP+Pump+10Bar"],
    },
  });

  // Link composite items
  const compositeComponents = [
    { componentId: membraneComponent.id, qty: 4, required: true },
    { componentId: pumpComponent.id, qty: 1, required: true },
    { componentId: spunFilter.id, qty: 6, required: true },
  ];

  for (const comp of compositeComponents) {
    await prisma.compositeItem.upsert({
      where: {
        productId_componentProductId: {
          productId: industrialROKit.id,
          componentProductId: comp.componentId,
        },
      },
      update: { quantity: comp.qty },
      create: {
        productId: industrialROKit.id,
        componentProductId: comp.componentId,
        quantity: comp.qty,
        isRequired: comp.required,
      },
    });
  }

  // 8. Water Softener (VARIABLE)
  const waterSoftener = await prisma.product.upsert({
    where: { slug: "delight-water-softener-system" },
    update: {},
    create: {
      type: "VARIABLE" as ProductType,
      name: "Delight Water Softener System",
      slug: "delight-water-softener-system",
      description: "Automatic ion exchange water softener for hardness removal. Regenerates automatically, reduces scaling in pipes and appliances. Ideal for borewell water.",
      sku: "DEL-WS",
      basePrice: 65000,
      categoryId: waterSofteners?.id || "",
      brandId: delightBrand?.id || "",
      isActive: true,
      isFeatured: true,
      weight: 50,
      images: ["https://placehold.co/600x600/003b6f/ffffff?text=Water+Softener"],
    },
  });

  await prisma.productOption.upsert({
    where: { id: "opt-softener-cap" },
    update: {},
    create: {
      id: "opt-softener-cap",
      productId: waterSoftener.id,
      name: "Capacity",
      values: ["250 LPH", "500 LPH", "1000 LPH", "2000 LPH"],
    },
  });

  const softenerVariants = [
    { capacity: "250 LPH", price: 65000, stock: 4 },
    { capacity: "500 LPH", price: 85000, stock: 3 },
    { capacity: "1000 LPH", price: 125000, stock: 2 },
    { capacity: "2000 LPH", price: 185000, stock: 1 },
  ];

  for (const v of softenerVariants) {
    await prisma.productVariant.upsert({
      where: { sku: `DEL-WS-${v.capacity.replace(" ", "")}` },
      update: { price: v.price, stock: v.stock },
      create: {
        productId: waterSoftener.id,
        sku: `DEL-WS-${v.capacity.replace(" ", "")}`,
        price: v.price,
        stock: v.stock,
        options: { capacity: v.capacity },
        isActive: true,
      },
    });
  }

  // Additional simple products
  await prisma.product.upsert({
    where: { slug: "frp-vessel-1054" },
    update: {},
    create: {
      type: "SIMPLE" as ProductType,
      name: "FRP Pressure Vessel 1054",
      slug: "frp-vessel-1054",
      description: "Fiberglass reinforced plastic pressure vessel 10x54 inches. Suitable for water softeners, iron removal, and filter systems. Max pressure 150 PSI.",
      sku: "DEL-FRP-1054",
      basePrice: 28000,
      categoryId: (await prisma.category.findUnique({ where: { slug: "frp-vessels" } }))?.id || "",
      brandId: genericBrand?.id || "",
      isActive: true,
      isFeatured: false,
      weight: 18,
      images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=FRP+Vessel+1054"],
    },
  });

  await prisma.product.upsert({
    where: { slug: "ro-boost-pump-24v" },
    update: {},
    create: {
      type: "SIMPLE" as ProductType,
      name: "RO Booster Pump 24V DC",
      slug: "ro-boost-pump-24v",
      description: "24V DC booster pump for domestic RO systems. Increases water pressure for better membrane performance. Self-priming, low noise operation.",
      sku: "DEL-PUMP-24V",
      basePrice: 5500,
      categoryId: pumps?.id || "",
      brandId: genericBrand?.id || "",
      isActive: true,
      isFeatured: false,
      weight: 3,
      images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=RO+Booster+Pump"],
    },
  });

  await prisma.product.upsert({
    where: { slug: "digital-tds-meter" },
    update: {},
    create: {
      type: "SIMPLE" as ProductType,
      name: "Digital TDS Meter",
      slug: "digital-tds-meter",
      description: "Portable digital TDS (Total Dissolved Solids) meter for testing water quality. Accurate readings from 0-9999 ppm. Auto temperature compensation.",
      sku: "DEL-TDS-MTR",
      basePrice: 2500,
      categoryId: (await prisma.category.findUnique({ where: { slug: "accessories" } }))?.id || "",
      brandId: genericBrand?.id || "",
      isActive: true,
      isFeatured: true,
      weight: 0.1,
      images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=TDS+Meter"],
    },
  });

  console.log("✅ Created 14+ products across all types");

  // ============= FLASH SALE =============

  const now = new Date();
  const flashSale = await prisma.flashSale.create({
    data: {
      name: "New Year Water Purifier Sale",
      startTime: now,
      endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  // Add flash sale items with discounted prices
  const flashSaleItems = [
    { productId: domesticROPlant.id, salePrice: 27500 },
    { productId: commercialROPlant.id, salePrice: 72000 },
    { productId: waterSoftener.id, salePrice: 55000 },
  ];

  for (const item of flashSaleItems) {
    await prisma.flashSaleItem.create({
      data: {
        flashSaleId: flashSale.id,
        productId: item.productId,
        salePrice: item.salePrice,
      },
    });
  }
  console.log("✅ Created flash sale with 3 items");

  // ============= COUPONS =============

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENT",
      value: 10,
      minOrder: 5000,
      maxDiscount: 5000,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "SAVE2000" },
    update: {},
    create: {
      code: "SAVE2000",
      type: "FLAT",
      value: 2000,
      minOrder: 25000,
      isActive: true,
    },
  });

  console.log("✅ Created 2 coupons");

  // ============= SETTINGS =============

  const settings = [
    { key: "store_name", value: "Delight Water Solutions (Pvt) Ltd" },
    { key: "store_phone", value: "+94 11 234 5678" },
    { key: "store_email", value: "info@delightwatersolutions.com" },
    { key: "store_address", value: "Galewela, Sri Lanka" },
    { key: "free_shipping_threshold", value: "25000" },
    { key: "cod_max_amount", value: "50000" },
    { key: "returns_window_days", value: "7" },
    { key: "currency", value: "LKR" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✅ Created store settings");

  // ============= TEST ADDRESS =============

  await prisma.address.upsert({
    where: { id: "test-addr-1" },
    update: {},
    create: {
      id: "test-addr-1",
      userId: customer.id,
      firstName: "Test",
      lastName: "Customer",
      phone: "+94771234567",
      address1: "123 Main Street",
      city: "Colombo",
      district: "Colombo",
      postalCode: "00100",
      isDefault: true,
    },
  });
  console.log("✅ Created test address");

  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Test Credentials:");
  console.log("   Admin: admin@delightwatersolutions.com / admin123456");
  console.log("   Customer: customer@test.com / customer123");
  console.log("   Coupon codes: WELCOME10, SAVE2000");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
