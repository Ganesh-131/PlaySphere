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
  const [roomCode, setRoomCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameState, setGameState] = useState({
    status: 'waiting',
    turn_index: 0,
  });
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  

  const isFinished = gameState.status === "finished";
  
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await gameAPI.getGame(id);

        let state = res.data.game.game_state;

        // parse if string
        if (typeof state === "string") {
          state = JSON.parse(state);
        }

        if (state?.board) {
          setBoard(state.board);
        }

        setGameState(res.data.game);
        setRoomCode(res.data.game.room_code);
      } catch (err) {
        console.error("Failed to fetch game:", err);
      }
    };

    fetchGame();
  }, [id]);


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

          let newState = payload.new.game_state;

          // ✅ FIX: parse if string
          if (typeof newState === "string") {
            newState = JSON.parse(newState);
          }

          if (newState?.board) {
            setBoard(newState.board);
          }
          setGameState((prev) => ({
            ...payload.new,
            players: prev.players, // ✅ KEEP players
          }));
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
  const getWinnerSymbol = () => {
    if (gameState.is_draw) return "draw";

    if (!gameState.players) return null; // safety

    const winner = gameState.players.find(
      (p) => p.user_id === gameState.winner_id
    );

    if (!winner) return null;

    return winner.player_order === 1 ? "X" : "O";
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
          

          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            {roomCode && (
              <div className="flex items-center justify-between mb-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                
                <span className="text-sm text-gray-400">
                  Room Code:
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono text-neon-blue tracking-widest">
                    {roomCode}
                  </span>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(roomCode);
                      setCopied(true);

                      setTimeout(() => {
                        setCopied(false);
                      }, 1500);
                    }}
                    className={`px-2 py-1 text-xs rounded transition-all ${
                      copied
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </motion.button>
                </div>

              </div>
            )}
            <h2 className="text-2xl font-display font-bold text-white tracking-wider">ARENA</h2>
            <div className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
              gameState.status === "ongoing"
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : gameState.status === "waiting"
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
            }`}>
              {gameState.status === "waiting" && "Waiting..."}
              {gameState.status === "ongoing" &&
                `Turn: ${gameState.turn_index === 0 ? "X" : "O"}`
              }
              {gameState.status === "finished" && "Finished"}
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

          {gameState.status === "finished" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl z-10">
              
              <h2 className="text-4xl font-bold text-white mb-4">
                {gameState.is_draw
                  ? "It's a Draw 🤝"
                  : `${getWinnerSymbol()} Wins 🎉`
                }
              </h2>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-400 text-sm text-center bg-red-400/10 p-2 rounded border border-red-400/20">
              {error}
            </div>
          )}

          {gameState.status === "waiting" && (
            <button
              onClick={handleStartGame}
              disabled={loading}
              className="w-full mt-4 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-all font-semibold text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Game'}
            </button>
          )}
        </motion.div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 h-[80vh] min-h-[600px] hidden lg:block">
        <Chat roomId={id} />
      </div>

    </div>
  );
}
