import { ChessBoard, ChessPiece, Position, PieceType, MoveResult } from '../types/chess';

// Create the initial chess board
export const initialBoard = (): ChessBoard => {
  const board: ChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));

  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }

  // Set up rooks
  board[0][0] = { type: 'rook', color: 'black' };
  board[0][7] = { type: 'rook', color: 'black' };
  board[7][0] = { type: 'rook', color: 'white' };
  board[7][7] = { type: 'rook', color: 'white' };

  // Set up knights
  board[0][1] = { type: 'knight', color: 'black' };
  board[0][6] = { type: 'knight', color: 'black' };
  board[7][1] = { type: 'knight', color: 'white' };
  board[7][6] = { type: 'knight', color: 'white' };

  // Set up bishops
  board[0][2] = { type: 'bishop', color: 'black' };
  board[0][5] = { type: 'bishop', color: 'black' };
  board[7][2] = { type: 'bishop', color: 'white' };
  board[7][5] = { type: 'bishop', color: 'white' };

  // Set up queens
  board[0][3] = { type: 'queen', color: 'black' };
  board[7][3] = { type: 'queen', color: 'white' };

  // Set up kings
  board[0][4] = { type: 'king', color: 'black' };
  board[7][4] = { type: 'king', color: 'white' };

  return board;
};

// Clone the board to avoid direct mutations
export const cloneBoard = (board: ChessBoard): ChessBoard => {
  return board.map(row => [...row]);
};

// Check if a position is within the board boundaries
export const isValidPosition = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
};

// Get all valid moves for a piece
export const getValidMoves = (
  board: ChessBoard,
  position: Position,
  currentPlayer: 'white' | 'black'
): Position[] => {
  const piece = board[position.row][position.col];
  
  if (!piece || piece.color !== currentPlayer) {
    return [];
  }

  let potentialMoves: Position[] = [];

  switch (piece.type) {
    case 'pawn':
      potentialMoves = getPawnMoves(board, position);
      break;
    case 'rook':
      potentialMoves = getRookMoves(board, position);
      break;
    case 'knight':
      potentialMoves = getKnightMoves(board, position);
      break;
    case 'bishop':
      potentialMoves = getBishopMoves(board, position);
      break;
    case 'queen':
      potentialMoves = getQueenMoves(board, position);
      break;
    case 'king':
      potentialMoves = getKingMoves(board, position);
      break;
  }

  // Filter out moves that would put or leave the king in check
  return potentialMoves.filter(move => {
    const newBoard = cloneBoard(board);
    newBoard[move.row][move.col] = newBoard[position.row][position.col];
    newBoard[position.row][position.col] = null;
    return !isKingInCheck(newBoard, currentPlayer);
  });
};

// Get all valid moves for a pawn
const getPawnMoves = (board: ChessBoard, position: Position): Position[] => {
  const { row, col } = position;
  const piece = board[row][col];
  
  if (!piece || piece.type !== 'pawn') {
    return [];
  }

  const moves: Position[] = [];
  const direction = piece.color === 'white' ? -1 : 1;
  const startingRow = piece.color === 'white' ? 6 : 1;

  // Move forward one square
  const oneForward = { row: row + direction, col };
  if (isValidPosition(oneForward) && !board[oneForward.row][oneForward.col]) {
    moves.push(oneForward);

    // Move forward two squares from starting position
    if (row === startingRow) {
      const twoForward = { row: row + 2 * direction, col };
      if (!board[twoForward.row][twoForward.col]) {
        moves.push(twoForward);
      }
    }
  }

  // Capture diagonally
  const captureLeft = { row: row + direction, col: col - 1 };
  const captureRight = { row: row + direction, col: col + 1 };

  if (
    isValidPosition(captureLeft) &&
    board[captureLeft.row][captureLeft.col] &&
    board[captureLeft.row][captureLeft.col]!.color !== piece.color
  ) {
    moves.push(captureLeft);
  }

  if (
    isValidPosition(captureRight) &&
    board[captureRight.row][captureRight.col] &&
    board[captureRight.row][captureRight.col]!.color !== piece.color
  ) {
    moves.push(captureRight);
  }

  // TODO: En passant and promotion

  return moves;
};

