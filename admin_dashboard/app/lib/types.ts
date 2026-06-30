// Shared API response types — import these instead of using `any`.

export interface ApiListResponse<T> {
  data: T[];
  totalPages: number;
  total?: number;
}

export interface ApiDetailResponse<T> {
  data: T;
}

// ── Domain models ─────────────────────────────────────────────

export interface Medicine {
  _id: string;
  name: string;
  manufacturer?: string;
  category?: string;
  price: number;
  description?: string;
  usage?: string;
  imageUrls?: string[];
  imageUrl?: string;
  composition?: string[];
  precautions?: string[];
  rating?: number;
  reviewsCount?: number;
  is_deleted?: boolean;
}

export interface OrderItem {
  quantity: number;
  unitPrice: number;
  medicine?: Pick<Medicine, "_id" | "name" | "manufacturer" | "imageUrls" | "imageUrl">;
}

export interface Order {
  _id: string;
  status: string;
  deliveryStatus?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  user?: { name?: string; email?: string };
  items?: OrderItem[];
  paymentSnapshot?: { brand?: string; maskedCardNumber?: string };
  addressSnapshot?: {
    fullName?: string;
    line1?: string;
    line2?: string;
    city?: string;
    zip?: string;
  };
}

export interface User {
  _id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  address?: {
    fullName?: string;
    line1?: string;
    line2?: string;
    city?: string;
    zip?: string;
  };
  ordersCount?: number;
  totalSpend?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { name?: string; email?: string };
  medicine?: { name?: string };
}

export interface Config {
  _id: string;
  key: string;
  payload: unknown;
  updatedAt?: string;
}

export interface DashboardStats {
  users: number;
  orders: {
    total: number;
    meanOrderAmount: number;
    byStatus: {
      pending?: number;
      paid?: number;
      processing?: number;
      delivered?: number;
      completed?: number;
      cancelled?: number;
    };
  };
}

export interface EarningsData {
  total: number;
  monthlyTotals: number[];
}

export interface TopEntry {
  name: string;
  total: number;
}
