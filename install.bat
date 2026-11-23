@echo off
echo Installing root dependencies...
call npm install
echo Installing backend dependencies...
call npm install --prefix backend
echo Installing frontend dependencies...
call npm install --prefix frontend
echo.
echo Installation complete. Copy backend\.env.example to backend\.env and configure MongoDB.
pause
