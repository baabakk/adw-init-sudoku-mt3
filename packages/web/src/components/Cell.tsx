import React from 'react';
import type { Board } from '../types';

interface CellProps {
  value: number; // 0 = empty
  isInitial: boolean;
  isHighlighted: boolean;
  hasError: boolean;
  onChange: (value: number) => void;
}

const Cell: React.FC<CellProps> = ({
  value,
  isInitial,
  isHighlighted,
  hasError,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInitial) return;
    const raw = e.target.value.replace(/\D/g, '').slice(-1);
    onChange(raw === '' ? 0 : parseInt(raw, 10));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value === 0 ? '' : value}
      disabled={isInitial}
      onChange={handleChange}
      className={[
        'sudoku-cell',
        isInitial ? 'sudoku-cell--initial' : '',
        isHighlighted ? 'sudoku-cell--highlighted' : '',
        hasError ? 'sudoku-cell--error' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
};

interface BoardProps {
  board: Board;
  initialBoard: Board;
  highlightedCells: Set<string>;
  errorCells: Set<string>;
  onCellChange: (row: number, col: number, value: number) => void;
}

const BoardComponent: React.FC<BoardProps> = ({
  board,
  initialBoard,
  highlightedCells,
  errorCells,
  onCellChange,
}) => {
  const cellKey = (r: number, c: number) => `${r}-${c}`;

  return (
    <div className="sudoku-board">
      {board.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <Cell
            key={cellKey(rowIdx, colIdx)}
            value={cell}
            isInitial={initialBoard[rowIdx][colIdx] !== 0}
            isHighlighted={highlightedCells.has(cellKey(rowIdx, colIdx))}
            hasError={errorCells.has(cellKey(rowIdx, colIdx))}
            onChange={(val) => onCellChange(rowIdx, colIdx, val)}
          />
        ))
      )}
    </div>
  );
};

export default BoardComponent;