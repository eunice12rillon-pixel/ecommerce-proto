import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    loadSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      const signedInUser = data?.user;

      if (!signedInUser) {
        console.log("No user after login, navigating to /");
        navigate("/", { replace: true });
        setLoading(false);
        return;
      }

      console.log("Fetching profile for user ID:", signedInUser.id);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", signedInUser.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        alert("Error fetching profile: " + profileError.message);
        navigate("/", { replace: true });
        setLoading(false);
        return;
      }

      console.log("Profile data:", profile);
      console.log("Role:", profile?.role);

      // Alternative 2: Store role in localStorage for persistence
      const userRole = profile?.role || "customer";
      localStorage.setItem("userRole", userRole);
      const targetRoute = userRole === "admin" ? "/admin" : "/";
      console.log("Navigating to:", targetRoute);
      navigate(targetRoute, { replace: true });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Clear user state
    navigate("/"); // Navigate to the home page or login
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-primary-800">
            Login to Artisan Alley
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Welcome back! Sign in to continue your creative journey.
          </p>

          {!user ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Log Out
            </button>
          )}

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-700 hover:text-primary-800 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
