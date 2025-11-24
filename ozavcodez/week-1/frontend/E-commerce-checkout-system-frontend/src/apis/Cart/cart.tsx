// apis/Cart/cart.ts
const url = import.meta.env.VITE_APP_CHECKOUT_BASE_URL;

// Interfaces
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface CartResponse {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
  price?: number;
  productName?: string;
  imageUrl?: string;
}

// Get authentication headers
const getAuthHeaders = (): HeadersInit => {
  const tokenData = localStorage.getItem('token');
  
  if (!tokenData) {
    throw new Error("Please login to continue");
  }

  try {
    const parsedToken = JSON.parse(tokenData);
    const authKey = parsedToken.userAuthToken || parsedToken.accessToken;

    if (!authKey) {
      throw new Error("Invalid token");
    }

    return {
      "Authorization": `Bearer ${authKey}`,
      "Content-Type": "application/json",
    };
  } catch (error) {
    throw new Error("Failed to authenticate");
  }
};

// Get user ID from token
const getUserIdFromToken = (): string => {
  try {
    const tokenData = localStorage.getItem('token');
    if (!tokenData) {
      throw new Error("No token found");
    }
    
    const parsedToken = JSON.parse(tokenData);
    const userId =  parsedToken.user?.id;
    
    if (!userId) {
      throw new Error("User ID not found in token");
    }
    
    return userId;
  } catch (error) {
    throw new Error("Failed to get user ID from token");
  }
};

// Fetch user's cart
export const getUserCart = async (): Promise<CartResponse> => {
  const userId = getUserIdFromToken();  
  const response = await fetch(`${url}/api/get-cart/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse?.error || errorResponse?.message || "Failed to fetch cart");
  }
  return response.json();
}
// Add item to cart
export const addToCart = async (payload:AddToCartPayload): Promise<CartResponse> => {
  const userId = getUserIdFromToken();
  const response = await fetch(`${url}/api/cart/add-to-cart`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse?.error || errorResponse?.message || "Failed to add item to cart");
  }
  return response.json();
}