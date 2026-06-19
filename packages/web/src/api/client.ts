import type {
  Difficulty,
  Board,
  PuzzleResponse,
  ValidateRequest,
  ValidateResponse,
  ScoreRequest,
  ScoreResponse,
  LeaderboardResponse,
} from '../types';

const BASE = '/api';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json() as Promise<T>;
}

export const PuzzleService = {
  getPuzzle(difficulty: Difficulty): Promise<PuzzleResponse> {
    return request<PuzzleResponse>(
      `${BASE}/puzzle?difficulty=${difficulty}`
    );
  },
};

export const ValidateService = {
  validate(payload: ValidateRequest): Promise<ValidateResponse> {
    return request<ValidateResponse>(`${BASE}/validate`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const ScoresService = {
  submit(payload: ScoreRequest): Promise<ScoreResponse> {
    return request<ScoreResponse>(`${BASE}/scores`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const LeaderboardService = {
  get(difficulty: Difficulty): Promise<LeaderboardResponse> {
    return request<LeaderboardResponse>(
      `${BASE}/leaderboard?difficulty=${difficulty}`
    );
  },
};