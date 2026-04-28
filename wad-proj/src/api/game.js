import axiosClient from './axiosClient';

export const gameAPI = {
  // Create a new game
  createGame: (gameType, maxPlayers, isPrivate = false) =>
    axiosClient.post('/api/games/create', { 
      game_type: gameType, 
      max_players: maxPlayers, 
      is_private: isPrivate 
    }),
  getGame: (gameId) =>
    axiosClient.get(`/api/games/${gameId}`),
  // Join an existing game
  joinGame: (gameId) =>
    axiosClient.post('/api/games/join', { gameId }),
  
  // Start a game (host only)
  startGame: (gameId) =>
    axiosClient.post('/api/games/start', { gameId }),
  
  // Make a move in the game
  makeMove: (gameId, position) =>
    axiosClient.post('/api/games/move', { gameId, position }),
  
  // Get all profiles
  getProfiles: () =>
    axiosClient.get('/profiles'),
  
  // Get protected route (user info)
  getProtected: () =>
    axiosClient.get('/protected'),
  
  // Update profile
  updateProfile: (username) =>
    axiosClient.put('/profile', { username }),
};
