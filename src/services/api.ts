import {
  ApiResponse,
  PaginatedResponse,
  User,
  Product,
  Order,
  CreateUserRequest,
  UpdateUserRequest,
  CreateProductRequest,
  UpdateProductRequest,
  CreateOrderRequest,
  UpdateOrderRequest,
  QueryParams,
} from '@/types/api';
import {
  mockUsers,
  mockProducts,
  mockOrders,
  generateId,
  getCurrentTimestamp,
} from '@/lib/mockData';

// Simulate network delay
const delay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Simulate random API errors (5% chance)
const shouldSimulateError = (): boolean => Math.random() < 0.05;

// Generic error responses
const createErrorResponse = (message: string): never => {
  throw new Error(message);
};

// Helper function to filter and paginate data
const filterAndPaginate = <T>(
  data: T[],
  params: QueryParams,
  filterFn?: (item: T, search: string) => boolean
): { data: T[]; pagination: any } => {
  let filteredData = [...data];

  // Apply search filter
  if (params.search && filterFn) {
    filteredData = filteredData.filter(item => filterFn(item, params.search!));
  }

  // Apply sorting
  if (params.sortBy) {
    filteredData.sort((a, b) => {
      const aValue = (a as any)[params.sortBy!];
      const bValue = (b as any)[params.sortBy!];
      
      if (params.sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });
  }

  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: filteredData.length,
      totalPages: Math.ceil(filteredData.length / limit),
    },
  };
};

// ===== USER API =====
export const userApi = {
  // Get all users with pagination and filtering
  getUsers: async (params: QueryParams = {}): Promise<PaginatedResponse<User>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to fetch users');
    }

    const filterFn = (user: User, search: string) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const result = filterAndPaginate(mockUsers, params, filterFn);

    return {
      ...result,
      message: 'Users fetched successfully',
      success: true,
    };
  },

  // Get user by ID
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to fetch user');
    }

    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      createErrorResponse('User not found');
    }

    return {
      data: user!,
      message: 'User fetched successfully',
      success: true,
    };
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<ApiResponse<User>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to create user');
    }

    const newUser: User = {
      id: generateId(),
      ...userData,
      role: userData.role || 'user',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    mockUsers.push(newUser);

    return {
      data: newUser,
      message: 'User created successfully',
      success: true,
    };
  },

  // Update user
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to update user');
    }

    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      createErrorResponse('User not found');
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: getCurrentTimestamp(),
    };

    mockUsers[userIndex] = updatedUser;

    return {
      data: updatedUser,
      message: 'User updated successfully',
      success: true,
    };
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to delete user');
    }

    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      createErrorResponse('User not found');
    }

    mockUsers.splice(userIndex, 1);

    return {
      data: null,
      message: 'User deleted successfully',
      success: true,
    };
  },
};

// ===== PRODUCT API =====
export const productApi = {
  // Get all products with pagination and filtering
  getProducts: async (params: QueryParams = {}): Promise<PaginatedResponse<Product>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to fetch products');
    }

    let filteredProducts = [...mockProducts];

    // Apply category filter
    if (params.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    const filterFn = (product: Product, search: string) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const result = filterAndPaginate(filteredProducts, params, filterFn);

    return {
      ...result,
      message: 'Products fetched successfully',
      success: true,
    };
  },

  // Get product by ID
  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to fetch product');
    }

    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      createErrorResponse('Product not found');
    }

    return {
      data: product!,
      message: 'Product fetched successfully',
      success: true,
    };
  },

  // Create new product
  createProduct: async (productData: CreateProductRequest): Promise<ApiResponse<Product>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to create product');
    }

    const newProduct: Product = {
      id: generateId(),
      ...productData,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    mockProducts.push(newProduct);

    return {
      data: newProduct,
      message: 'Product created successfully',
      success: true,
    };
  },

  // Update product
  updateProduct: async (id: string, productData: UpdateProductRequest): Promise<ApiResponse<Product>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to update product');
    }

    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      createErrorResponse('Product not found');
    }

    const updatedProduct = {
      ...mockProducts[productIndex],
      ...productData,
      updatedAt: getCurrentTimestamp(),
    };

    mockProducts[productIndex] = updatedProduct;

    return {
      data: updatedProduct,
      message: 'Product updated successfully',
      success: true,
    };
  },

  // Delete product
  deleteProduct: async (id: string): Promise<ApiResponse<null>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to delete product');
    }

    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      createErrorResponse('Product not found');
    }

    mockProducts.splice(productIndex, 1);

    return {
      data: null,
      message: 'Product deleted successfully',
      success: true,
    };
  },
};

