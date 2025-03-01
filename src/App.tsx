import React, { useState, useEffect } from 'react';
import { ChessBoard } from './components/ChessBoard';
import { GameControls } from './components/GameControls';
import { GameInfo } from './components/GameInfo';
import { initialBoard } from './utils/chessUtils';
import { ChessPiece, ChessBoard as ChessBoardType, Position, GameState } from './types/chess';

function App() {
  const [board, setBoard] = useState<ChessBoardType>(initialBoard());
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{
    white: ChessPiece[],
    black: ChessPiece[]
  }>({ white: [], black: [] });

  // Reset the game to initial state
  const resetGame = () => {
    setBoard(initialBoard());
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentPlayer('white');
    setGameState('playing');
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mujtabas Chess Game</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1 flex justify-center">
          <ChessBoard 
            board={board}
            selectedPiece={selectedPiece}
            validMoves={validMoves}
            setSelectedPiece={setSelectedPiece}
            setValidMoves={setValidMoves}
            setBoard={setBoard}
            currentPlayer={currentPlayer}
            setCurrentPlayer={setCurrentPlayer}
            gameState={gameState}
            setGameState={setGameState}
            setMoveHistory={setMoveHistory}
            setCapturedPieces={setCapturedPieces}
          />
        </div>
        
        <div className="flex-1 flex flex-col gap-6">
          <GameInfo 
            currentPlayer={currentPlayer}
            gameState={gameState}
            moveHistory={moveHistory}
            capturedPieces={capturedPieces}
          />
          
          <GameControls 
            resetGame={resetGame}
            gameState={gameState}
          />
        </div>
      </div>
    </div>
  );
}

export default App;