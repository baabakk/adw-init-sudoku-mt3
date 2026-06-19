# init-sudoku-mt3 — shared foundation

Generated deterministically by DevOps from the approved project-decomposition.

**Stack:** TypeScript (npm workspaces)
- install: `npm install`
- build: `npm run build --workspaces`
- test: `npm test --workspaces`

## Subsystems (one feature team each)
- **web-client** — Web Client: Single-page browser application that renders an interactive 9x9 Sudoku board, accepts player input, validates moves client-side, fetches puzzles from the Puzzle Service, and posts completed-game results to the Scores Service.
  - owns: packages/web/**
  - dependsOn: contracts
- **puzzle-service** — Puzzle Service: Stateless HTTP service that generates uniquely-solvable Sudoku puzzles at three difficulty levels and validates submitted solutions. Owns puzzle generation and solution checking only.
  - owns: packages/puzzle-service/**
  - dependsOn: contracts
- **scores-service** — Scores Service: HTTP service that records completed-game results (player name, difficulty, time-to-solve) and serves a per-difficulty top-10 leaderboard. Owns persistence of scores only.
  - owns: packages/scores-service/**
  - dependsOn: contracts

## Shared contracts
- packages/contracts: @sudoku/contracts npm package exposing PuzzleRequest, PuzzleResponse, ValidateRequest, ValidateResponse, ScoreRequest, ScoreResponse, LeaderboardResponse interfaces
