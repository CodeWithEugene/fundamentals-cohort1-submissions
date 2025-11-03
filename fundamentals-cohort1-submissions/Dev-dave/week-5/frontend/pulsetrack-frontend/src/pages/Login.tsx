import  { useState }  from "react";
import api from "../lib/api";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from  "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", { email, password });
            login(response.data.user, response.data.accessToken);
            navigate("/Home");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
    <main className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-center text-emerald-700 mb-6">
          Login to PulseTrack
        </h2>

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
          Login
        </button>
      </form>
    </main>
    );
}

export default Login;
