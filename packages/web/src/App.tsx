import React, { useState, useEffect, useCallback } from 'react';
import BoardComponent from './components/Cell';
import { useSudoku } from './hooks/useSudoku';
import {
  PuzzleService,
  ValidateService,
  ScoresService,
  LeaderboardService,
} from './api/client';
import type { Difficulty, LeaderboardEntry } from './types';
import './App.css';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

const App: React.FC = () => {
  const {
    board,
    initialBoard,
    difficulty,
    puzzleId,
    timeMs,
    isComplete,
    setCell,
    loadPuzzle,
    reset,
  } = useSudoku();

  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(
    new Set()
  );
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fetchPuzzle = useCallback(
    async (diff: Difficulty) => {
      setLoading(true);
      setError(null);
      setSubmitted(false);
      setShowLeaderboard(false);
      try {
        const res = await PuzzleService.getPuzzle(diff);
        loadPuzzle(res.puzzleId, res.difficulty, res.board);
      } catch (e) {
        setError('Failed to load puzzle. Please try again.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [loadPuzzle]
  );

  // Load leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await LeaderboardService.get(difficulty);
      setLeaderboard(res.entries);
      setShowLeaderboard(true);
    } catch (e) {
      console.error('Failed to load leaderboard', e);
    }
  }, [difficulty]);

  // Highlight row/col/box on cell selection
  useEffect(() => {
    if (!selectedCell) {
      setHighlightedCells(new Set());
      return;
    }
    const [sr, sc] = selectedCell.split('-').map(Number);
    const cells = new Set<string>();

    // Row & column
    for (let i = 0; i < 9; i++) {
      cells.add(`${sr}-${i}`);
      cells.add(`${i}-${sc}`);
    }

    // 3×3 box
    const boxRow = Math.floor(sr / 3) * 3;
    const boxCol = Math.floor(sc / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        cells.add(`${r}-${c}`);
      }
    }

    setHighlightedCells(cells);
  }, [selectedCell]);

  // Client-side duplicate detection
  useEffect(() => {
    const errors = new Set<string>();
    const isValidGroup = (cells: [number, number][]): boolean => {
      const seen = new Map<number, string>();
      for (const [r, c] of cells) {
        const v = board[r][c];
        if (v === 0) continue;
        if (seen.has(v)) {
          errors.add(seen.get(v)!);
          errors.add(`${r}-${c}`);
        } else {
          seen.set(v, `${r}-${c}`);
        }
      }
      return true;
    };

    // Rows
    for (let r = 0; r < 9; r++) {
      isValidGroup(
        Array.from({ length: 9 }, (_, c) => [r, c] as [number, number])
      );
    }
    // Cols
    for (let c = 0; c < 9; c++) {
      isValidGroup(
        Array.from({ length: 9 }, (_, r) => [r, c] as [number, number])
      );
    }
    // Boxes
    for (let br = 0; br < 9; br += 3) {
      for (let bc = 0; bc < 9; bc += 3) {
        isValidGroup([
          [br, bc],
          [br, bc + 1],
          [br, bc + 2],
          [br + 1, bc],
          [br + 1, bc + 1],
          [br + 1, bc + 2],
          [br + 2, bc],
          [br + 2, bc + 1],
          [br + 2, bc + 2],
        ]);
      }
    }

    setErrorCells(errors);
  }, [board]);

  // Check for completion
  useEffect(() => {
    if (!puzzleId) return;
    const flat = board.flat();
    if (flat.includes(0) || errorCells.size > 0) return;

    ValidateService.validate({ puzzleId, board })
      .then((res) => {
        if (res.correct) {
          setShowLeaderboard(true);
        }
      })
      .catch(console.error);
  }, [board, puzzleId, errorCells]);

  const handleSubmitScore = async () => {
    if (!playerName.trim() || !puzzleId || submitted) return;
    try {
      await ScoresService.submit({
        playerName: playerName.trim(),
        difficulty,
        timeMs,
        puzzleId,
      });
      setSubmitted(true);
      fetchLeaderboard();
    } catch (e) {
      console.error('Failed to submit score', e);
    }
  };

  return (
    <div className="app">
      <h1>Sudoku</h1>

      <div className="controls">
        <label>
          Difficulty:{' '}
          <select
            value={difficulty}
            onChange={(e) => fetchPuzzle(e.target.value as Difficulty)}
            disabled={loading}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => fetchPuzzle(difficulty)} disabled={loading}>
          {loading ? 'Loading…' : 'New Game'}
        </button>
        <button onClick={reset} disabled={!puzzleId}>
          Reset
        </button>
        <button onClick={fetchLeaderboard} disabled={!puzzleId}>
          Leaderboard
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {puzzleId && <div className="timer">{formatTime(timeMs)}</div>}

      <BoardComponent
        board={board}
        initialBoard={initialBoard}
        highlightedCells={highlightedCells}
        errorCells={errorCells}
        onCellChange={(row, col, val) => {
          setSelectedCell(`${row}-${col}`);
          setCell(row, col, val);
        }}
      />

      {showLeaderboard && (
        <div className="leaderboard">
          <h2>Leaderboard — {difficulty}</h2>
          {!submitted && puzzleId && (
            <div className="submit-score">
              <input
                type="text"
                placeholder="Your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={32}
              />
              <button
                onClick={handleSubmitScore}
                disabled={!playerName.trim()}
              >
                Submit Score
              </button>
            </div>
          )}
          {leaderboard.length === 0 ? (
            <p>No entries yet.</p>
          ) : (
            <ol>
              {leaderboard.map((entry, i) => (
                <li key={i}>
                  {entry.playerName} — {formatTime(entry.timeMs)}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
};

export default App;