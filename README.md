# PlaySphere - Full Stack Game Platform

A modern, real-time multiplayer gaming platform built with React, Express.js, and Supabase. Play Tic-Tac-Toe with real players in a neon-themed arena.

## 🚀 Features

- **Authentication**: Secure signup/login with JWT tokens
- **Real-time Multiplayer Games**: Play Tic-Tac-Toe with other players
- **Leaderboard**: Global rankings and player statistics
- **Player Profiles**: Manage your profile and view match history
- **Real-time Chat**: In-game communication with opponents
- **Responsive Design**: Works on desktop and tablets with beautiful UI

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (for database and authentication)

## 🛠️ Setup Instructions

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with your Supabase credentials:

```env
PORT=5000
JWT_SECRET=your-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd wad-proj
npm install
```

Create a `.env.local` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎮 Quick Start

1. **Start both servers** (backend on port 5000, frontend on port 5173)
2. **Navigate to** `http://localhost:5173`
3. **Sign up** with an email and password
4. **Login** with your credentials
5. **Create a Game** by clicking the Tic-Tac-Toe card
6. **Invite another player** to join the game
7. **Play** and compete on the leaderboard!

## 📁 Project Structure

```
PlaySphere/
├── backend/
│   ├── config/
│   │   └── supabase.js          # Supabase client configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── gameController.js    # Game logic (create, join, move)
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── gameRoutes.js        # Game endpoints
│   ├── index.js                 # Express server setup
│   └── package.json
│
└── wad-proj/
    ├── src/
    │   ├── api/
    │   │   ├── auth.js          # Auth API calls
    │   │   ├── axiosClient.js   # Axios instance with JWT
    │   │   └── game.js          # Game API calls
    │   ├── components/
    │   │   ├── Chat.jsx         # In-game chat
    │   │   ├── Layout.jsx       # Main layout wrapper
    │   │   ├── ProtectedRoute.jsx # Auth guard
    │   │   └── Sidebar.jsx      # Navigation sidebar
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx        # Login/Signup page
    │   │   ├── Dashboard.jsx    # Game selection
    │   │   ├── Game.jsx         # Game board
    │   │   ├── Profile.jsx      # User profile
    │   │   └── Leaderboard.jsx  # Rankings
    │   ├── hooks/
    │   │   └── useRealtimeGame.js # Real-time game hook
    │   ├── App.jsx              # Route configuration
    │   └── main.jsx             # Entry point
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Games
- `POST /api/games/create` - Create a new game
- `POST /api/games/join` - Join an existing game
- `POST /api/games/start` - Start a game (host only)
- `POST /api/games/move` - Make a move in the game
- `GET /api/games/list` - Get all available games
- `GET /api/games/:gameId` - Get specific game details

### Profile
- `GET /profiles` - Get all player profiles (leaderboard)
- `GET /profile` - Get current user profile (protected)
- `PUT /profile` - Update current user profile (protected)

## 🔐 Authentication Flow

1. User signs up with email, password, and username
2. Backend creates Supabase auth user
3. Backend stores username in profiles table
4. User logs in and receives JWT token
5. JWT token stored in localStorage
6. All subsequent requests include JWT in Authorization header
7. Backend validates JWT and extracts user ID
8. User data persists even after page refresh

## 🎯 Game Flow

1. **Create Game**: Host creates a game (stored in database)
2. **Join Game**: Other players find and join the game
3. **Start Game**: Host starts the game when ready
4. **Play**: Players take turns making moves
5. **Finish**: Game ends when someone wins or it's a draw
6. **Leaderboard**: Winner gains ranking points

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify Supabase credentials in `.env`
- Run `npm install` in backend directory

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check VITE_API_URL in `.env.local`
- Look for CORS errors in browser console
- Verify firewall isn't blocking localhost communication

### Authentication fails
- Clear localStorage and try again
- Verify Supabase project is active
- Check if JWT_SECRET is set in backend

### Games not persisting
- Verify Supabase database tables exist:
  - `games` - game records
  - `game_players` - player participation
  - `profiles` - user profiles
- Check Supabase connection credentials

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Push code to Git
2. Set environment variables on platform
3. Deploy and get production URL

### Frontend Deployment (Vercel/Netlify)
1. Update VITE_API_URL to production backend
2. Deploy through Git or CLI
3. Update CORS in backend for production domain

## 📝 Development Notes

- **State Management**: Using React Context for auth
- **Real-time Updates**: Polling or WebSocket ready for implementation
- **Error Handling**: All API calls wrapped with try-catch
- **Loading States**: Visual feedback during API calls
- **Responsive Design**: Mobile-first with Tailwind CSS

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and commercial use.

## 🎨 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **HTTP Client**: Axios

## 🌟 Future Enhancements

- [ ] WebSocket for real-time game updates
- [ ] More game modes (chess, checkers, etc.)
- [ ] ELO ranking system
- [ ] Match replay functionality
- [ ] Friend system and invitations
- [ ] Achievements and badges
- [ ] Mobile app with React Native

---

**Ready to play?** Start both servers and visit `http://localhost:5173`! 🎮
