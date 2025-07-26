import { User, Product, Order, OrderItem, Address } from '@/types/api';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'user',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'moderator',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'user',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    category: 'Electronics',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with health monitoring, GPS, and water resistance.',
    price: 299.99,
    category: 'Electronics',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    createdAt: '2024-01-11T10:30:00Z',
    updatedAt: '2024-01-11T10:30:00Z',
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable office chair with lumbar support and adjustable height.',
    price: 249.99,
    category: 'Furniture',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    createdAt: '2024-01-12T12:00:00Z',
    updatedAt: '2024-01-12T12:00:00Z',
  },
  {
    id: '4',
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans sourced from sustainable farms.',
    price: 24.99,
    category: 'Food & Beverage',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
    createdAt: '2024-01-13T14:15:00Z',
    updatedAt: '2024-01-13T14:15:00Z',
  },
  {
    id: '5',
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat made from eco-friendly materials.',
    price: 39.99,
    category: 'Sports & Fitness',
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
    createdAt: '2024-01-14T16:30:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
  },
];

// Mock Addresses
const mockAddresses: Address[] = [
  {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  },
  {
    street: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    country: 'USA',
  },
  {
    street: '789 Pine Rd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
  },
];

// Mock Order Items
const createMockOrderItems = (productIds: string[], quantities: number[]): OrderItem[] => {
  return productIds.map((productId, index) => {
    const product = mockProducts.find(p => p.id === productId);
    return {
      id: `item-${productId}-${index}`,
      productId,
      product,
      quantity: quantities[index] || 1,
      price: product?.price || 0,
    };
  });
};

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '2',
    user: mockUsers.find(u => u.id === '2'),
    items: createMockOrderItems(['1', '4'], [1, 2]),
    total: 249.97,
    status: 'delivered',
    shippingAddress: mockAddresses[0],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-22T15:30:00Z',
  },
  {
    id: '2',
    userId: '4',
    user: mockUsers.find(u => u.id === '4'),
    items: createMockOrderItems(['2', '5'], [1, 1]),
    total: 339.98,
    status: 'shipped',
    shippingAddress: mockAddresses[1],
    createdAt: '2024-01-21T14:00:00Z',
    updatedAt: '2024-01-23T09:15:00Z',
  },
  {
    id: '3',
    userId: '2',
    user: mockUsers.find(u => u.id === '2'),
    items: createMockOrderItems(['3'], [1]),
    total: 249.99,
    status: 'processing',
    shippingAddress: mockAddresses[0],
    createdAt: '2024-01-22T16:30:00Z',
    updatedAt: '2024-01-22T16:30:00Z',
  },
  {
    id: '4',
    userId: '3',
    user: mockUsers.find(u => u.id === '3'),
    items: createMockOrderItems(['1', '2', '4'], [2, 1, 3]),
    total: 774.95,
    status: 'pending',
    shippingAddress: mockAddresses[2],
    createdAt: '2024-01-23T11:45:00Z',
    updatedAt: '2024-01-23T11:45:00Z',
  },
];

// Helper function to generate new IDs
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Helper function to get current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};