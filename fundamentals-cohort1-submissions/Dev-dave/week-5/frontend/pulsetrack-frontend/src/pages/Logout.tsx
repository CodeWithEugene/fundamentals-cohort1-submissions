import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Perform logout immediately
    logout();

    // Redirect after 2 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <main className="min-h-screen  from-emerald-50 to-white flex flex-col">


      <section className="flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md border border-emerald-100">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

          <h1 className="text-3xl font-bold text-emerald-700 mb-2">
            Logging Out...
          </h1>
          <p className="text-gray-600 mb-4">
            You are being securely signed out of your account.
          </p>
          <p className="text-emerald-500 font-medium">
            Redirecting to home page...
          </p>
        </div>
      </section>

    </main>
  );
};

export default Logout;
