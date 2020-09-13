import SudokuBoard, { getValidValues } from './SudokuBoard';
import SudokuSolver from '@/@types/SudokuSolver';
import Vue from "vue";

export default class InformedSolver implements SudokuSolver {

  solve(board: SudokuBoard) {
    return this.solveLowest(board);
  }

  /**
  * "Solves" whichever slot on the board has the lowest number of possibilities,
  * otherwise it's the same as the backtracking algorithm
  *
  * * Yields at the beginning of each recursive call
  * * Returns true if the position is solved, or false if it cannot be solved
  *
  * @param board A SudokuBoard
  */
  private * solveLowest(board: SudokuBoard): Generator<undefined, boolean, boolean> {

    yield;

    // Get the position of the slot with the lowest number of possibilities
    const nextI = this.getLowestPossibilitiesIndex(board);

    // If that was unsuccessful, return if it's good unsuccessful or bad unsuccessful 
    if (typeof nextI == "boolean") return nextI;

    const [lowRow, lowCol, lowPossible] = nextI;

    // Try each possibility and see if it solves the puzzle
    for (const possibleValue of lowPossible) {
      Vue.set(board[lowRow], lowCol, possibleValue);

      // Then check the sub-problem (is the next slot solveable?)
      const subGen = this.solveLowest(board);
      let iter = subGen.next();
      while (!iter.done) {
        yield;
        iter = subGen.next();
      }

      // If the sub-problem is solveable, then we're good to go!
      if (iter.value) return true;
    }

    // If we've exausted all possibilities, backtrack
    Vue.set(board[lowRow], lowCol, 0);
    return false;
  }

  getLowestPossibilitiesIndex(board: SudokuBoard): [number, number, number[]] | boolean {
    let lowRow = 0;
    let lowCol = 0;
    let lowPossible: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {

        // Skip filled slots
        if (board[row][col] != 0)
          continue;

        // Get possible values for the current slot
        const possibleValues = getValidValues(board, [row, col]);

        // Find whatever square has the lowest number of possible values
        if (possibleValues.length < lowPossible.length) {
          lowPossible = possibleValues;
          lowRow = row;
          lowCol = col;
        }

        // If there are no possibilities for a slot, bail out
        if (possibleValues.length == 0) return false;
      }
    }

    // If no empty slots were found, we should be good!
    if (lowPossible.length == 10) return true;

    return [lowRow, lowCol, lowPossible];
  }

}