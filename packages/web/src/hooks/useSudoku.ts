import { useState, useEffect, useCallback, useRef } from 'react';
import type { Board, Difficulty } from '../types';

const BOARD_SIZE = 9;

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 0)
  );
}

function deepCopy(board: Board): Board {
  return board.map((row) => [...row]);
}

export interface SudokuState {
  board: Board;
  initialBoard: Board;
  difficulty: Difficulty;
  puzzleId: string | null;
  timeMs: number;
  isComplete: boolean;
  setCell: (row: number, col: number, value: number) => void;
  loadPuzzle: (puzzleId: string, difficulty: Difficulty, board: Board) => void;
  reset: () => void;
}

export function useSudoku(): SudokuState {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [initialBoard, setInitialBoard] = useState<Board>(createEmptyBoard);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [puzzleId, setPuzzleId] = useState<string | null>(null);
  const [timeMs, setTimeMs] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Tick timer
  useEffect(() => {
    if (isComplete || puzzleId === null) return;
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    const tick = () => {
      setTimeMs(Date.now() - (startTimeRef.current ?? Date.now()));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isComplete, puzzleId]);

  const setCell = useCallback((row: number, col: number, value: number) => {
    if (value < 0 || value > 9) return;
    setBoard((prev) => {
      const next = deepCopy(prev);
      next[row][col] = value;
      return next;
    });
  }, []);

  const loadPuzzle = useCallback(
    (id: string, diff: Difficulty, newBoard: Board) => {
      setPuzzleId(id);
      setDifficulty(diff);
      setBoard(deepCopy(newBoard));
      setInitialBoard(deepCopy(newBoard));
      setTimeMs(0);
      setIsComplete(false);
      startTimeRef.current = null;
    },
    []
  );

  const reset = useCallback(() => {
    setBoard(deepCopy(initialBoard));
    setTimeMs(0);
    setIsComplete(false);
    startTimeRef.current = null;
  }, [initialBoard]);

  return {
    board,
    initialBoard,
    difficulty,
    puzzleId,
    timeMs,
    isComplete,
    setCell,
    loadPuzzle,
    reset,
  };
}