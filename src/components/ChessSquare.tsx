import React from 'react';
import { ChessPiece } from '../types/chess';
import { PieceIcon } from './PieceIcon';

interface ChessSquareProps {
  row: number;
  col: number;
  piece: ChessPiece | null;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
}

export const ChessSquare: React.FC<ChessSquareProps> = ({
  row,
  col,
  piece,
  isSelected,
  isValidMove,
  onClick
}) => {
  const isLightSquare = (row + col) % 2 === 0;
  const squareColor = isLightSquare ? 'bg-amber-100' : 'bg-amber-800';
  
  let squareClasses = `w-full h-full flex items-center justify-center ${squareColor}`;
  
  if (isSelected) {
    squareClasses += ' ring-4 ring-blue-500 ring-inset';
  } else if (isValidMove) {
    squareClasses += ' relative';
  }

  // Get the algebraic notation for the square (e.g., "a1", "e4")
  const file = String.fromCharCode(97 + col); // 'a' to 'h'
  const rank = 8 - row; // 1 to 8
  
  return (
    <div className={squareClasses} onClick={onClick}>
      {piece && <PieceIcon piece={piece} />}
      
      {isValidMove && !piece && (
        <div className="absolute w-3 h-3 rounded-full bg-blue-500 opacity-70"></div>
      )}
      
      {isValidMove && piece && (
        <div className="absolute inset-0 ring-4 ring-blue-500 ring-inset opacity-70"></div>
      )}
      
      {/* Square coordinates (only shown on the edges) */}
      {col === 0 && (
        <span className="absolute left-1 top-0 text-xs font-semibold" style={{ color: isLightSquare ? '#78350f' : '#fef3c7' }}>
          {rank}
        </span>
      )}
      
      {row === 7 && (
        <span className="absolute right-1 bottom-0 text-xs font-semibold" style={{ color: isLightSquare ? '#78350f' : '#fef3c7' }}>
          {file}
        </span>
      )}
    </div>
  );
};