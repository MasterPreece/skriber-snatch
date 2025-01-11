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
  speed: number;
}

export interface Score {
  alias: string;
  score: number;
  date: string;
}