// ============= ADMIN ROLES & PERMISSIONS =============

export enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",         // Full access - everything
  PRODUCT_MANAGER = "PRODUCT_MANAGER", // Create/edit products, can't publish
  CONTENT_EDITOR = "CONTENT_EDITOR",   // Update images, descriptions, SEO
  ORDER_MANAGER = "ORDER_MANAGER",     // Manage orders, customers
  MARKETING_MANAGER = "MARKETING_MANAGER", // Coupons, flash sales, banners
  SUPPORT_AGENT = "SUPPORT_AGENT",     // View orders, customers, basic updates
  VIEWER = "VIEWER",                   // Read-only access to dashboard
}

export enum AdminPermission {
  // Product permissions
  PRODUCTS_VIEW = "products:view",
  PRODUCTS_CREATE = "products:create",
  PRODUCTS_EDIT = "products:edit",
  PRODUCTS_DELETE = "products:delete",
  PRODUCTS_PUBLISH = "products:publish",        // Can change status to PUBLISHED
  PRODUCTS_APPROVE = "products:approve",        // Can approve pending changes
  PRODUCTS_REJECT = "products:reject",          // Can reject pending changes
  
  // Order permissions
  ORDERS_VIEW = "orders:view",
  ORDERS_EDIT = "orders:edit",
  ORDERS_UPDATE_STATUS = "orders:update_status",
  ORDERS_REFUND = "orders:refund",
  
  // Customer permissions
  CUSTOMERS_VIEW = "customers:view",
  CUSTOMERS_EDIT = "customers:edit",
  CUSTOMERS_DELETE = "customers:delete",
  
  // Content permissions
  CONTENT_EDIT = "content:edit",                // Edit descriptions, images, SEO
  IMAGES_UPLOAD = "images:upload",
  
  // Marketing permissions
  COUPONS_MANAGE = "coupons:manage",
  FLASH_SALES_MANAGE = "flash_sales:manage",
  BANNERS_MANAGE = "banners:manage",
  
  // Admin management
  USERS_MANAGE = "users:manage",                // Create/edit admin users
  ROLES_MANAGE = "roles:manage",                // Assign roles and permissions
  SETTINGS_MANAGE = "settings:manage",          // Store settings
  
  // Analytics
  ANALYTICS_VIEW = "analytics:view",
  REPORTS_VIEW = "reports:view",
}