// Get all valid moves for a rook
const getRookMoves = (board: ChessBoard, position: Position): Position[] => {
  const { row, col } = position;
  const piece = board[row][col];
  
  if (!piece) {
    return [];
  }

  const moves: Position[] = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];

  for (const dir of directions) {
    let currentRow = row + dir.row;
    let currentCol = col + dir.col;

    while (isValidPosition({ row: currentRow, col: currentCol })) {
      const currentPiece = board[currentRow][currentCol];

      if (!currentPiece) {
        // Empty square, can move here
        moves.push({ row: currentRow, col: currentCol });
      } else if (currentPiece.color !== piece.color) {
        // Enemy piece, can capture and then stop
        moves.push({ row: currentRow, col: currentCol });
        break;
      } else {
        // Friendly piece, stop
        break;
      }

      currentRow += dir.row;
      currentCol += dir.col;
    }
  }

  return moves;
};

// Get all valid moves for a knight
const getKnightMoves = (board: ChessBoard, position: Position): Position[] => {
  const { row, col } = position;
  const piece = board[row][col];
  
  if (!piece) {
    return [];
  }

  const moves: Position[] = [];
  const knightMoves = [
    { row: row - 2, col: col - 1 },
    { row: row - 2, col: col + 1 },
    { row: row - 1, col: col - 2 },
    { row: row - 1, col: col + 2 },
    { row: row + 1, col: col - 2 },
    { row: row + 1, col: col + 2 },
    { row: row + 2, col: col - 1 },
    { row: row + 2, col: col + 1 }
  ];

  for (const move of knightMoves) {
    if (isValidPosition(move)) {
      const targetPiece = board[move.row][move.col];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(move);
      }
    }
  }

  return moves;
};

// Get all valid moves for a bishop
const getBishopMoves = (board: ChessBoard, position: Position): Position[] => {
  const { row, col } = position;
  const piece = board[row][col];
  
  if (!piece) {
    return [];
  }

  const moves: Position[] = [];
  const directions = [
    { row: -1, col: -1 }, // up-left
    { row: -1, col: 1 },  // up-right
    { row: 1, col: -1 },  // down-left
    { row: 1, col: 1 }    // down-right
  ];

  for (const dir of directions) {
    let currentRow = row + dir.row;
    let currentCol = col + dir.col;

    while (isValidPosition({ row: currentRow, col: currentCol })) {
      const currentPiece = board[currentRow][currentCol];

      if (!currentPiece) {
        // Empty square, can move here
        moves.push({ row: currentRow, col: currentCol });
      } else if (currentPiece.color !== piece.color) {
        // Enemy piece, can capture and then stop
        moves.push({ row: currentRow, col: currentCol });
        break;
      } else {
        // Friendly piece, stop
        break;
      }

      currentRow += dir.row;
      currentCol += dir.col;
    }
  }

  return moves;
};

// Get all valid moves for a queen (combination of rook and bishop)
const getQueenMoves = (board: ChessBoard, position: Position): Position[] => {
  return [
    ...getRookMoves(board, position),
    ...getBishopMoves(board, position)
  ];
};

// Get all valid moves for a king
const getKingMoves = (board: ChessBoard, position: Position): Position[] => {
  const { row, col } = position;
  const piece = board[row][col];
  
  if (!piece) {
    return [];
  }

  const moves: Position[] = [];
  const kingMoves = [
    { row: row - 1, col: col - 1 },
    { row: row - 1, col: col },
    { row: row - 1, col: col + 1 },
    { row: row, col: col - 1 },
    { row: row, col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row + 1, col: col },
    { row: row + 1, col: col + 1 }
  ];

  for (const move of kingMoves) {
    if (isValidPosition(move)) {
      const targetPiece = board[move.row][move.col];
      if (!targetPiece || targetPiece.color !== piece.color) {
        // Check if this move would put the king in check
        const newBoard = cloneBoard(board);
        newBoard[move.row][move.col] = newBoard[row][col];
        newBoard[row][col] = null;
        
        if (!isSquareUnderAttack(newBoard, move, piece.color === 'white' ? 'black' : 'white')) {
          moves.push(move);
        }
      }
    }
  }

  // TODO: Castling

  return moves;
};

