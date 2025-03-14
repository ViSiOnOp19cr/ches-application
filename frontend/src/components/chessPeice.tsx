import React from 'react';

// Define ChessPieceType type for better type safety
type ChessColor = 'w' | 'b';
type ChessPieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k' | 'P' | 'R' | 'N' | 'B' | 'Q' | 'K';
type PieceKey = 'wP' | 'wR' | 'wN' | 'wB' | 'wQ' | 'wK' | 'bP' | 'bR' | 'bN' | 'bB' | 'bQ' | 'bK';

// Define the piece data structure type
interface PieceData {
  viewBox: string;
  d: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
  strokeLinecap: string;
  strokeLinejoin?: string;
  path2?: string;
  path3?: string;
  path4?: string;
  path5?: string;
  stroke2?: string;
  strokeWidth2?: string;
}

// SVG path data for chess pieces
const piecePaths: Record<PieceKey, PieceData> = {
  // WHITE PIECES
  'wP': { // White Pawn
    viewBox: '0 0 45 45',
    d: 'M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z',
    fill: '#fff',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: "round"
  },
  'wR': { // White Rook
    viewBox: '0 0 45 45',
    d: 'M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-22V9h4v2h5V9h5v2h5V9h4v5',
    fill: '#fff',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    path2: 'M34 14l-3 3H14l-3-3',
    path3: 'M31 17v12.5H14V17',
    path4: 'M31 29.5l1.5 2.5h-20l1.5-2.5',
    path5: 'M11 14h23'
  },
  'wN': { // White Knight
    viewBox: '0 0 45 45',
    d: 'M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21',
    fill: '#fff',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    path2: 'M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3',
    path3: 'M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z',
    path4: 'M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z'
  },
  'wB': { // White Bishop
    viewBox: '0 0 45 45',
    d: 'M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zm6-4c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z',
    fill: '#fff',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    path2: 'M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5'
  },
  'wQ': { // White Queen
    viewBox: '0 0 45 45',
    d: 'M8 12a2 2 0 1 1 4 0 2 2 0 1 1-4 0zm16.5-4.5a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM41 12a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM16 8.5a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM33 9a2 2 0 1 1 4 0 2 2 0 1 1-4 0z',
    fill: '#fff',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    path2: 'M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z',
    path3: 'M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z',
    path4: 'M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0'
  },
  'wK': { // White King
    viewBox: '0 0 45 45',
    d: 'M22.5 11.63V6M20 8h5',
    fill: '#fff',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    path2: 'M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5',
    path3: 'M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z',
    path4: 'M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0'
  },
  
  // BLACK PIECES
  'bP': { // Black Pawn
    viewBox: '0 0 45 45',
    d: 'M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z',
    fill: '#000',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round'
  },
  'bR': { // Black Rook
    viewBox: '0 0 45 45',
    d: 'M9 39h27v-3H9v3zm3.5-7l1.5-2.5h17l1.5 2.5h-20zm-.5 4v-4h21v4H12z',
    fill: '#000',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    path2: 'M14 29.5v-13h17v13H14z',
    path3: 'M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z',
    path4: 'M12 35.5h21',
    stroke2: '#fff',
    strokeWidth2: '1.5',
    strokeLinejoin: 'round'
  },
  'bN': { // Black Knight
    viewBox: '0 0 45 45',
    d: 'M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21',
    fill: '#000',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    path2: 'M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3',
    path3: 'M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z',
    path4: 'M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z',
    stroke2: '#fff',
    strokeWidth2: '1.5',
    strokeLinejoin: 'round'
  },
  'bB': { // Black Bishop
    viewBox: '0 0 45 45',
    d: 'M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zm6-4c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z',
    fill: '#000',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    path2: 'M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5',
    stroke2: '#fff',
    strokeWidth2: '1.5'
  },
  'bQ': { // Black Queen
    viewBox: '0 0 45 45',
    d: 'M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z',
    fill: '#000',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    path2: 'M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z',
    path3: 'M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0',
    stroke2: '#fff',
    strokeWidth2: '1.5'
  },
  'bK': { // Black King
    viewBox: '0 0 45 45',
    d: 'M22.5 11.63V6M20 8h5',
    fill: '#000',
    stroke: '#000',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    path2: 'M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5',
    path3: 'M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z',
    path4: 'M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0',
    stroke2: '#fff',
    strokeWidth2: '1.5'
  }
};

// Map piece type and color to SVG key with type safety
const getPieceKey = (pieceType: ChessPieceType, pieceColor: ChessColor): PieceKey => {
  const color = pieceColor === 'w' ? 'w' : 'b';
  
  // Convert to uppercase for consistency
  let type = pieceType.toUpperCase() as 'P' | 'R' | 'N' | 'B' | 'Q' | 'K';
  
  // Create the key with proper typing
  return `${color}${type}` as PieceKey;
};

export interface ChessPieceProps {
  type: ChessPieceType;
  color: ChessColor;
  size?: number;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({ type, color, size = 45 }) => {
  // Get the appropriate piece data
  const pieceKey = getPieceKey(type, color);
  const pieceData = piecePaths[pieceKey];
  
  if (!pieceData) {
    console.error(`No SVG data for piece: ${pieceKey} (type: ${type}, color: ${color})`);
    return null;
  }

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={pieceData.viewBox} 
      style={{ display: 'block' }}
    >
      {/* Main path */}
      <path
        d={pieceData.d}
        fill={pieceData.fill}
        stroke={pieceData.stroke}
        strokeWidth={pieceData.strokeWidth}
        strokeLinecap="round"

      />
      
      {/* Additional paths if they exist */}
      {pieceData.path2 && (
        <path
          d={pieceData.path2}
          fill="none"
          stroke={pieceData.stroke2 || pieceData.stroke}
          strokeWidth={pieceData.strokeWidth2 || pieceData.strokeWidth}
          strokeLinecap={pieceData.strokeLinecap}
          strokeLinejoin={pieceData.strokeLinejoin}
        />
      )}
      
      {pieceData.path3 && (
        <path
          d={pieceData.path3}
          fill="none"
          stroke={pieceData.stroke2 || pieceData.stroke}
          strokeWidth={pieceData.strokeWidth2 || pieceData.strokeWidth}
          strokeLinecap={pieceData.strokeLinecap}
        />
      )}
      
      {pieceData.path4 && (
        <path
          d={pieceData.path4}
          fill="none"
          stroke={pieceData.stroke2 || pieceData.stroke}
          strokeWidth={pieceData.strokeWidth2 || pieceData.strokeWidth}
          strokeLinecap={pieceData.strokeLinecap}
        />
      )}
      
      {pieceData.path5 && (
        <path
          d={pieceData.path5}
          fill="none"
          stroke={pieceData.stroke2 || pieceData.stroke}
          strokeWidth={pieceData.strokeWidth2 || pieceData.strokeWidth}
          strokeLinecap={pieceData.strokeLinecap || 'round'} 
        />
      )}
    </svg>
  );
};

export default ChessPiece;