// Role -> Permission mapping
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  [AdminRole.SUPER_ADMIN]: Object.values(AdminPermission), // All permissions
  
  [AdminRole.PRODUCT_MANAGER]: [
    AdminPermission.PRODUCTS_VIEW,
    AdminPermission.PRODUCTS_CREATE,
    AdminPermission.PRODUCTS_EDIT,
    AdminPermission.IMAGES_UPLOAD,
    AdminPermission.CONTENT_EDIT,
    // Note: Cannot publish or approve (those are SUPER_ADMIN only)
  ],
  
  [AdminRole.CONTENT_EDITOR]: [
    AdminPermission.PRODUCTS_VIEW,
    AdminPermission.CONTENT_EDIT,
    AdminPermission.IMAGES_UPLOAD,
    // Can edit content but not create/delete products
  ],
  
  [AdminRole.ORDER_MANAGER]: [
    AdminPermission.ORDERS_VIEW,
    AdminPermission.ORDERS_EDIT,
    AdminPermission.ORDERS_UPDATE_STATUS,
    AdminPermission.CUSTOMERS_VIEW,
    AdminPermission.REPORTS_VIEW,
  ],
  
  [AdminRole.MARKETING_MANAGER]: [
    AdminPermission.PRODUCTS_VIEW,
    AdminPermission.COUPONS_MANAGE,
    AdminPermission.FLASH_SALES_MANAGE,
    AdminPermission.BANNERS_MANAGE,
    AdminPermission.ANALYTICS_VIEW,
  ],
  
  [AdminRole.SUPPORT_AGENT]: [
    AdminPermission.ORDERS_VIEW,
    AdminPermission.CUSTOMERS_VIEW,
    AdminPermission.PRODUCTS_VIEW,
    // Can view but not edit orders (only basic status updates)
  ],
  
  [AdminRole.VIEWER]: [
    AdminPermission.PRODUCTS_VIEW,
    AdminPermission.ORDERS_VIEW,
    AdminPermission.CUSTOMERS_VIEW,
    AdminPermission.ANALYTICS_VIEW,
    // Read-only
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Check if a role has ANY of the specified permissions
 */
export function hasAnyPermission(role: AdminRole, permissions: AdminPermission[]): boolean {
  return permissions.some((perm) => hasPermission(role, perm));
}

/**
 * Check if a role has ALL specified permissions
 */
export function hasAllPermissions(role: AdminRole, permissions: AdminPermission[]): boolean {
  return permissions.every((perm) => hasPermission(role, perm));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: AdminRole): AdminPermission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Get human-readable role name
 */
export function getRoleDisplayName(role: AdminRole): string {
  const names: Record<AdminRole, string> = {
    [AdminRole.SUPER_ADMIN]: "Super Admin",
    [AdminRole.PRODUCT_MANAGER]: "Product Manager",
    [AdminRole.CONTENT_EDITOR]: "Content Editor",
    [AdminRole.ORDER_MANAGER]: "Order Manager",
    [AdminRole.MARKETING_MANAGER]: "Marketing Manager",
    [AdminRole.SUPPORT_AGENT]: "Support Agent",
    [AdminRole.VIEWER]: "Viewer",
  };
  return names[role] || role;
}

/**
 * Get role color for UI
 */
export function getRoleColor(role: AdminRole): string {
  const colors: Record<AdminRole, string> = {
    [AdminRole.SUPER_ADMIN]: "bg-red-100 text-red-700",
    [AdminRole.PRODUCT_MANAGER]: "bg-blue-100 text-blue-700",
    [AdminRole.CONTENT_EDITOR]: "bg-purple-100 text-purple-700",
    [AdminRole.ORDER_MANAGER]: "bg-green-100 text-green-700",
    [AdminRole.MARKETING_MANAGER]: "bg-orange-100 text-orange-700",
    [AdminRole.SUPPORT_AGENT]: "bg-cyan-100 text-cyan-700",
    [AdminRole.VIEWER]: "bg-gray-100 text-gray-700",
  };
  return colors[role] || "bg-gray-100 text-gray-700";
}

// ============= PRODUCT WORKFLOW =============

export enum ProductStatus {
  DRAFT = "DRAFT",
  PENDING_REVIEW = "PENDING_REVIEW",
  PUBLISHED = "PUBLISHED",
  UNPUBLISHED = "UNPUBLISHED",
  ARCHIVED = "ARCHIVED",
}

/**
 * Get status display name
 */
export function getStatusDisplayName(status: ProductStatus): string {
  const names: Record<ProductStatus, string> = {
    [ProductStatus.DRAFT]: "Draft",
    [ProductStatus.PENDING_REVIEW]: "Pending Review",
    [ProductStatus.PUBLISHED]: "Published",
    [ProductStatus.UNPUBLISHED]: "Unpublished",
    [ProductStatus.ARCHIVED]: "Archived",
  };
  return names[status] || status;
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: ProductStatus): string {
  const colors: Record<ProductStatus, string> = {
    [ProductStatus.DRAFT]: "bg-gray-100 text-gray-700",
    [ProductStatus.PENDING_REVIEW]: "bg-yellow-100 text-yellow-700",
    [ProductStatus.PUBLISHED]: "bg-green-100 text-green-700",
    [ProductStatus.UNPUBLISHED]: "bg-red-100 text-red-700",
    [ProductStatus.ARCHIVED]: "bg-slate-100 text-slate-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

/**
 * Check if a status transition is allowed
 */
export function canTransitionStatus(
  currentStatus: ProductStatus,
  newStatus: ProductStatus,
  role: AdminRole
): boolean {
  const transitions: Record<string, ProductStatus[]> = {
    [ProductStatus.DRAFT]: [ProductStatus.PENDING_REVIEW, ProductStatus.ARCHIVED],
    [ProductStatus.PENDING_REVIEW]: [ProductStatus.PUBLISHED, ProductStatus.DRAFT],
    [ProductStatus.PUBLISHED]: [ProductStatus.UNPUBLISHED, ProductStatus.ARCHIVED],
    [ProductStatus.UNPUBLISHED]: [ProductStatus.PUBLISHED, ProductStatus.ARCHIVED],
    [ProductStatus.ARCHIVED]: [ProductStatus.DRAFT],
  };

  // Check if transition is valid
  const allowedTargets = transitions[currentStatus] || [];
  if (!allowedTargets.includes(newStatus)) {
    return false;
  }

  // Check role permissions for specific transitions
  if (newStatus === ProductStatus.PUBLISHED) {
    return hasPermission(role, AdminPermission.PRODUCTS_PUBLISH);
  }

  if ((currentStatus as string) === (ProductStatus.PENDING_REVIEW as string) && (newStatus as string) === (ProductStatus.PUBLISHED as string)) {
    return hasPermission(role, AdminPermission.PRODUCTS_APPROVE);
  }

  if ((currentStatus as string) === (ProductStatus.PENDING_REVIEW as string) && (newStatus as string) === (ProductStatus.DRAFT as string)) {
    return hasPermission(role, AdminPermission.PRODUCTS_REJECT);
  }

  return true;
}

/**
 * Get available status transitions for a role
 */
export function getAvailableTransitions(
  currentStatus: ProductStatus,
  role: AdminRole
): ProductStatus[] {
  const allTransitions: Record<string, ProductStatus[]> = {
    [ProductStatus.DRAFT]: [ProductStatus.PENDING_REVIEW],
    [ProductStatus.PENDING_REVIEW]: [ProductStatus.PUBLISHED, ProductStatus.DRAFT],
    [ProductStatus.PUBLISHED]: [ProductStatus.UNPUBLISHED],
    [ProductStatus.UNPUBLISHED]: [ProductStatus.PUBLISHED],
    [ProductStatus.ARCHIVED]: [ProductStatus.DRAFT],
  };

  return (allTransitions[currentStatus] || []).filter((newStatus) =>
    canTransitionStatus(currentStatus, newStatus, role)
  );
}

// ============= CHANGE TRACKING =============

export interface ProductChange {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  action: "created" | "updated" | "status_changed" | "approved" | "rejected";
  field?: string;
  oldValue?: any;
  newValue?: any;
  comment?: string;
  createdAt: Date;
}

// ============= ADMIN NAVIGATION =============

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  permission?: AdminPermission;
  children?: AdminNavItem[];
}

export const ADMIN_NAVIGATION: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "LayoutDashboard",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: "Package",
    permission: AdminPermission.PRODUCTS_VIEW,
    children: [
      { label: "All Products", href: "/admin/products", icon: "List" },
      { label: "Add Product", href: "/admin/products/new", icon: "Plus", permission: AdminPermission.PRODUCTS_CREATE },
      { label: "Pending Review", href: "/admin/products?status=PENDING_REVIEW", icon: "Clock" },
      { label: "Drafts", href: "/admin/products?status=DRAFT", icon: "FileEdit" },
    ],
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: "ShoppingCart",
    permission: AdminPermission.ORDERS_VIEW,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: "Users",
    permission: AdminPermission.CUSTOMERS_VIEW,
  },
  {
    label: "Marketing",
    href: "/admin/marketing",
    icon: "Megaphone",
    permission: AdminPermission.COUPONS_MANAGE,
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
    permission: AdminPermission.ANALYTICS_VIEW,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "Settings",
    permission: AdminPermission.SETTINGS_MANAGE,
  },
  {
    label: "Users & Roles",
    href: "/admin/users",
    icon: "Shield",
    permission: AdminPermission.USERS_MANAGE,
  },
];

/**
 * Filter navigation items based on user permissions
 */
export function getFilteredNavigation(userRole: AdminRole): AdminNavItem[] {
  return ADMIN_NAVIGATION.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(userRole, item.permission);
  }).map((item) => ({
    ...item,
    children: item.children?.filter((child) => {
      if (!child.permission) return true;
      return hasPermission(userRole, child.permission);
    }),
  }));
}
