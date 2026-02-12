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
      setLoading(false);
      return;
    }

    const signedInUser = data?.user;

    if (!signedInUser) {
      navigate("/", { replace: true });
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", signedInUser.id)
      .single();

    if (profileError) {
      alert("Error fetching profile: " + profileError.message);
      navigate("/", { replace: true });
      setLoading(false);
      return;
    }

    const userRole = profile?.role || "customer";
    localStorage.setItem("userRole", userRole);
    const targetRoute = userRole === "admin" ? "/admin" : "/";
    navigate(targetRoute, { replace: true });
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-accent-50 pt-16 px-4 pb-4">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[420px_1fr]">
          <div className="flex items-center justify-center p-4 lg:p-6 bg-blue-50">
            <img
              src="/starry-night.jpg"
              alt="Starry Night inspired artwork"
              className="w-full max-w-[360px] h-[180px] lg:h-[280px] object-cover rounded-xl shadow-md"
            />
          </div>

          <div className="p-8 lg:p-10">
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
                    placeholder="********"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary-500 hover:bg-secondary-600 text-black py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default Login;
