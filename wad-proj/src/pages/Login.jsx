import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });
  const [status, setStatus] = useState({ loading: false, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      if (isLogin) {
        // Login flow
        if (!formData.email || !formData.password) {
          setStatus({ loading: false, error: "Please fill in all required fields." });
          return;
        }
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } else {
        // Signup flow
        if (!formData.email || !formData.password || !formData.username) {
          setStatus({ loading: false, error: "Please fill in all required fields." });
          return;
        }
        await signup(formData.email, formData.password, formData.username);
        // After signup, switch to login mode to allow user to login
        setIsLogin(true);
        setFormData({ ...formData, password: "", username: "" });
        setStatus({ loading: false, error: null });
        setStatus({ loading: false, error: "Signup successful! Please login." });
      }
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-space">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/30 rounded-full blur-[150px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/30 rounded-full blur-[150px] animate-pulse-slow font-delay-500"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 glass-panel relative z-10"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-lg"
          >
            NEXUS
          </motion.h1>
          <p className="text-gray-400 mt-2 tracking-widest text-sm uppercase">Enter the arena</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                placeholder="ShadowFiend"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
              placeholder="player@nexus.gg"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {status.error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded border border-red-400/20">
              {status.error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={status.loading}
            className="w-full relative group overflow-hidden rounded-lg p-[1px] transition-all"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-70 group-hover:opacity-100 transition-opacity"></span>
            <div className="relative bg-dark-space px-8 py-3 rounded-[7px] transition-all group-hover:bg-opacity-0">
              <span className="relative z-10 text-white font-bold tracking-wider uppercase text-sm">
                {status.loading ? "Connecting..." : (isLogin ? "Initialize" : "Register")}
              </span>
            </div>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-white transition-colors text-sm hover:underline"
            type="button"
          >
            {isLogin ? "Need access? Register here" : "Already an operator? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