// Check if a square is under attack by the opponent
export const isSquareUnderAttack = (
  board: ChessBoard,
  position: Position,
  attackerColor: 'white' | 'black'
): boolean => {
  // Check for pawn attacks
  const pawnDirection = attackerColor === 'white' ? -1 : 1;
  const pawnAttacks = [
    { row: position.row + pawnDirection, col: position.col - 1 },
    { row: position.row + pawnDirection, col: position.col + 1 }
  ];

  for (const attack of pawnAttacks) {
    if (isValidPosition(attack)) {
      const piece = board[attack.row][attack.col];
      if (piece && piece.type === 'pawn' && piece.color === attackerColor) {
        return true;
      }
    }
  }

  // Check for knight attacks
  const knightMoves = [
    { row: position.row - 2, col: position.col - 1 },
    { row: position.row - 2, col: position.col + 1 },
    { row: position.row - 1, col: position.col - 2 },
    { row: position.row - 1, col: position.col + 2 },
    { row: position.row + 1, col: position.col - 2 },
    { row: position.row + 1, col: position.col + 2 },
    { row: position.row + 2, col: position.col - 1 },
    { row: position.row + 2, col: position.col + 1 }
  ];

  for (const move of knightMoves) {
    if (isValidPosition(move)) {
      const piece = board[move.row][move.col];
      if (piece && piece.type === 'knight' && piece.color === attackerColor) {
        return true;
      }
    }
  }

  // Check for king attacks (for adjacent squares)
  const kingMoves = [
    { row: position.row - 1, col: position.col - 1 },
    { row: position.row - 1, col: position.col },
    { row: position.row - 1, col: position.col + 1 },
    { row: position.row, col: position.col - 1 },
    { row: position.row, col: position.col + 1 },
    { row: position.row + 1, col: position.col - 1 },
    { row: position.row + 1, col: position.col },
    { row: position.row + 1, col: position.col + 1 }
  ];

  for (const move of kingMoves) {
    if (isValidPosition(move)) {
      const piece = board[move.row][move.col];
      if (piece && piece.type === 'king' && piece.color === attackerColor) {
        return true;
      }
    }
  }

  // Check for attacks along ranks, files, and diagonals (queen, rook, bishop)
  const directions = [
    { row: -1, col: 0 },  // up
    { row: 1, col: 0 },   // down
    { row: 0, col: -1 },  // left
    { row: 0, col: 1 },   // right
    { row: -1, col: -1 }, // up-left
    { row: -1, col: 1 },  // up-right
    { row: 1, col: -1 },  // down-left
    { row: 1, col: 1 }    // down-right
  ];

  for (const dir of directions) {
    let currentRow = position.row + dir.row;
    let currentCol = position.col + dir.col;

    while (isValidPosition({ row: currentRow, col: currentCol })) {
      const piece = board[currentRow][currentCol];

      if (piece) {
        if (piece.color === attackerColor) {
          const isDiagonal = dir.row !== 0 && dir.col !== 0;
          const isOrthogonal = dir.row === 0 || dir.col === 0;

          if (
            (isDiagonal && (piece.type === 'bishop' || piece.type === 'queen')) ||
            (isOrthogonal && (piece.type === 'rook' || piece.type === 'queen'))
          ) {
            return true;
          }
        }
        // Any piece (friend or foe) blocks the line of attack
        break;
      }

      currentRow += dir.row;
      currentCol += dir.col;
    }
  }

  return false;
};

// Find the king's position
export const findKing = (board: ChessBoard, color: 'white' | 'black'): Position | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};

