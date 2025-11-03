import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";



const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);



    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", { name, email, password });
            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
    <main className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-center text-emerald-700 mb-6">
          Create Your Account
        </h2>

        <div>
          <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        </div>
        
        <div>
          <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        
        <div className="relative mb-4">
         <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700" >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        </div>


        <button className="w-full bg-emerald-600 text-white py-3 rounded hover:bg-emerald-700">
          Register
        </button>
        
       <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-6000 hover:underline">
            Log in
          </Link>
        </p>
      </form>

    </main>
    );
}

export default Register;