// ===== ORDER API =====
export const orderApi = {
  // Get all orders with pagination and filtering
  getOrders: async (params: QueryParams = {}): Promise<PaginatedResponse<Order>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to fetch orders');
    }

    let filteredOrders = [...mockOrders];

    // Apply status filter
    if (params.status) {
      filteredOrders = filteredOrders.filter(o => 
        o.status === params.status
      );
    }

    const filterFn = (order: Order, search: string) =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(search.toLowerCase());

    const result = filterAndPaginate(filteredOrders, params, filterFn);

    return {
      ...result,
      message: 'Orders fetched successfully',
      success: true,
    };
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to fetch order');
    }

    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      createErrorResponse('Order not found');
    }

    return {
      data: order!,
      message: 'Order fetched successfully',
      success: true,
    };
  },

  // Create new order
  createOrder: async (orderData: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to create order');
    }

    // Calculate total and create order items
    let total = 0;
    const items = orderData.items.map(item => {
      const product = mockProducts.find(p => p.id === item.productId);
      if (!product) {
        createErrorResponse(`Product with ID ${item.productId} not found`);
      }
      
      const itemTotal = product!.price * item.quantity;
      total += itemTotal;

      return {
        id: generateId(),
        productId: item.productId,
        product,
        quantity: item.quantity,
        price: product!.price,
      };
    });

    const user = mockUsers.find(u => u.id === orderData.userId);
    if (!user) {
      createErrorResponse('User not found');
    }

    const newOrder: Order = {
      id: generateId(),
      userId: orderData.userId,
      user,
      items,
      total,
      status: 'pending',
      shippingAddress: orderData.shippingAddress,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    mockOrders.push(newOrder);

    return {
      data: newOrder,
      message: 'Order created successfully',
      success: true,
    };
  },

  // Update order
  updateOrder: async (id: string, orderData: UpdateOrderRequest): Promise<ApiResponse<Order>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to update order');
    }

    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      createErrorResponse('Order not found');
    }

    const updatedOrder = {
      ...mockOrders[orderIndex],
      ...orderData,
      updatedAt: getCurrentTimestamp(),
    };

    mockOrders[orderIndex] = updatedOrder;

    return {
      data: updatedOrder,
      message: 'Order updated successfully',
      success: true,
    };
  },

  // Delete order
  deleteOrder: async (id: string): Promise<ApiResponse<null>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to delete order');
    }

    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      createErrorResponse('Order not found');
    }

    mockOrders.splice(orderIndex, 1);

    return {
      data: null,
      message: 'Order deleted successfully',
      success: true,
    };
  },
};

// ===== DASHBOARD API =====
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<ApiResponse<{
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
    topProducts: Product[];
  }>> => {
    await delay();
    
    if (shouldSimulateError()) {
      createErrorResponse('Failed to fetch dashboard stats');
    }

    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
    const recentOrders = mockOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    // Calculate top products based on order frequency
    const productOrderCount: Record<string, number> = {};
    mockOrders.forEach(order => {
      order.items.forEach(item => {
        productOrderCount[item.productId] = (productOrderCount[item.productId] || 0) + item.quantity;
      });
    });

    const topProducts = mockProducts
      .map(product => ({
        ...product,
        orderCount: productOrderCount[product.id] || 0,
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);

    return {
      data: {
        totalUsers: mockUsers.length,
        totalProducts: mockProducts.length,
        totalOrders: mockOrders.length,
        totalRevenue,
        recentOrders,
        topProducts,
      },
      message: 'Dashboard stats fetched successfully',
      success: true,
    };
  },
};