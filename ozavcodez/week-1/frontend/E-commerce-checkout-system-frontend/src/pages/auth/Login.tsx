// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../../apis/Auth/login";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "test@example.com", password: "password123" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await LoginApi(form);
      localStorage.setItem("token", JSON.stringify(res.token));
      localStorage.setItem("userId", JSON.stringify(res.user.id));
      toast.success("Login successful!") ;
      navigate("/products");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFDF4] px-4">
        <h2 className="text-3xl text-[#4B545D] font-bold mb-3 text-center">Welcome Back</h2>
        <p className="text-[#7C8689] mb-3">Please enter your login details to continue</p>
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border border-[#DFDFDF] rounded-md focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-[#DFDFDF] rounded-md focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#9CC15E] hover:bg-[#9CC15E] text-white py-2 rounded-md transition cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
