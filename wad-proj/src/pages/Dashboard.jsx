import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  
  const games = [
    {
      id: "tictactoe-1",
      title: "Neon Tic-Tac-Toe",
      description: "A classic reborn. Battle locally or against AI in a highly stylized 3x3 grid.",
      type: "Strategy",
      players: "1-2",
      icon: "❌⭕",
      color: "from-blue-500 to-purple-500",
      path: "/game/tictactoe"
    },
    {
      id: "shooter-mock",
      title: "Void Shooter [BETA]",
      description: "Fast-paced twin stick shooter arena. Currently in closed beta testing.",
      type: "Action",
      players: "1-4",
      icon: "🔫",
      color: "from-pink-500 to-rose-500",
      path: "#"
    },
    {
      id: "chess-mock",
      title: "Cyber Chess",
      description: "Classic chess with dynamic moving neon pieces. Elo ranked match making.",
      type: "Board",
      players: "2",
      icon: "♟️",
      color: "from-emerald-400 to-teal-500",
      path: "#"
    }
  ];

  return (
    <div className="h-full flex flex-col gap-8">
      {/* Platform Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 relative overflow-hidden"
      >
        <div className="absolute right-[-10%] top-[-50%] w-64 h-64 bg-blue-500/20 blur-[100px] pointer-events-none rounded-full"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-2">Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Hub</span></h2>
          <p className="text-slate-400 text-lg">Select an arena to deploy your operator.</p>
        </div>
      </motion.div>

      {/* Game Catalog */}
      <h3 className="text-2xl font-bold text-white tracking-wider border-b border-white/10 pb-4">Game Catalog</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {games.map((game, index) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: index * 0.1 }}
            key={game.id}
            className="glass-panel flex flex-col overflow-hidden group hover:border-slate-500 transition-all cursor-pointer relative"
            onClick={() => game.path !== "#" && navigate(game.path)}
          >
            {/* Card Graphic Top */}
            <div className={`h-32 bg-gradient-to-r ${game.color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center relative overflow-hidden`}>
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors"></div>
               <span className="text-6xl drop-shadow-2xl relative z-10 scale-90 group-hover:scale-110 transition-transform duration-300">{game.icon}</span>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{game.title}</h3>
                {game.path === "#" && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 uppercase font-bold tracking-widest">Locked</span>}
              </div>
              <p className="text-slate-400 text-sm mb-6 flex-1">{game.description}</p>
              
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium uppercase tracking-wider mb-4 border-t border-white/5 pt-4">
                 <span>{game.type}</span>
                 <span><span className="text-slate-300">{game.players}</span> Players</span>
              </div>

              <button 
                disabled={game.path === "#"}
                className="w-full bg-slate-800 text-white border border-slate-600 px-4 py-3 rounded-lg font-bold group-hover:bg-blue-600 group-hover:border-blue-500 disabled:opacity-50 disabled:group-hover:bg-slate-800 disabled:group-hover:border-slate-600 transition-all uppercase tracking-widest text-sm shadow-xl"
              >
                {game.path === "#" ? "Coming Soon" : "Deploy"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
