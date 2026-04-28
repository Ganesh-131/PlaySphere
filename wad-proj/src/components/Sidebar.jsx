import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const friends = [
  { id: 1, name: "ShadowFiend", status: "online" },
  { id: 2, name: "NeonBlade", status: "in-game" },
  { id: 3, name: "VoidWalker", status: "offline" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]";
      case "in-game": return "bg-neon-purple shadow-glow-purple";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 h-full glass-panel flex flex-col p-4 z-20 m-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-2xl"></div>
      
      <div className="mb-10 text-center relative z-10">
        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple shadow-sm">
          NEXUS
        </h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Platform</p>
        {user && (
          <p className="text-xs text-neon-blue mt-2 truncate">{user.email}</p>
        )}
      </div>

      <nav className="flex-1 space-y-4 relative z-10">
        <Link to="/dashboard" className={`block p-3 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-white/10 text-neon-blue shadow-[inset_0_0_15px_rgba(0,240,255,0.2)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
          <span className="font-semibold tracking-wide">Dashboard</span>
        </Link>
        <Link to="/leaderboard" className={`block p-3 rounded-xl transition-all ${location.pathname === '/leaderboard' ? 'bg-white/10 text-yellow-400 shadow-[inset_0_0_15px_rgba(250,204,21,0.2)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
          <span className="font-semibold tracking-wide">Leaderboard</span>
        </Link>
        <Link to="/profile" className={`block p-3 rounded-xl transition-all ${location.pathname === '/profile' ? 'bg-white/10 text-neon-purple shadow-[inset_0_0_15px_rgba(176,38,255,0.2)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
          <span className="font-semibold tracking-wide">Profile</span>
        </Link>
      </nav>

      <div className="mt-auto relative z-10 pt-6 border-t border-white/10">
        <h3 className="text-sm font-display text-gray-400 mb-4 uppercase">Friends</h3>
        <ul className="space-y-3 mb-6">
          {friends.map(friend => (
            <li key={friend.id} className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(friend.status)}`}></div>
              <span className="text-sm font-medium text-gray-200">{friend.name}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all font-semibold text-sm uppercase tracking-wider"
        >
          Logout
        </button>
      </div>
    </motion.div>
  );
}
