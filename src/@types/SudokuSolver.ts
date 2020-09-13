import SudokuBoard from '@/@modules/Sudoku/SudokuBoard';

export default interface SudokuSolver {
  solve(board: SudokuBoard): Generator<undefined, boolean, boolean>
}