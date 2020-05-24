import SudokuBoard from './SudokuBoard';
import SudokuSolver from '@/@types/SudokuSolver';

export default class InformedSolver implements SudokuSolver {

  solve(board: SudokuBoard) {
    if (!this.checkGiven(board)) return false;
    return this.solveLowestPossibilities(board);
  }

  async solveSlowly(board: SudokuBoard, delay: number) {
    if (!this.checkGiven(board)) return false;
    return this.solveLowestPossibilitiesDelayed(board, delay);
  }

  private checkGiven(board: SudokuBoard): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!board.isValid(row, col)) {
          return false;
        }
      }
    }
    return true;
  }

  private solveLowestPossibilities(board: SudokuBoard) {
    let lowRow = 0;
    let lowCol = 0;
    let lowPossible: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {

        // Skip filled slots
        if (board.slots[row][col] != 0)
          continue;

        // Get possible values for the current slot
        const possibleValues = board.getValidValues(row, col);

        // Find whatever square has the lowest number of possible values
        if (possibleValues.length < lowPossible.length) {
          lowPossible = possibleValues;
          lowRow = row;
          lowCol = col;
        }

        // If there are no answers, backtrack
        if (possibleValues.length == 0) return false;

      }
    }

    // If no empty slots were found, we should be good!
    if (lowPossible.length == 10) return true;

    // Try each one and see if it solves the puzzle
    for (const possibleValue of lowPossible) {
      board.setSlotValue(lowRow, lowCol, possibleValue);

      // Bubble successes!
      if (this.solveLowestPossibilities(board))
        return true;
    }

    // If we've exausted all possibilities, backtrack
    board.emptySlot(lowRow, lowCol);
    return false;
  }

  private async solveLowestPossibilitiesDelayed(board: SudokuBoard, delay: number) {
    let lowRow = 0;
    let lowCol = 0;
    let lowPossible: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    await this.sleep(delay)

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {

        // Skip filled slots
        if (board.slots[row][col] != 0)
          continue;

        // Get possible values for the current slot
        const possibleValues = board.getValidValues(row, col);

        // Find whatever square has the lowest number of possible values
        if (possibleValues.length < lowPossible.length) {
          lowPossible = possibleValues;
          lowRow = row;
          lowCol = col;
        }

        // If there are no answers, backtrack
        if (possibleValues.length == 0) return false;

      }
    }

    // If no empty slots were found, we should be good!
    if (lowPossible.length == 10) return true;

    // Try each one and see if it solves the puzzle
    for (const possibleValue of lowPossible) {
      board.setSlotValue(lowRow, lowCol, possibleValue);

      // Bubble successes!
      if (await this.solveLowestPossibilitiesDelayed(board, delay))
        return true;
    }

    // If we've exausted all possibilities, backtrack
    board.emptySlot(lowRow, lowCol);
    return false;
  }

  private sleep(duration: number) {
    return new Promise((res) =>
      setTimeout(res, duration)
    )
  }
}