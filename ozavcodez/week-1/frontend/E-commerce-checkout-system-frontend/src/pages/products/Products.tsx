import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../cart/context/CartContext";
import CartIcon from "../cart/components/CartIcon";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    // Mock products data - corrected to match Product interface
    const dummyProducts: Product[] = [
      {
        _id: "1",
        name: "iPhone 15 Pro",
        price: 1200000,
        description: "Latest iPhone with titanium design and powerful camera system.",
      },
      {
        _id: "2",
        name: "MacBook Pro",
        price: 2500000,
        description: "Powerful laptop for developers and creative professionals.",
      },
      {
        _id: "3",
        name: "AirPods Pro",
        price: 95000,
        description: "Active noise cancellation with immersive sound quality.",
      },
    ];

    setProducts(dummyProducts);
    setLoading(false);
  }, []);

  const handleAddToCart = async (product: Product) => {
    const toastId = toast.loading(`Adding ${product.name} to cart...`);
    
    try {
      await addToCart(product, 1);
      toast.dismiss(toastId);
      toast.success(`${product.name} added to cart! 🛒`);
    } catch (err: any) {
      toast.dismiss(toastId);
      
      if (err.message.includes("SESSION_EXPIRED") || err.message.includes("login") || err.message.includes("User ID")) {
        toast.error("Please login to add items to cart");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(err.message || "Failed to add item to cart");
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFDF4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9CC15E] mx-auto mb-4"></div>
          <p className="text-[#7C8689]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFDF4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#4B545D]">Our Products</h1>
            <p className="text-lg text-[#7C8689] mt-2">
              Discover our curated collection of premium products
            </p>
          </div>
          <CartIcon />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-[#DFDFDF]">
              <div className="h-48 bg-gradient-to-br from-[#FBFDF4] to-[#9CC15E] flex items-center justify-center">
                <div className="text-5xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  📱
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#4B545D] mb-2">{product.name}</h3>
                <p className="text-[#7C8689] text-sm mb-4 leading-relaxed">{product.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-[#4B545D]">{formatPrice(product.price)}</span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[#9CC15E] hover:bg-[#8AB350] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;