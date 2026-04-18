import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY // publishable key
);

// 🎯 Get gameId from command line
const gameId = process.argv[2];

if (!gameId) {
  console.log("❌ Please provide gameId");
  console.log("👉 Usage: node realtimeTest.js <gameId>");
  process.exit(1);
}

console.log(`🎮 Listening for realtime updates for game: ${gameId}`);

// 🔥 Realtime subscription function
const subscribeToGame = (gameId) => {
  const channel = supabase
    .channel(`game-${gameId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "games",
        filter: `id=eq.${gameId}`,
      },
      (payload) => {
        console.log("🔥 REALTIME UPDATE:");
        console.log("Board:", payload.new.game_state?.board);
        console.log("Turn:", payload.new.turn_index);
        console.log("Status:", payload.new.status);
        console.log("----------");
      }
    );

  channel.subscribe((status) => {
    console.log("📡 Subscription status:", status);
  });

  return channel;
};

// start listening
subscribeToGame(gameId);
// keep process alive
setInterval(() => {}, 1000);