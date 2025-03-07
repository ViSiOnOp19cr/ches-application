# Online Chess Application

## Overview
This is a full-stack multiplayer chess application featuring both player vs. player and player vs. computer gameplay modes.

## Features
- Real-time online multiplayer chess
- AI opponent with three difficulty levels (easy, medium, hard)
- User authentication with Clerk
- Intuitive UI with move highlighting
- Visual indicators for check, checkmate, and last move

## Tech Stack
### Backend
- **WebSockets** - Real-time communication
- **chess.js** - Chess logic and validation
- **TypeScript** - Type safety and better development experience

### Frontend
- **React** (v19) - UI library
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Styling
- **Clerk** - Authentication
- **Vite** - Build tool and development server

## Project Structure
- `backend1/` - WebSocket server for handling game logic and matchmaking
- `frontend/` - React application for user interface

## Getting Started

### Prerequisites
- npm or yarn
- Clerk account for authentication

### Backend Setup
1. Navigate to the backend directory:
```
cd backend1
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

### Frontend Setup
1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file with your Clerk key:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. Start the development server:
```
npm run dev
```

## Game Modes

### Online Multiplayer
- Automatic matchmaking pairs you with another online player
- Real-time gameplay with move validation
- Communication via WebSockets for instant updates

### Computer Opponent
- Three difficulty levels:
  - **Easy**: Makes random valid moves
  - **Medium**: Considers captures and checks
  - **Hard**: Uses minimax algorithm with alpha-beta pruning

## How to Play
1. Sign in with your Clerk account
2. Choose "Play Online" or "Play Computer" from the home page
3. For computer games, select your preferred color and difficulty
4. Make moves by clicking the piece and then clicking the destination

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements
- [chess.js](https://github.com/jhlywa/chess.js) for chess logic
- [React](https://reactjs.org/) for UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Clerk](https://clerk.dev/) for authentication
