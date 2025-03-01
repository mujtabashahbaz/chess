import React from 'react';
import { ChessPiece } from '../types/chess';
import { Crown, Castle, ChevronRight as ChessKnight, CopyCheck as ChessBishop, Parentheses as ChessQueen, Check as ChessKing } from 'lucide-react';

interface PieceIconProps {
  piece: ChessPiece;
}

export const PieceIcon: React.FC<PieceIconProps> = ({ piece }) => {
  const { type, color } = piece;
  const pieceColor = color === 'white' ? 'text-white stroke-black' : 'text-black stroke-white';
  const size = 36;
  const strokeWidth = 1.5;

  const renderIcon = () => {
    switch (type) {
      case 'pawn':
        return <Crown size={size} strokeWidth={strokeWidth} className={pieceColor} />;
      case 'rook':
        return <Castle size={size} strokeWidth={strokeWidth} className={pieceColor} />;
      case 'knight':
        return <ChessKnight size={size} strokeWidth={strokeWidth} className={pieceColor} />;
      case 'bishop':
        return <ChessBishop size={size} strokeWidth={strokeWidth} className={pieceColor} />;
      case 'queen':
        return <ChessQueen size={size} strokeWidth={strokeWidth} className={pieceColor} />;
      case 'king':
        return <ChessKing size={size} strokeWidth={strokeWidth} className={pieceColor} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {renderIcon()}
    </div>
  );
};