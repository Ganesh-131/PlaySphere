import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Chat from "../components/Chat";
import { gameAPI } from "../api/game";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameState, setGameState] = useState({ status: 'loading' });
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  // Local game logic
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && !board.includes(null);
  const isFinished = winner || isDraw;
  

  // Try to fetch game state from backend
  useEffect(() => {
    const channel = supabase
      .channel(`game-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log("🔥 Realtime:", payload.new);

          const newState = payload.new.game_state;

          if (newState?.board) {
            setBoard(newState.board);
          }
          setGameState(payload.new);
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleMove = async (index) => {
    // Ignore if cell taken or game finished
    if (board[index] || isFinished || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Send move to backend
      await gameAPI.makeMove(id, index);
      // ❌ DO NOT update board here
      // Realtime will handle it
    } catch (err) {
      console.error('Move failed:', err);
      setError(err.response?.data?.error || 'Move failed');
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setError(null);
  };

  const handleStartGame = async () => {
    try {
      setLoading(true);
      await gameAPI.startGame(id);
      setError(null);
    } catch (err) {
      console.error('Failed to start game:', err);
      setError(err.response?.data?.error || 'Failed to start game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex gap-6">
      
      {/* Game Board Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 w-full max-w-lg mb-8 relative"
        >
          {isFinished && (
            <div className="absolute inset-0 bg-dark-space/80 backdrop-blur-sm z-20 rounded-2xl flex flex-col items-center justify-center">
              <h2 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink mb-4">
                {isDraw ? 'DRAW' : `${winner} WINS`}
              </h2>
              <button 
                onClick={resetGame}
                className="btn text-white border border-neon-blue bg-neon-blue/20 hover:bg-neon-blue/40 transition-all font-display uppercase tracking-widest text-sm py-3 px-8 rounded-lg shadow-glow-blue"
              >
                Play Again
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-display font-bold text-white tracking-wider">ARENA</h2>
            <div className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
              !isFinished ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
            }`}>
              {gameState.status === "ongoing"
                ? `Turn: ${gameState.turn_index === 0 ? "X" : "O"}`
                : "Finished"
              }
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 aspect-square w-full">
            {board.map((cell, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: cell || isFinished || loading ? 1 : 1.05 }}
                whileTap={{ scale: cell || isFinished || loading ? 1 : 0.95 }}
                onClick={() => handleMove(index)}
                disabled={cell !== null || isFinished || loading}
                className={`w-full h-full rounded-xl flex items-center justify-center text-6xl font-display transition-all ${
                  cell === null ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 
                  cell === 'X' ? 'bg-neon-blue/10 border-neon-blue/50 text-neon-blue shadow-[inset_0_0_20px_rgba(0,240,255,0.2)]' : 
                  'bg-neon-pink/10 border-neon-pink/50 text-neon-pink shadow-[inset_0_0_20px_rgba(255,0,127,0.2)]'
                }`}
              >
                {cell && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    {cell}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>

          {error && (
            <div className="mt-4 text-red-400 text-sm text-center bg-red-400/10 p-2 rounded border border-red-400/20">
              {error}
            </div>
          )}

          <button
            onClick={handleStartGame}
            disabled={loading || isFinished}
            className="w-full mt-4 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-all font-semibold text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Game'}
          </button>
        </motion.div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 h-[80vh] min-h-[600px] hidden lg:block">
        <Chat roomId={id} />
      </div>

    </div>
  );
}
