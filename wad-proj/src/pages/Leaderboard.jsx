import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { gameAPI } from "../api/game";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockPlayers = [
    { rank: 1, id: 1, username: "ShadowFiend", elo: 2450, wins: 142, winRate: "72%", avatar: "👽" },
    { rank: 2, id: 2, username: "NeonBlade", elo: 2310, wins: 110, winRate: "65%", avatar: "⚔️" },
    { rank: 3, id: 3, username: "CyberNinja", elo: 2195, wins: 98, winRate: "61%", avatar: "🥷" },
    { rank: 4, id: 4, username: "VoidWalker", elo: 2011, wins: 87, winRate: "55%", avatar: "🌀" },
    { rank: 5, id: 5, username: "Glitch", elo: 1980, wins: 76, winRate: "51%", avatar: "👾" },
    { rank: 6, id: 6, username: "GhostProtocol", elo: 1850, wins: 65, winRate: "48%", avatar: "👻" },
    { rank: 7, id: 7, username: "DataStream", elo: 1720, wins: 54, winRate: "45%", avatar: "💾" },
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await gameAPI.getProfiles();
      // Transform the response to match leaderboard format
      const leaderboardData = (response.data || []).map((profile, index) => ({
        rank: index + 1,
        id: profile.id,
        username: profile.username || 'Unknown',
        elo: 2000 - (index * 100), // Mock ELO calculation
        wins: 50 + (index * 10),
        winRate: `${50 + (index * 2)}%`,
        avatar: '👾',
        created_at: profile.created_at,
      }));
      
      setPlayers(leaderboardData.length > 0 ? leaderboardData : mockPlayers);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      // Fallback to mock data if backend fails
      setPlayers(mockPlayers);
      setError('Using demo data');
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]";
      case 2: return "bg-slate-300/20 text-slate-300 border-slate-300/50 shadow-[0_0_15px_rgba(203,213,225,0.2)]";
      case 3: return "bg-amber-700/20 text-amber-500 border-amber-700/50 shadow-[0_0_15px_rgba(180,83,9,0.2)]";
      default: return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col gap-8 max-w-5xl mx-auto w-full">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 text-center relative overflow-hidden"
      >
        <div className="absolute left-[50%] translate-x-[-50%] top-[-50%] w-[30vw] h-64 bg-purple-500/20 blur-[120px] pointer-events-none rounded-full"></div>
        <h2 className="text-4xl font-bold text-white relative z-10 mb-2 tracking-wider">Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Leaderboard</span></h2>
        <p className="text-slate-400 text-sm uppercase tracking-widest relative z-10">Top Tier Operators - Season 4</p>
        {error && (
          <p className="text-yellow-400 text-xs mt-2">{error}</p>
        )}
      </motion.div>

      {/* Roster Table */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel overflow-hidden"
      >
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading leaderboard...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-white/10 text-slate-400 text-sm uppercase tracking-widest">
                  <th className="p-6 font-medium">Rank</th>
                  <th className="p-6 font-medium">Operator</th>
                  <th className="p-6 font-medium">Rating (ELO)</th>
                  <th className="p-6 font-medium hidden md:table-cell">Total Wins</th>
                  <th className="p-6 font-medium hidden sm:table-cell">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    key={player.id || player.name} 
                    className="border-b border-white/5 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-6">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border ${getRankStyle(player.rank)}`}>
                        {player.rank}
                      </div>
                    </td>
                    <td className="p-6 font-bold text-white flex items-center gap-3 text-lg">
                      <span className="text-2xl drop-shadow-md">{player.avatar}</span>
                      {player.username}
                    </td>
                    <td className="p-6 text-blue-400 font-bold text-xl">{player.elo}</td>
                    <td className="p-6 text-slate-300 hidden md:table-cell">{player.wins}</td>
                    <td className="p-6 text-green-400 font-semibold hidden sm:table-cell">{player.winRate}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

    </div>
  );
}
