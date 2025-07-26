// Example usage of the API services and hooks
// This file shows how to use the API in various scenarios

import { userApi, productApi, orderApi, dashboardApi } from '@/services/api';
import { 
  useUsers, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser,
  useProducts,
  useCreateProduct,
  useOrders,
  useCreateOrder,
  useDashboardStats
} from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';

// ===== DIRECT API USAGE =====

// Example 1: Fetching users with pagination and search
export const fetchUsersExample = async () => {
  try {
    const response = await userApi.getUsers({
      page: 1,
      limit: 10,
      search: 'john',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    
    console.log('Users:', response.data);
    console.log('Pagination:', response.pagination);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

// Example 2: Creating a new user
export const createUserExample = async () => {
  try {
    const newUser = await userApi.createUser({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'user'
    });
    
    console.log('Created user:', newUser.data);
  } catch (error) {
    console.error('Failed to create user:', error);
  }
};

// Example 3: Creating a product
export const createProductExample = async () => {
  try {
    const newProduct = await productApi.createProduct({
      name: 'New Laptop',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      category: 'Electronics',
      stock: 25,
      imageUrl: 'https://example.com/laptop.jpg'
    });
    
    console.log('Created product:', newProduct.data);
  } catch (error) {
    console.error('Failed to create product:', error);
  }
};

// Example 4: Creating an order
export const createOrderExample = async () => {
  try {
    const newOrder = await orderApi.createOrder({
      userId: '2',
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
    
    console.log('Created order:', newOrder.data);
  } catch (error) {
    console.error('Failed to create order:', error);
  }
};

// Example 5: Fetching dashboard stats
export const fetchDashboardStatsExample = async () => {
  try {
    const stats = await dashboardApi.getStats();
    console.log('Dashboard stats:', stats.data);
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }
};

// ===== REACT HOOKS USAGE =====

// Example 6: Using hooks in a React component
export const UserListComponent = () => {
  // Fetch users with React Query
  const { data: usersData, isLoading, error, refetch } = useUsers({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'name'
  });

  // Mutation hooks for CRUD operations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleCreateUser = () => {
    createUser.mutate({
      name: 'New User',
      email: 'newuser@example.com',
      role: 'user'
    });
  };

  const handleUpdateUser = (userId: string) => {
    updateUser.mutate({
      id: userId,
      userData: {
        name: 'Updated Name'
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser.mutate(userId);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleCreateUser}>Create User</button>
      {usersData?.data.map(user => (
        <div key={user.id}>
          <span>{user.name} - {user.email}</span>
          <button onClick={() => handleUpdateUser(user.id)}>Update</button>
          <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

// Example 7: Product management component
export const ProductManagementComponent = () => {
  const { data: productsData, isLoading } = useProducts({
    category: 'Electronics',
    sortBy: 'price',
    sortOrder: 'desc'
  });

  const createProduct = useCreateProduct();

  const handleCreateProduct = () => {
    createProduct.mutate({
      name: 'Gaming Mouse',
      description: 'High-precision gaming mouse',
      price: 79.99,
      category: 'Electronics',
      stock: 50
    });
  };

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div>
      <button onClick={handleCreateProduct}>Add Product</button>
      <div>
        {productsData?.data.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 8: Order management
export const OrderManagementComponent = () => {
  const { data: ordersData } = useOrders({
    status: 'pending',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const createOrder = useCreateOrder();

  const handleCreateOrder = () => {
    createOrder.mutate({
      userId: '1',
      items: [
        { productId: '1', quantity: 1 }
      ],
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      }
    });
  };

  return (
    <div>
      <button onClick={handleCreateOrder}>Create Order</button>
      {ordersData?.data.map(order => (
        <div key={order.id}>
          <p>Order #{order.id}</p>
          <p>Customer: {order.user?.name}</p>
          <p>Total: ${order.total}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

// Example 9: Dashboard component
export const DashboardComponent = () => {
  const { data: dashboardData, isLoading } = useDashboardStats();

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p>Total Users: {dashboardData?.data.totalUsers}</p>
        <p>Total Products: {dashboardData?.data.totalProducts}</p>
        <p>Total Orders: {dashboardData?.data.totalOrders}</p>
        <p>Total Revenue: ${dashboardData?.data.totalRevenue.toFixed(2)}</p>
      </div>
      
      <h2>Recent Orders</h2>
      {dashboardData?.data.recentOrders.map(order => (
        <div key={order.id}>
          <p>Order #{order.id} - ${order.total}</p>
        </div>
      ))}
      
      <h2>Top Products</h2>
      {dashboardData?.data.topProducts.map(product => (
        <div key={product.id}>
          <p>{product.name} - ${product.price}</p>
        </div>
      ))}
    </div>
  );
};

// ===== ADVANCED USAGE PATTERNS =====

// Example 10: Error handling and retry logic
export const RobustDataFetching = () => {
  const { 
    data, 
    isLoading, 
    error, 
    refetch, 
    isError,
    isRefetching 
  } = useUsers(
    { page: 1, limit: 10 },
    // Advanced React Query options
    {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Failed to fetch users:', error);
        // Handle error (show toast, log to service, etc.)
      },
      onSuccess: (data) => {
        console.log('Successfully fetched users:', data);
      }
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    return (
      <div>
        <p>Error: {error?.message}</p>
        <button onClick={() => refetch()} disabled={isRefetching}>
          {isRefetching ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  return <div>{/* Render data */}</div>;
};

// Example 11: Optimistic updates
export const OptimisticUpdateExample = () => {
  const queryClient = useQueryClient();
  
  const updateUser = useUpdateUser({
    // Optimistic update - immediately update the UI before the request completes
    onMutate: async ({ id, userData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(['users']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['users'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((user: any) => 
            user.id === id ? { ...user, ...userData } : user
          )
        };
      });
      
      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return <div>{/* Component JSX */}</div>;
};