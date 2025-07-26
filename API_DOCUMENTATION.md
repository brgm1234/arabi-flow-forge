# API Documentation

This project includes a comprehensive mock API system with full CRUD operations, TypeScript support, and React Query integration. The API simulates a real backend with proper error handling, pagination, and realistic delays.

## Overview

The API system consists of:
- **TypeScript Types**: Complete type definitions for all API requests and responses
- **Mock Data**: Realistic sample data for users, products, and orders
- **API Services**: Service layer that simulates HTTP requests with proper delays
- **React Hooks**: Custom hooks that integrate with React Query for easy data fetching
- **Demo Page**: Interactive demonstration of all API features

## Quick Start

1. Navigate to `/api-demo` in your application to see the API in action
2. Import the hooks you need: `import { useUsers, useCreateUser } from '@/hooks/useApi'`
3. Use the hooks in your components for automatic data fetching and mutations

## API Structure

### Core Types

All API responses follow a consistent structure:

```typescript
// Single item response
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Paginated response
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}
```

### Query Parameters

Most list endpoints support these query parameters:

```typescript
interface QueryParams {
  page?: number;        // Page number (default: 1)
  limit?: number;       // Items per page (default: 10)
  search?: string;      // Search term
  sortBy?: string;      // Field to sort by
  sortOrder?: 'asc' | 'desc'; // Sort direction
  category?: string;    // Filter by category (products)
  status?: string;      // Filter by status (orders)
}
```

## Available APIs

### Users API

Manage user accounts with full CRUD operations.

#### Types
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  updatedAt: string;
}
```

#### Service Methods
```typescript
import { userApi } from '@/services/api';

// Get paginated users
const users = await userApi.getUsers({ page: 1, limit: 10, search: 'john' });

// Get single user
const user = await userApi.getUserById('123');

// Create user
const newUser = await userApi.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
});

// Update user
const updatedUser = await userApi.updateUser('123', { name: 'Jane Doe' });

// Delete user
await userApi.deleteUser('123');
```

#### React Hooks
```typescript
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useApi';

const UserComponent = () => {
  // Fetch users with automatic caching and background updates
  const { data, isLoading, error } = useUsers({ page: 1, limit: 10 });
  
  // Mutations with automatic cache invalidation and toast notifications
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  
  const handleCreateUser = () => {
    createUser.mutate({
      name: 'New User',
      email: 'user@example.com',
      role: 'user'
    });
  };
  
  // Component JSX...
};
```

### Products API

Manage product inventory with categories and stock tracking.

#### Types
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Example Usage
```typescript
import { useProducts, useCreateProduct } from '@/hooks/useApi';

const ProductComponent = () => {
  // Fetch products filtered by category
  const { data: products } = useProducts({ 
    category: 'Electronics',
    sortBy: 'price',
    sortOrder: 'desc'
  });
  
  const createProduct = useCreateProduct();
  
  const handleCreateProduct = () => {
    createProduct.mutate({
      name: 'Gaming Laptop',
      description: 'High-performance gaming laptop',
      price: 1299.99,
      category: 'Electronics',
      stock: 25,
      imageUrl: 'https://example.com/laptop.jpg'
    });
  };
  
  // Component JSX...
};
```

### Orders API

Manage customer orders with items and shipping information.

#### Types
```typescript
interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}
```

#### Example Usage
```typescript
import { useOrders, useCreateOrder, useUpdateOrder } from '@/hooks/useApi';

