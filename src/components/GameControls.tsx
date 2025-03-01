import React from 'react';
import { RotateCcw } from 'lucide-react';
import { GameState } from '../types/chess';

interface GameControlsProps {
  resetGame: () => void;
  gameState: GameState;
}

export const GameControls: React.FC<GameControlsProps> = ({
  resetGame,
  gameState
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Game Controls</h2>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={resetGame}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          <RotateCcw size={18} />
          New Game
        </button>
        
        {(gameState === 'checkmate' || gameState === 'stalemate' || gameState === 'draw') && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800 font-medium">
              Game over! {gameState === 'checkmate' ? 'Checkmate!' : gameState === 'stalemate' ? 'Stalemate!' : 'Draw!'}
            </p>
            <p className="text-amber-700 text-sm mt-1">
              Click "New Game" to play again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};