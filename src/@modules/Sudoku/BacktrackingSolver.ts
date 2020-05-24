import SudokuBoard from './SudokuBoard';
import SudokuSolver from '@/@types/SudokuSolver';

export default class BacktrackingSolver implements SudokuSolver {

  givenValues: Map<string, true | undefined> = new Map();

  solve(board: SudokuBoard) {
    const validGivens = this.setGiven(board);
    if (!validGivens) return false;
    return this.solvePos(0, 0, board);
  }

  async solveSlowly(board: SudokuBoard, delay: number) {
    const validGivens = this.setGiven(board);
    if (!validGivens) return false;
    return this.solvePosDelayed(0, 0, board, delay);
  }

  private setGiven(board: SudokuBoard): boolean {
    this.givenValues = new Map();
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board.slots[row][col] != 0) {
          this.givenValues.set([row, col].join(","), true);
        }

        if (!board.isValid(row, col)) {
          return false;
        }
      }
    }
    return true;
  }

  private solvePos(row: number, col: number, board: SudokuBoard): boolean {
    const [nextRow, nextCol] = this.getNextIndex(row, col);

    // We've reached the end!!
    if (row == -1) return true

    // Skip given values
    if (this.givenValues.get([row, col].join(',')))
      return this.solvePos(nextRow, nextCol, board)

    // Get possible values for the current slot
    const possibleValues = board.getValidValues(row, col);

    // If there are no answers, backtrack
    if (possibleValues.length == 0) return false;

    // Try each one and see if it solves the puzzle
    for (const possibleValue of possibleValues) {
      board.setSlotValue(row, col, possibleValue);

      // Bubble successes!
      if (this.solvePos(nextRow, nextCol, board))
        return true;
    }

    // If we've exausted all possibilities, backtrack
    board.emptySlot(row, col);
    return false;
  }

  private async solvePosDelayed(row: number, col: number, board: SudokuBoard, delay: number): Promise<boolean> {
    const [nextRow, nextCol] = this.getNextIndex(row, col);
    await this.sleep(delay);

    // We've reached the end!!
    if (row == -1) return true

    // Skip given values
    if (this.givenValues.get([row, col].join(',')))
      return await this.solvePosDelayed(nextRow, nextCol, board, delay)

    // Get possible values for the current slot
    const possibleValues = board.getValidValues(row, col);

    // If there are no answers, backtrack
    if (possibleValues.length == 0) return false;

    // Try each one and see if it solves the puzzle
    for (const possibleValue of possibleValues) {
      board.setSlotValue(row, col, possibleValue);

      // Bubble successes!
      if (await this.solvePosDelayed(nextRow, nextCol, board, delay))
        return true;
    }

    // If we've exausted all possibilities, backtrack
    board.emptySlot(row, col);
    return false;
  }

  private getNextIndex(row: number, col: number): [number, number] {
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

  private sleep(duration: number) {
    return new Promise((res) =>
      setTimeout(res, duration)
    )
  }

}