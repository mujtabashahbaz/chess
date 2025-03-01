export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export type Position = {
  row: number;
  col: number;
};

export type ChessBoard = (ChessPiece | null)[][];

export type GameState = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';

export type MoveResult = {
  valid: boolean;
  newBoard?: ChessBoard;
  capturedPiece?: ChessPiece;
  check?: boolean;
  checkmate?: boolean;
  stalemate?: boolean;
  notation?: string;
};