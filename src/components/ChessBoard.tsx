import React, { useEffect } from 'react';
import { ChessSquare } from './ChessSquare';
import { ChessBoard as ChessBoardType, Position, ChessPiece, GameState } from '../types/chess';
import { getValidMoves, makeMove, isCheck, isCheckmate, isStalemate, getPieceNotation } from '../utils/chessUtils';

interface ChessBoardProps {
  board: ChessBoardType;
  selectedPiece: Position | null;
  validMoves: Position[];
  setSelectedPiece: React.Dispatch<React.SetStateAction<Position | null>>;
  setValidMoves: React.Dispatch<React.SetStateAction<Position[]>>;
  setBoard: React.Dispatch<React.SetStateAction<ChessBoardType>>;
  currentPlayer: 'white' | 'black';
  setCurrentPlayer: React.Dispatch<React.SetStateAction<'white' | 'black'>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setMoveHistory: React.Dispatch<React.SetStateAction<string[]>>;
  setCapturedPieces: React.Dispatch<React.SetStateAction<{
    white: ChessPiece[];
    black: ChessPiece[];
  }>>;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  selectedPiece,
  validMoves,
  setSelectedPiece,
  setValidMoves,
  setBoard,
  currentPlayer,
  setCurrentPlayer,
  gameState,
  setGameState,
  setMoveHistory,
  setCapturedPieces
}) => {
  // Check for checkmate or stalemate after each move
  useEffect(() => {
    if (gameState !== 'playing') return;

    const checkStatus = isCheck(board, currentPlayer);
    if (checkStatus) {
      if (isCheckmate(board, currentPlayer)) {
        setGameState('checkmate');
      } else {
        setGameState('check');
      }
    } else if (isStalemate(board, currentPlayer)) {
      setGameState('stalemate');
    } else {
      setGameState('playing');
    }
  }, [board, currentPlayer]);

  const handleSquareClick = (row: number, col: number) => {
    if (gameState === 'checkmate' || gameState === 'stalemate' || gameState === 'draw') {
      return;
    }

    const piece = board[row][col];

    // If no piece is selected and the clicked square has a piece of the current player's color
    if (!selectedPiece && piece && piece.color === currentPlayer) {
      setSelectedPiece({ row, col });
      const moves = getValidMoves(board, { row, col }, currentPlayer);
      setValidMoves(moves);
      return;
    }

    // If a piece is already selected
    if (selectedPiece) {
      // If clicking on the same piece, deselect it
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        setValidMoves([]);
        return;
      }

      // If clicking on another piece of the same color, select that piece instead
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece({ row, col });
        const moves = getValidMoves(board, { row, col }, currentPlayer);
        setValidMoves(moves);
        return;
      }

      // Check if the move is valid
      const isValidMove = validMoves.some(move => move.row === row && move.col === col);
      
      if (isValidMove) {
        const result = makeMove(board, selectedPiece, { row, col });
        
        if (result.valid && result.newBoard) {
          // Update the board
          setBoard(result.newBoard);
          
          // Add move to history
          if (result.notation) {
            setMoveHistory(prev => [...prev, result.notation!]);
          }
          
          // Add captured piece to the list if any
          if (result.capturedPiece) {
            setCapturedPieces(prev => ({
              ...prev,
              [result.capturedPiece!.color]: [
                ...prev[result.capturedPiece!.color],
                result.capturedPiece!
              ]
            }));
          }
          
          // Switch player
          setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        }
        
        // Reset selection
        setSelectedPiece(null);
        setValidMoves([]);
      }
    }
  };

  // Generate the board squares
  const renderBoard = () => {
    const squares = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isSelected = selectedPiece?.row === row && selectedPiece?.col === col;
        const isValidMove = validMoves.some(move => move.row === row && move.col === col);
        
        squares.push(
          <ChessSquare
            key={`${row}-${col}`}
            row={row}
            col={col}
            piece={board[row][col]}
            isSelected={isSelected}
            isValidMove={isValidMove}
            onClick={() => handleSquareClick(row, col)}
          />
        );
      }
    }
    
    return squares;
  };

  return (
    <div className="grid grid-cols-8 border-2 border-gray-800 shadow-lg" style={{ width: '80vmin', height: '80vmin', maxWidth: '600px', maxHeight: '600px' }}>
      {renderBoard()}
    </div>
  );
};