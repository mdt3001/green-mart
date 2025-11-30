export const API_PATHS = {
  // Auth
  AUTH: {
    SELLER_REGISTER: '/api/auth/seller/register',
    SELLER_LOGIN: '/api/auth/seller/login',
    SELLER_VERIFY_EMAIL: '/api/auth/seller/verify-email',
    SELLER_RESEND_VERIFICATION: '/api/auth/seller/resend-verification',
    SELLER_ACTIVATE: '/api/auth/seller/activate',
    CHECK_STORE_STATUS: '/api/auth/seller/check-store-status',

    CUSTOMER_REGISTER: '/api/auth/customer/register',
    CUSTOMER_LOGIN: '/api/auth/customer/login',
    CUSTOMER_VERIFY_EMAIL: '/api/auth/customer/verify-email',
    CUSTOMER_RESEND_VERIFICATION: '/api/auth/customer/resend-verification',
    GOOGLE_LOGIN: '/api/auth/customer/login/google',

    ADMIN_LOGIN: '/api/auth/admin/login',

    FORGOT_PASSWORD: '/api/auth/password/forgot',
    RESET_PASSWORD: '/api/auth/password/reset',
  },

  // Public
  PUBLIC: {
    PRODUCTS: '/api/public/products',
    PRODUCT_DETAIL: (id) => `/api/public/products/${id}`,
    RELATED_PRODUCTS: (id) => `/api/public/products/${id}/related`,

    CATEGORIES: '/api/public/categories',
    CATEGORY_SUBCATEGORIES: (category) => `/api/public/categories/${category}/subcategories`,
    CATEGORY_PRODUCTS: (category) => `/api/public/categories/${category}/products`,

    STORES: '/api/public/stores',
    STORE_DETAIL: (username) => `/api/public/stores/${username}`,
    STORE_PRODUCTS: (username) => `/api/public/stores/${username}/products`,

    SEARCH: '/api/public/search',
    SEARCH_SUGGESTIONS: '/api/public/search/suggestions',

    FLASH_SALES: '/api/public/flash-sales',
    FLASH_SALES_PRODUCTS: '/api/public/flash-sales/products',
    FLASH_SALE_DETAIL: (id) => `/api/public/flash-sales/${id}`,
    FLASH_SALE_PRODUCTS: (id) => `/api/public/flash-sales/${id}/products`,
  },

  // Admin
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',

    PENDING_SELLERS: '/api/admin/sellers/pending',
    APPROVE_SELLER: (storeId) => `/api/admin/sellers/approve/${storeId}`,
    REJECT_SELLER: (storeId) => `/api/admin/sellers/reject/${storeId}`,

    ORDERS: '/api/admin/orders',
    ORDER_DETAIL: (id) => `/api/admin/orders/${id}`,
    UPDATE_ORDER: (id) => `/api/admin/orders/${id}`,

    // Coupon Management
    COUPONS: '/api/admin/coupons',
    COUPON_DETAIL: (code) => `/api/admin/coupons/${code}`,
    UPDATE_COUPON: (code) => `/api/admin/coupons/${code}`,
    DELETE_COUPON: (code) => `/api/admin/coupons/${code}`,
    ASSIGN_COUPON_TO_STORES: (code) => `/api/admin/coupons/${code}/assign-stores`,

    // Store Coupon Management
    STORE_COUPONS: (storeId) => `/api/admin/stores/${storeId}/coupons`,
    TOGGLE_STORE_COUPON: (storeId, couponCode) => `/api/admin/stores/${storeId}/coupons/${couponCode}/toggle`,
  },

  // Seller/Store
  SELLER: {
    STORE: '/api/seller/store',
    UPDATE_STORE: '/api/seller/store',

    PRODUCTS: '/api/seller/products',
    PRODUCT_DETAIL: (id) => `/api/seller/products/${id}`,
    UPDATE_PRODUCT: (id) => `/api/seller/products/${id}`,
    DELETE_PRODUCT: (id) => `/api/seller/products/${id}`,
    TOGGLE_STOCK: (id) => `/api/seller/products/toggle-stock/${id}`,

    ORDERS: '/api/seller/orders',
    ORDER_DETAIL: (id) => `/api/seller/orders/${id}`,
    UPDATE_ORDER_STATUS: (id) => `/api/seller/orders/${id}/status`,

    ANALYTICS_OVERVIEW: '/api/seller/analytics/overview',
    ANALYTICS_PRODUCTS: '/api/seller/analytics/products',

    // Seller Coupon Management
    COUPONS: '/api/seller/coupons',
    TOGGLE_COUPON: (code) => `/api/seller/coupons/${code}/toggle`,
  },

  // Customer
  CUSTOMER: {
    PROFILE: '/api/customer/profile',
    UPDATE_PROFILE: '/api/customer/profile',
    CHANGE_PASSWORD: '/api/customer/profile/change-password',

    ADDRESSES: '/api/customer/addresses',
    ADDRESS_DETAIL: (id) => `/api/customer/addresses/${id}`,

    WISHLIST: '/api/customer/wishlist',
    ADD_TO_WISHLIST: '/api/customer/wishlist',
    REMOVE_FROM_WISHLIST: (id) => `/api/customer/wishlist/${id}`,

    CART: '/api/customer/cart',
    ADD_TO_CART: '/api/customer/cart/add',
    UPDATE_CART: '/api/customer/cart/update',
    REMOVE_FROM_CART: (productId) => `/api/customer/cart/remove/${productId}`,
    CLEAR_CART: '/api/customer/cart/clear',

    ORDERS: '/api/customer/orders',
    ORDER_DETAIL: (id) => `/api/customer/orders/${id}`,
    CANCEL_ORDER: (id) => `/api/customer/orders/${id}/cancel`,

    REVIEWS: '/api/customer/reviews',
    ADD_REVIEW: '/api/customer/reviews',

    // Customer Coupon Routes
    STORE_COUPONS: (storeId) => `/api/customer/stores/${storeId}/coupons`,
    VALIDATE_COUPON: '/api/customer/coupons/validate',
  },
};
