// Export all services for easy imports
export * from './auth.service';
export * from './products.service';
export * from './cart.service';
export * from './wishlist.service';
export * from './orders.service';
export * from './coupons.service';
export * from './payments.service';
export * from './categories.service';
export * from './admin.service';
export * from './admin-ai.service';
export * from './chatbot.service';
export * from './recommendations.service';
export * from './upload.service';

// Re-export for convenience
import { authService } from './auth.service';
import { productsService } from './products.service';
import { cartService } from './cart.service';
import { wishlistService } from './wishlist.service';
import { ordersService } from './orders.service';
import { couponsService } from './coupons.service';
import { paymentsService } from './payments.service';
import { categoriesService } from './categories.service';
import { adminService } from './admin.service';
import { adminAIService } from './admin-ai.service';
import { chatbotService } from './chatbot.service';
import { recommendationsService } from './recommendations.service';
import { uploadService } from './upload.service';

export {
    authService,
    productsService,
    cartService,
    wishlistService,
    ordersService,
    couponsService,
    paymentsService,
    categoriesService,
    adminService,
    adminAIService,
    chatbotService,
    recommendationsService,
    uploadService,
};
