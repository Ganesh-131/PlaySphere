const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration for frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const supabase = require("./config/supabase");

app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase
    .from("test")
    .select("*");

  if (error) {
    return res.status(500).json({ error });
  }

  res.json(data);
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

app.put("/profile", authMiddleware, async (req, res) => {
  const { username } = req.body;

  // basic validation
  if (!username || username.length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters" });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", req.user.id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({
    message: "Profile updated",
    profile: data,
  });
});

app.get("/profiles", async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data || []);
});

// Get games list
app.get("/api/games/list", authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data || []);
});

// Get single game
app.get("/api/games/:gameId", authMiddleware, async (req, res) => {
  const { gameId } = req.params;

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Game not found" });
  }

  res.json(data);
});

const gameRoutes = require("./routes/gameRoutes");
app.use("/api/games", gameRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});