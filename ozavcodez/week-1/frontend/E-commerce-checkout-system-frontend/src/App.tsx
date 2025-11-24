// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Products from "./pages/products/Products";
import Cart from "./pages/cart/Cart";
import { CartProvider } from "./pages/cart/context/CartContext";
import { Toaster } from "sonner";



const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />    
        </Routes>
      </CartProvider>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
};

        export default App;
