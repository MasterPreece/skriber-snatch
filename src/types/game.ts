export interface Position {
  x: number;
  y: number;
}

export interface LetterState {
  char: string;
  position: Position;
  collected: boolean;
}

export interface BadDotState {
  position: Position;
}

export interface Score {
  alias: string;
  score: number;
  date: string;
}