// Shared contracts package — generated from project-decomposition.
// Teams import cross-subsystem types from "@init-sudoku-mt3/contracts".

// web-client exposes/consumes api "PuzzleServiceAPI": GET /puzzle?difficulty={easy|medium|hard} -> 200 { puzzleId: string, difficulty: string, board: number[9][9] }
// web-client exposes/consumes api "PuzzleValidateAPI": POST /validate { puzzleId: string, board: number[9][9] } -> 200 { correct: boolean }
// web-client exposes/consumes api "ScoresServiceAPI": POST /scores { playerName: string, difficulty: string, timeMs: number, puzzleId: string } -> 201 { success: true }
// web-client exposes/consumes api "LeaderboardAPI": GET /leaderboard?difficulty={easy|medium|hard} -> 200 { entries: [{ playerName: string, timeMs: number, puzzleId: string }] }
// puzzle-service exposes/consumes api "PuzzleServiceAPI": GET /puzzle?difficulty={easy|medium|hard} -> 200 { puzzleId: string, difficulty: string, board: number[9][9] }
// puzzle-service exposes/consumes api "PuzzleValidateAPI": POST /validate { puzzleId: string, board: number[9][9] } -> 200 { correct: boolean }
// scores-service exposes/consumes api "ScoresServiceAPI": POST /scores { playerName: string, difficulty: string, timeMs: number, puzzleId: string } -> 201 { success: true }
// scores-service exposes/consumes api "LeaderboardAPI": GET /leaderboard?difficulty={easy|medium|hard} -> 200 { entries: [{ playerName: string, timeMs: number, puzzleId: string }] }

/** Shared contract: packages/contracts: @sudoku/contracts npm package exposing PuzzleRequest, PuzzleResponse, ValidateRequest, ValidateResponse, ScoreRequest, ScoreResponse, LeaderboardResponse interfaces (define the real shape here). */
export interface PackagesContractsSudokuContractsNpmPackageExposingPuzzleRequestPuzzleResponseValidateRequestValidateResponseScoreRequestScoreResponseLeaderboardResponseInterfaces {
  readonly _todo?: never;
}