// Check if the king is in check
export const isKingInCheck = (board: ChessBoard, color: 'white' | 'black'): boolean => {
  const kingPosition = findKing(board, color);
  if (!kingPosition) return false;

  return isSquareUnderAttack(board, kingPosition, color === 'white' ? 'black' : 'white');
};

// Make a move on the board
export const makeMove = (
  board: ChessBoard,
  from: Position,
  to: Position
): MoveResult => {
  const piece = board[from.row][from.col];
  
  if (!piece) {
    return { valid: false };
  }

  const newBoard = cloneBoard(board);
  const capturedPiece = newBoard[to.row][to.col];
  
  // Move the piece
  newBoard[to.row][to.col] = { ...piece, hasMoved: true };
  newBoard[from.row][from.col] = null;

  // Check for pawn promotion (simplified - always promotes to queen)
  if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
    newBoard[to.row][to.col] = { type: 'queen', color: piece.color };
  }

  // Generate chess notation
  const notation = generateMoveNotation(board, from, to, piece, capturedPiece);

  return {
    valid: true,
    newBoard,
    capturedPiece: capturedPiece || undefined,
    notation
  };
};

// Check if the current player is in check
export const isCheck = (board: ChessBoard, currentPlayer: 'white' | 'black'): boolean => {
  return isKingInCheck(board, currentPlayer);
};

// Check if the current player is in checkmate
export const isCheckmate = (board: ChessBoard, currentPlayer: 'white' | 'black'): boolean => {
  // If the king is not in check, it's not checkmate
  if (!isKingInCheck(board, currentPlayer)) {
    return false;
  }

  // Check if any move can get the king out of check
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        const moves = getValidMoves(board, { row, col }, currentPlayer);
        if (moves.length > 0) {
          return false; // There's at least one legal move
        }
      }
    }
  }

  // No legal moves and king is in check = checkmate
  return true;
};

// Check if the current player is in stalemate
export const isStalemate = (board: ChessBoard, currentPlayer: 'white' | 'black'): boolean => {
  // If the king is in check, it's not stalemate
  if (isKingInCheck(board, currentPlayer)) {
    return false;
  }

  // Check if any piece can make a legal move
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        const moves = getValidMoves(board, { row, col }, currentPlayer);
        if (moves.length > 0) {
          return false; // There's at least one legal move
        }
      }
    }
  }

  // No legal moves and king is not in check = stalemate
  return true;
};

// Get the notation for a piece
export const getPieceNotation = (piece: ChessPiece): string => {
  if (piece.type === 'pawn') return '';
  
  const notations: Record<PieceType, string> = {
    pawn: '',
    rook: 'R',
    knight: 'N',
    bishop: 'B',
    queen: 'Q',
    king: 'K'
  };
  
  return notations[piece.type];
};

// Generate chess notation for a move
export const generateMoveNotation = (
  board: ChessBoard,
  from: Position,
  to: Position,
  piece: ChessPiece,
  capturedPiece: ChessPiece | null
): string => {
  const pieceSymbol = getPieceNotation(piece);
  const files = 'abcdefgh';
  const fromFile = files[from.col];
  const fromRank = 8 - from.row;
  const toFile = files[to.col];
  const toRank = 8 - to.row;
  
  let notation = pieceSymbol;
  
  // Add from position for disambiguation if needed
  // (simplified - always add file for non-pawns)
  if (piece.type !== 'pawn') {
    notation += fromFile;
  }
  
  // Add capture symbol
  if (capturedPiece) {
    // For pawns, include the file they moved from when capturing
    if (piece.type === 'pawn') {
      notation += fromFile;
    }
    notation += 'x';
  }
  
  // Add destination
  notation += toFile + toRank;
  
  // Add promotion (simplified)
  if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
    notation += '=Q';
  }
  
  // Check for check or checkmate (simplified)
  const newBoard = cloneBoard(board);
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  
  const opponentColor = piece.color === 'white' ? 'black' : 'white';
  if (isKingInCheck(newBoard, opponentColor)) {
    if (isCheckmate(newBoard, opponentColor)) {
      notation += '#';
    } else {
      notation += '+';
    }
  }
  
  return notation;
};