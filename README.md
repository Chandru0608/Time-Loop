# TIME LOOP: The Last Timeline

A runnable MERN-style multiplayer detective escape-room game with 10 chapters.

## Requirements
- Node.js 18+
- MongoDB running locally, OR a MongoDB Atlas connection string

## Quick start (Windows)
1. Extract the ZIP.
2. Open the extracted `time-loop` folder in VS Code.
3. Double-click `install.bat` (or run `npm install` in the root, then `npm install --prefix backend` and `npm install --prefix frontend`).
4. Copy `backend/.env.example` to `backend/.env`.
5. Set `MONGO_URI` in `backend/.env`. Local default: `mongodb://127.0.0.1:27017/time_loop`.
6. Run `start.bat` (or `npm run dev` from the root).
7. Open http://localhost:5173

## Quick start (macOS/Linux)
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
cp backend/.env.example backend/.env
# Ensure MongoDB is running, then:
npm run dev
```

The backend runs on http://localhost:5000 and frontend on http://localhost:5173.

## Multiplayer
- Register two accounts in two browser windows/devices.
- In the first account, create a room and copy its 6-character room code.
- In the second account, join using that code.
- The host starts the investigation. Room updates, clue collection, puzzle results, chat and resets are synchronized through Socket.IO.
- For local testing, both browser windows can be on the same computer.

## Gameplay
- 10 chapters with unique story briefings, interactive locations, clues and puzzles.
- Each chapter has a 3-minute shared timeline (server-controlled).
- Correctly solve puzzles and collect required clues to unlock the next chapter.
- On timeout, the world resets but discovered memories persist.
- Chapter 10 unlocks one of four endings based on the final decision.
- Progress is stored in MongoDB per room.

## Notes
- This is a complete playable starter implementation, designed to be extended with artwork, sound, richer room navigation and deeper branching dialogue.
- The game is fictional and uses simulated detective/hacking puzzles only.
- Keep `.env` private; do not commit secrets.
