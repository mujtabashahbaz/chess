import React from 'react';
import { ChessPiece, GameState } from '../types/chess';
import { PieceIcon } from './PieceIcon';

interface GameInfoProps {
  currentPlayer: 'white' | 'black';
  gameState: GameState;
  moveHistory: string[];
  capturedPieces: {
    white: ChessPiece[];
    black: ChessPiece[];
  };
}

export const GameInfo: React.FC<GameInfoProps> = ({
  currentPlayer,
  gameState,
  moveHistory,
  capturedPieces
}) => {
  const getGameStateMessage = () => {
    switch (gameState) {
      case 'check':
        return `${currentPlayer === 'white' ? 'White' : 'Black'} is in check!`;
      case 'checkmate':
        return `Checkmate! ${currentPlayer === 'white' ? 'Black' : 'White'} wins!`;
      case 'stalemate':
        return 'Stalemate! The game is a draw.';
      case 'draw':
        return 'Draw!';
      default:
        return `${currentPlayer === 'white' ? 'White' : 'Black'}'s turn`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Game Status</h2>
        <div className={`px-3 py-1 rounded-full ${
          gameState === 'playing' ? 'bg-green-100 text-green-800' : 
          gameState === 'check' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {getGameStateMessage()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Captured by White</h3>
          <div className="flex flex-wrap gap-1 min-h-10">
            {capturedPieces.black.map((piece, index) => (
              <div key={index} className="w-6 h-6">
                <PieceIcon piece={piece} />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Captured by Black</h3>
          <div className="flex flex-wrap gap-1 min-h-10">
            {capturedPieces.white.map((piece, index) => (
              <div key={index} className="w-6 h-6">
                <PieceIcon piece={piece} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Move History</h3>
        <div className="bg-gray-50 p-3 rounded-md h-48 overflow-y-auto">
          {moveHistory.length === 0 ? (
            <p className="text-gray-500 italic">No moves yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {moveHistory.map((move, index) => (
                <div key={index} className={index % 2 === 0 ? "col-start-1" : "col-start-2"}>
                  <span className="font-mono">{Math.floor(index / 2) + 1}{index % 2 === 0 ? "." : "..."} {move}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};