import SudokuBoard from '@/@modules/Sudoku/SudokuBoard';

export default interface SudokuSolver {
  solve(board: SudokuBoard): boolean 
  solveSlowly(board: SudokuBoard, delay: number): Promise<boolean> 
}