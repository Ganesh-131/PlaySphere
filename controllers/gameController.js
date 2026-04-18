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
        game_state: {
          board: Array(9).fill(null),
        },
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

const checkWinner = (board) => {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (let [a, b, c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
};

exports.makeMove = async (req, res) => {
  const { gameId, position } = req.body;
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

  if (game.status !== "ongoing") {
    return res.status(400).json({ error: "Game is not active" });
  }

  // 2. get players
  const { data: players, error: playersError } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", gameId)
    .order("player_order");

  if (playersError) {
    return res.status(400).json({ error: playersError.message });
  }

  const playerIndex = players.findIndex(p => p.user_id === userId);

  if (playerIndex === -1) {
    return res.status(403).json({ error: "Not part of this game" });
  }

  // 3. check turn
  if (game.turn_index !== playerIndex) {
    return res.status(400).json({ error: "Not your turn" });
  }

  // 4. get board
  let board = game.game_state?.board;

  // fallback if board not initialized
  if (!board) {
    board = Array(9).fill(null);
  }

  if (board[position] !== null) {
    return res.status(400).json({ error: "Cell already filled" });
  }

  // 5. assign symbol
  const symbol = playerIndex === 0 ? "X" : "O";

  board[position] = symbol;

  // check winner
  const winnerSymbol = checkWinner(board);

  let updateData = {
    game_state: { board },
  };

  // if winner found
  if (winnerSymbol) {
    const winnerPlayer = players[winnerSymbol === "X" ? 0 : 1];

    updateData.status = "finished";
    updateData.winner_id = winnerPlayer.user_id;
  } else if (board.every(cell => cell !== null)) {
    // draw
    updateData.status = "finished";
    updateData.is_draw = true;
  } else {
    // continue game
    updateData.turn_index = (game.turn_index + 1) % players.length;
  }

  // update DB
  const { error: updateError } = await supabase
    .from("games")
    .update(updateData)
    .eq("id", gameId);

  if (updateError) {
    return res.status(400).json({ error: updateError.message });
  }

  res.json({
    message: "Move made",
    board,
  });
};