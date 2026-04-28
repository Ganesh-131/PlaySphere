import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { gameAPI } from "../api/game";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const matchHistory = [
    { id: 1, opponent: "NeonBlade", result: "Victory", score: "1 - 0", date: "2H ago" },
    { id: 2, opponent: "VoidWalker", result: "Defeat", score: "0 - 1", date: "5H ago" },
    { id: 3, opponent: "CyberNinja", result: "Victory", score: "1 - 0", date: "1D ago" },
    { id: 4, opponent: "Glitch", result: "Draw", score: "0 - 0", date: "2D ago" },
  ];

  useEffect(() => {
    if (user) {
      setUsername(user.username || user.email.split('@')[0]);
    }
    fetchProfiles();
  }, [user]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await gameAPI.getProfiles();
      setProfiles(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
      setError('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    try {
      setLoading(true);
      await gameAPI.updateProfile(username);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Calculate rank based on profiles
  const userRank = profiles.findIndex(p => p.id === user?.id) + 1 || profiles.length + 1;

  return (
    <div className="max-w-4xl mx-auto h-full p-4">
      
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 flex items-center gap-8 relative overflow-hidden"
      >
        <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-neon-purple/20 blur-[80px] pointer-events-none"></div>

        <div className="w-32 h-32 rounded-full relative p-1 bg-gradient-to-tr from-neon-purple to-neon-blue shadow-glow-purple">
          <div className="w-full h-full bg-dark-space rounded-full flex items-center justify-center text-4xl">
            👽
          </div>
        </div>

        <div className="relative z-10">
          {!isEditing ? (
            <>
              <h1 className="text-4xl font-display font-bold text-white tracking-widest uppercase">{username}</h1>
              <p className="text-neon-blue font-semibold mt-1 tracking-wider">{user?.email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-neon-blue/20 text-neon-blue border border-neon-blue/50 rounded-lg hover:bg-neon-blue/30 transition-all text-sm font-semibold"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-neon-blue/50 rounded-lg px-4 py-2 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                placeholder="Enter new username"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-all text-sm font-semibold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Rank</p>
              <p className="text-xl font-display font-bold text-white mt-1">#{userRank}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Profiles Online</p>
              <p className="text-xl font-display font-bold text-green-400 mt-1">{profiles.length}</p>
            </div>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>
      </motion.div>

      {/* Match History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 glass-panel p-6"
      >
        <h2 className="text-xl font-display font-bold text-gray-200 mb-6 uppercase tracking-wider border-b border-white/10 pb-4">Combat Log</h2>
        
        <div className="space-y-3">
          {matchHistory.map((match) => (
            <div key={match.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                  match.result === 'Victory' ? 'bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 
                  match.result === 'Defeat' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 
                  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {match.result === 'Victory' ? 'V' : match.result === 'Defeat' ? 'D' : '-'}
                </div>
                <div>
                  <h4 className="text-gray-200 font-medium tracking-wide">vs {match.opponent}</h4>
                  <p className="text-xs text-gray-500 mt-1">{match.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-display font-bold text-lg ${
                  match.result === 'Victory' ? 'text-green-400' : 
                  match.result === 'Defeat' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {match.result}
                </p>
                <p className="text-sm text-gray-400">{match.score}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
