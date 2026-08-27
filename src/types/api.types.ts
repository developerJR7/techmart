export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
}

export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

// auth/me/updateProfile só selecionam { id, email, name, role, avatar?, createdAt }
// no backend (ver auth.service#buildAuthResponse e users.service#findOne) — isActive
// nunca vem nessas respostas, então não faz parte deste tipo. Para a listagem
// admin (que seleciona isActive), use AdminUserSummary.
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    createdAt?: string;
}

// Shape retornado por GET /admin/users (admin-users.controller.ts) — inclui
// isActive mas nunca avatar.
export interface AdminUserSummary {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    // Prisma Decimal serializa como string no JSON (decimal.js#toJSON) — o
    // axios não converte isso automaticamente. products.service.ts normaliza
    // pra number antes de expor o produto pro resto do app.
    price: number;
    images: string[];
    category: Category;
    stock: number;
    isFeatured: boolean;
    // null quando o produto ainda não tem nenhuma review (ver
    // reviews.service.ts, que recalcula os dois campos a cada review).
    averageRating: number | null;
    reviewCount: number;
    // Presente no schema, mas products.service.ts (backend) nunca dá
    // `include: { store: true }` — só o id da FK é retornado hoje.
    storeId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    isFeatured?: boolean;
    images?: string[];
}

export interface OrderItem {
    id: string;
    productId: string;
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    user: User;
    // O backend só expõe `orderItems` (orders.service.ts#findAll/findOne) —
    // não existe campo `items`; usar o nome errado quebra em runtime.
    orderItems: OrderItem[];
    total: number;
    subtotal: number;
    discount: number;
    shippingCost: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentMethod: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    id: string; // Cart item ID or Product ID depending on backend implementation
    productId: string;
    quantity: number;
    product: Product;
}

export interface Coupon {
    id: string;
    code: string;
    type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
    value: number;
    expiresAt: string;
    usageLimit: number;
    usageCount: number;
    isActive: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        limit: number;
    };
}
