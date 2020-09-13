import SudokuBoard, { Vector, getValidValues } from './SudokuBoard';
import SudokuSolver from '@/@types/SudokuSolver';
import Vue from "vue";

export default class BacktrackingSolver implements SudokuSolver {

  givenValues: boolean[][] = [];

  solve(board: SudokuBoard) {
    this.setGiven(board);
    return this.solvePos(board, [0, 0]);
  }

  private setGiven(board: SudokuBoard) {
    for (let row = 0; row < 9; row++) {
      this.givenValues[row] = [];

      for (let col = 0; col < 9; col++) {
        this.givenValues[row][col] = board[row][col] != 0;
      }
    }
  }

  /**
   * "Solves" a given position of a SudokuBoard
   * 
   * * Yields at the beginning of each recursive call 
   * * Returns true if the position is solved, or false if it cannot be solved
   * 
   * @param pos A pair of values encoding [row, column]
   * @param board A SudokuBoard
   */
  private * solvePos(board: SudokuBoard, pos: Vector): Generator<undefined, boolean, boolean> {
    const [row, col] = pos;
    const nextPos = this.getNextIndex(pos);
    const possibleValues: number[] = [];
    let shouldClear = false;

    // We've reached the end!!
    if (row == -1) return true;

    yield;

    // For given values, there is only one possibility 
    if (this.givenValues[row][col]) {
      possibleValues.push(board[row][col]);
    }
    // Otherwise, get all possibilities
    else {
      shouldClear = true;
      possibleValues.push(...getValidValues(board, [row, col]))
    }

    // If there are no answers, backtrack
    if (possibleValues.length == 0) return false;

    // Try each one and see if it solves the puzzle
    for (const possibleValue of possibleValues) {
      Vue.set(board[row], col, possibleValue);

      // Then check the sub-problem (is the next slot solveable?)
      const subGen = this.solvePos(board, nextPos);
      let iter = subGen.next();
      while (!iter.done) {
        yield;
        iter = subGen.next();
      }

      // If the sub-problem is solveable, then we're good to go!
      if (iter.value) return true;
    }

    // If we've exausted all possibilities, backtrack
    if (shouldClear) Vue.set(board[row], col, 0);
    return false;
  }

  private getNextIndex([row, col]: Vector): Vector {
    let nextCol = col + 1;
    let nextRow = row;

    if (nextCol >= 9) {
      nextCol = 0
      nextRow++;
    }

    if (nextRow >= 9) {
      nextRow = -1;
      nextCol = -1;
    }

    return [nextRow, nextCol]
  }
}