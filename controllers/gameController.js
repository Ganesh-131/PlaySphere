const supabase = require("../config/supabase");

exports.createGame = async (req, res) => {
  const { game_type, max_players, is_private } = req.body;

  const userId = req.user.id;

  // 1. create game
  const { data: game, error: gameError } = await supabase
    .from("games")
    .insert([
      {
        host_id: userId,
        game_type,
        max_players,
        is_private,
        status: "waiting",
      },
    ])
    .select()
    .single();

  if (gameError) {
    return res.status(400).json({ error: gameError.message });
  }

  // 2. add host as first player
  const { error: playerError } = await supabase
    .from("game_players")
    .insert([
      {
        game_id: game.id,
        user_id: userId,
        player_order: 1,
        role: "host",
      },
    ]);

  if (playerError) {
    return res.status(400).json({ error: playerError.message });
  }

  res.json({
    message: "Game created",
    game,
  });
};

exports.joinGame = async (req, res) => {
  const { gameId } = req.body;
  const userId = req.user.id;

  // 1. get game
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (gameError || !game) {
    return res.status(404).json({ error: "Game not found" });
  }

  if (game.status !== "waiting") {
    return res.status(400).json({ error: "Game already started" });
  }

  // 2. get current players
  const { data: players, error: playersError } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", gameId);

  if (playersError) {
    return res.status(400).json({ error: playersError.message });
  }

  // check if already joined
  if (players.find(p => p.user_id === userId)) {
    return res.status(400).json({ error: "Already in game" });
  }

  // check if full
  if (players.length >= game.max_players) {
    return res.status(400).json({ error: "Game is full" });
  }

  // 3. join game
  const { error: joinError } = await supabase
    .from("game_players")
    .insert([
      {
        game_id: gameId,
        user_id: userId,
        player_order: players.length + 1,
        role: "player",
      },
    ]);

  if (joinError) {
    return res.status(400).json({ error: joinError.message });
  }

  res.json({
    message: "Joined game",
  });
};

const GAME_STATUS = {
  WAITING: "waiting",
  ONGOING: "ongoing",
  FINISHED: "finished",
};

exports.startGame = async (req, res) => {
  const { gameId } = req.body;
  const userId = req.user.id;

  // 1. get game
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (gameError || !game) {
    return res.status(404).json({ error: "Game not found" });
  }

  // 2. check if user is host
  if (game.host_id !== userId) {
    return res.status(403).json({ error: "Only host can start the game" });
  }

  // 3. check if already started
  if (game.status !== GAME_STATUS.WAITING) {
    return res.status(400).json({ error: "Game already started" });
  }

  // 4. check players count
  const { data: players, error: playersError } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", gameId);

  if (playersError) {
    return res.status(400).json({ error: playersError.message });
  }

  if (players.length < 2) {
    return res.status(400).json({ error: "Not enough players" });
  }

  // 5. update game status
  const { error: updateError } = await supabase
    .from("games")
    .update({ status: GAME_STATUS.ONGOING })
    .eq("id", gameId);

  if (updateError) {
    return res.status(400).json({ error: updateError.message });
  }

  res.json({
    message: "Game started",
  });
};