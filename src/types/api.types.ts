export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    avatar?: string;
    isActive: boolean;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    category: Category;
    stock: number;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    featured?: boolean;
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
    items: OrderItem[];
    orderItems: OrderItem[];
    total: number;
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