const OrderComponent = () => {
  // Fetch orders filtered by status
  const { data: orders } = useOrders({ 
    status: 'pending',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  
  const handleCreateOrder = () => {
    createOrder.mutate({
      userId: '1',
      items: [
        { productId: '1', quantity: 2 },
        { productId: '3', quantity: 1 }
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    });
  };
  
  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    updateOrder.mutate({
      id: orderId,
      orderData: { status }
    });
  };
  
  // Component JSX...
};
```

### Dashboard API

Get aggregated statistics and insights.

#### Example Usage
```typescript
import { useDashboardStats } from '@/hooks/useApi';

const DashboardComponent = () => {
  const { data: stats, isLoading } = useDashboardStats();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stats">
        <div>Total Users: {stats?.data.totalUsers}</div>
        <div>Total Products: {stats?.data.totalProducts}</div>
        <div>Total Orders: {stats?.data.totalOrders}</div>
        <div>Total Revenue: ${stats?.data.totalRevenue.toFixed(2)}</div>
      </div>
      
      <h2>Recent Orders</h2>
      {stats?.data.recentOrders.map(order => (
        <div key={order.id}>
          Order #{order.id} - ${order.total}
        </div>
      ))}
      
      <h2>Top Products</h2>
      {stats?.data.topProducts.map(product => (
        <div key={product.id}>
          {product.name} - ${product.price}
        </div>
      ))}
    </div>
  );
};
```

## Features

### Realistic Simulation
- **Network Delays**: All API calls include realistic 500ms delays
- **Error Simulation**: 5% chance of random errors to test error handling
- **Proper HTTP Status**: Appropriate error responses for not found, validation errors, etc.

### React Query Integration
- **Automatic Caching**: Data is cached and shared across components
- **Background Updates**: Data refreshes automatically when stale
- **Optimistic Updates**: UI updates immediately for better UX
- **Error Handling**: Built-in error states and retry logic
- **Loading States**: Proper loading indicators throughout

### TypeScript Support
- **Complete Type Safety**: All API calls are fully typed
- **IntelliSense**: Full autocomplete support in your IDE
- **Compile-time Validation**: Catch errors before runtime

### Pagination & Filtering
- **Server-side Pagination**: Efficient handling of large datasets
- **Search**: Full-text search across relevant fields
- **Sorting**: Sort by any field in ascending or descending order
- **Filtering**: Filter by categories, status, etc.

## Advanced Usage

### Custom Query Options
```typescript
const { data, isLoading, error } = useUsers(
  { page: 1, limit: 10 },
  {
    staleTime: 5 * 60 * 1000,    // 5 minutes
    cacheTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    onError: (error) => {
      console.error('Failed to fetch users:', error);
    }
  }
);
```

### Optimistic Updates
```typescript
const updateUser = useUpdateUser({
  onMutate: async ({ id, userData }) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['users'] });
    
    // Snapshot previous value
    const previousUsers = queryClient.getQueryData(['users']);
    
    // Optimistically update
    queryClient.setQueryData(['users'], (old: any) => {
      // Update logic here
    });
    
    return { previousUsers };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    if (context?.previousUsers) {
      queryClient.setQueryData(['users'], context.previousUsers);
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }
});
```

### Direct API Usage
If you need to use the API outside of React components:

```typescript
import { userApi } from '@/services/api';

// In a utility function, service worker, etc.
const fetchUserData = async (userId: string) => {
  try {
    const response = await userApi.getUserById(userId);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};
```

## Error Handling

The API includes comprehensive error handling:

```typescript
const { data, isLoading, error, isError } = useUsers();

if (isError) {
  // Error object contains the error message
  console.error('API Error:', error.message);
}

// For mutations
const createUser = useCreateUser({
  onError: (error) => {
    // Custom error handling
    console.error('Failed to create user:', error.message);
    // Show custom error UI, log to service, etc.
  },
  onSuccess: (data) => {
    // Success handling
    console.log('User created:', data.data);
  }
});
```

## File Structure

```
src/
├── types/
│   └── api.ts              # TypeScript type definitions
├── lib/
│   └── mockData.ts         # Sample data and utilities
├── services/
│   └── api.ts              # API service layer
├── hooks/
│   └── useApi.ts           # React Query hooks
├── pages/
│   └── ApiDemo.tsx         # Interactive demo page
└── examples/
    └── apiUsage.ts         # Usage examples
```

## Demo Page

Visit `/api-demo` to see the API in action. The demo page includes:
- Dashboard with real-time statistics
- User management with CRUD operations
- Product catalog with filtering and search
- Order management with status updates
- Interactive forms for creating new records
- Pagination and sorting controls
- Loading states and error handling

## Next Steps

To adapt this API for production use:

1. **Replace Mock Data**: Connect to your real backend API
2. **Update Endpoints**: Change the service layer to make real HTTP requests
3. **Add Authentication**: Implement JWT tokens or session management
4. **Error Handling**: Add proper error logging and monitoring
5. **Validation**: Add client-side validation with libraries like Zod
6. **Testing**: Add unit tests for API services and hooks

The structure is designed to make this transition seamless - you'll primarily need to update the service layer while keeping the hooks and components unchanged.