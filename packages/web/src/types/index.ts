// Types matching the shared API contracts consumed by web-client

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Board = number[][]; // 9×9, 0 = empty

// PuzzleServiceAPI
export interface PuzzleResponse {
  puzzleId: string;
  difficulty: Difficulty;
  board: Board;
}

// PuzzleValidateAPI
export interface ValidateRequest {
  puzzleId: string;
  board: Board;
}

export interface ValidateResponse {
  correct: boolean;
}

// ScoresServiceAPI
export interface ScoreRequest {
  playerName: string;
  difficulty: Difficulty;
  timeMs: number;
  puzzleId: string;
}

export interface ScoreResponse {
  success: true;
}

// LeaderboardAPI
export interface LeaderboardEntry {
  playerName: string;
  timeMs: number;
  puzzleId: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
}