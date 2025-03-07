import { Chess,  PieceSymbol, Square } from 'chess.js';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export class ChessAI {
  private chess: Chess;
  private difficulty: DifficultyLevel;
  
  constructor(chess: Chess, difficulty: DifficultyLevel = 'medium') {
    this.chess = chess;
    this.difficulty = difficulty;
  }
  
  setDifficulty(difficulty: DifficultyLevel): void {
    this.difficulty = difficulty;
  }
  
  makeMove(): { from: string; to: string; promotion?: string } | null {
    switch (this.difficulty) {
      case 'easy':
        return this.makeRandomMove();
      case 'medium':
        return this.makeMediumMove();
      case 'hard':
        return this.makeHardMove();
      default:
        return this.makeRandomMove();
    }
  }
  
  private makeRandomMove(): { from: string; to: string; promotion?: string } | null {
    const moves = this.chess.moves({ verbose: true });
    if (moves.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * moves.length);
    const move = moves[randomIndex];
    
    return {
      from: move.from,
      to: move.to,
      promotion: move.promotion
    };
  }

  private makeMediumMove(): { from: string; to: string; promotion?: string } | null {
    const moves = this.chess.moves({ verbose: true });
    if (moves.length === 0) return null;
    
    const pieceValues: Record<PieceSymbol, number> = {
      p: 1,   
      n: 3,   
      b: 3,  
      r: 5,   
      q: 9,   
      k: 0    
    };
    
    const scoredMoves = moves.map(move => {
      let score = 0;

      if (move.captured) {
        score += pieceValues[move.captured] * 10;
      }
      
      if (move.promotion) {
        score += pieceValues[move.promotion] * 5;
      }
      
      if (move.san.includes('+')) {
        score += 5; 
      }
      if (move.san.includes('#')) {
        score += 100; 
      }
      
      score += Math.random() * 3;
      
      return { move, score };
    });
    

    scoredMoves.sort((a, b) => b.score - a.score);
    
    let selectedMove;
    if (Math.random() < 0.7 && scoredMoves.length >= 3) {
      const topIndex = Math.floor(Math.random() * 3);
      selectedMove = scoredMoves[topIndex].move;
    } else {
      const randomIndex = Math.floor(Math.random() * scoredMoves.length);
      selectedMove = scoredMoves[randomIndex].move;
    }
    
    return {
      from: selectedMove.from,
      to: selectedMove.to,
      promotion: selectedMove.promotion
    };
  }
  
  private makeHardMove(): { from: string; to: string; promotion?: string } | null {
    const MAX_DEPTH = 2; 

    const minimax = (depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean): number => {
      if (depth === 0) {
        return this.evaluatePosition();
      }
      
      const moves = this.chess.moves({ verbose: true });
      
      if (moves.length === 0) {

        if (this.chess.isCheck()) {

          return isMaximizingPlayer ? -Infinity : Infinity;
        }

        return 0;
      }
      
      let bestScore = isMaximizingPlayer ? -Infinity : Infinity;
      
      for (const move of moves) {
        this.chess.move(move);
        
        const score = minimax(depth - 1, alpha, beta, !isMaximizingPlayer);
        
        this.chess.undo();
        
        if (isMaximizingPlayer) {
          bestScore = Math.max(bestScore, score);
          alpha = Math.max(alpha, bestScore);
        } else {
          bestScore = Math.min(bestScore, score);
          beta = Math.min(beta, bestScore);
        }
        
        if (beta <= alpha) {
          break;
        }
      }
      
      return bestScore;
    };
    
    const moves = this.chess.moves({ verbose: true });
    if (moves.length === 0) return null;
    
    let bestMove = null;
    let bestScore = -Infinity;
    
    for (const move of moves) {
      this.chess.move(move);
      
      const score = minimax(MAX_DEPTH - 1, -Infinity, Infinity, false);
      
      this.chess.undo();
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    if (bestMove) {
      return {
        from: bestMove.from,
        to: bestMove.to,
        promotion: bestMove.promotion
      };
    }
    
    return this.makeMediumMove();
  }
  
  private evaluatePosition(): number {
    let score = 0;
    
    const pieceValues: Record<PieceSymbol, number> = {
      p: 100,   
      n: 320,   
      b: 330,   
      r: 500,   
      q: 900,   
      k: 20000  
    };
    
    const mobilityValues: Record<PieceSymbol, number> = {
      p: 2,
      n: 5,
      b: 5,
      r: 3,
      q: 3,
      k: 0
    };
    
    const pawnTable = [
      0,  0,  0,  0,  0,  0,  0,  0,
      50, 50, 50, 50, 50, 50, 50, 50,
      10, 10, 20, 30, 30, 20, 10, 10,
      5,  5, 10, 25, 25, 10,  5,  5,
      0,  0,  0, 20, 20,  0,  0,  0,
      5, -5,-10,  0,  0,-10, -5,  5,
      5, 10, 10,-20,-20, 10, 10,  5,
      0,  0,  0,  0,  0,  0,  0,  0
    ];
    
    const knightTable = [
      -50,-40,-30,-30,-30,-30,-40,-50,
      -40,-20,  0,  0,  0,  0,-20,-40,
      -30,  0, 10, 15, 15, 10,  0,-30,
      -30,  5, 15, 20, 20, 15,  5,-30,
      -30,  0, 15, 20, 20, 15,  0,-30,
      -30,  5, 10, 15, 15, 10,  5,-30,
      -40,-20,  0,  5,  5,  0,-20,-40,
      -50,-40,-30,-30,-30,-30,-40,-50
    ];
    
    const bishopTable = [
      -20,-10,-10,-10,-10,-10,-10,-20,
      -10,  0,  0,  0,  0,  0,  0,-10,
      -10,  0, 10, 10, 10, 10,  0,-10,
      -10,  5,  5, 10, 10,  5,  5,-10,
      -10,  0,  5, 10, 10,  5,  0,-10,
      -10,  5,  5,  5,  5,  5,  5,-10,
      -10,  0,  5,  0,  0,  5,  0,-10,
      -20,-10,-10,-10,-10,-10,-10,-20
    ];
    
    const rookTable = [
       0,  0,  0,  0,  0,  0,  0,  0,
       5, 10, 10, 10, 10, 10, 10,  5,
      -5,  0,  0,  0,  0,  0,  0, -5,
      -5,  0,  0,  0,  0,  0,  0, -5,
      -5,  0,  0,  0,  0,  0,  0, -5,
      -5,  0,  0,  0,  0,  0,  0, -5,
      -5,  0,  0,  0,  0,  0,  0, -5,
       0,  0,  0,  5,  5,  0,  0,  0
    ];
    
    const queenTable = [
      -20,-10,-10, -5, -5,-10,-10,-20,
      -10,  0,  0,  0,  0,  0,  0,-10,
      -10,  0,  5,  5,  5,  5,  0,-10,
       -5,  0,  5,  5,  5,  5,  0, -5,
        0,  0,  5,  5,  5,  5,  0, -5,
      -10,  5,  5,  5,  5,  5,  0,-10,
      -10,  0,  5,  0,  0,  0,  0,-10,
      -20,-10,-10, -5, -5,-10,-10,-20
    ];
    
    const kingTable = [
      -30,-40,-40,-50,-50,-40,-40,-30,
      -30,-40,-40,-50,-50,-40,-40,-30,
      -30,-40,-40,-50,-50,-40,-40,-30,
      -30,-40,-40,-50,-50,-40,-40,-30,
      -20,-30,-30,-40,-40,-30,-30,-20,
      -10,-20,-20,-20,-20,-20,-20,-10,
       20, 20,  0,  0,  0,  0, 20, 20,
       20, 30, 10,  0,  0, 10, 30, 20
    ];
    
    const pieceSquareTables: Record<PieceSymbol, number[]> = {
      p: pawnTable,
      n: knightTable,
      b: bishopTable,
      r: rookTable,
      q: queenTable,
      k: kingTable
    };
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = String.fromCharCode(97 + col) + (8 - row) as Square;
        const piece = this.chess.get(square);
        
        if (piece) {
          const squareIndex = row * 8 + col;
          let pieceSquareValue = 0;
          
          if (piece.color === 'w') {
            pieceSquareValue = pieceSquareTables[piece.type][squareIndex];
          } else {
            pieceSquareValue = pieceSquareTables[piece.type][63 - squareIndex];
          }
          
          const valueMultiplier = piece.color === 'w' ? 1 : -1;
          
          score += pieceValues[piece.type] * valueMultiplier;
          
          score += pieceSquareValue * valueMultiplier;

          const pseudoMobility = mobilityValues[piece.type] * 
            this.countLegalMovesForPiece(square) * valueMultiplier;
          score += pseudoMobility;
        }
      }
    }
    
    return score;
  }
  
  private countLegalMovesForPiece(square: Square): number {
    const moves = this.chess.moves({ 
      square, 
      verbose: true 
    });
    return moves.length;
  }
}