import SudokuSolver from '@/@types/SudokuSolver';

export default class SudokuBoard {
  readonly slots: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]

  constructor(board?: SudokuBoard) {
    if (board) this.copyBoard(board);
  }

  private copyBoard(board: SudokuBoard) {
    for (let ri = 0; ri < 9; ri++) {
      for (let ci = 0; ci < 9; ci++) {
        this.slots[ri][ci] = board.slots[ri][ci];
      }
    }
  }

  private checkIndex(index: number, type: string) {
    if (index < 0 || index > 8)
      throw `SudokuBoard IndexError: ${type} = ${index} is out of bounds`
  }

  private checkValue(value: number) {
    if (value < 0 || value > 9)
      throw `SudokuBoard ValueError: ${value} is not a valid sudoku value`
  }

  getSlotValue(row: number, col: number) {
    this.checkIndex(row, "row");
    this.checkIndex(col, "col");

    return this.slots[row][col];
  }

  setSlotValue(row: number, col: number, value: number) {
    this.checkIndex(row, "row");
    this.checkIndex(col, "col");
    this.checkValue(value);

    this.slots[row].splice(col, 1, value);
  }

  emptySlot(row: number, col: number) {
    this.checkIndex(row, "row");
    this.checkIndex(col, "col");
    this.slots[row].splice(col, 1, 0);
  }

  isEmpty(row: number, col: number): boolean {
    this.checkIndex(row, "row");
    this.checkIndex(col, "col");
    return this.slots[row][col] == 0;
  }

  isValid(row: number, col: number): boolean {
    this.checkIndex(row, "row");
    this.checkIndex(col, "col");

    const slotValue = this.slots[row][col];
    if (slotValue == 0) return true;

    const visibleValues = this.getVisibleValues(row, col);
    return !visibleValues.includes(slotValue);
  }

  getValidValues(row: number, col: number): number[] {
    this.checkIndex(row, "row");
    this.checkIndex(col, "col");

    const visibleValues = this.getVisibleValues(row, col);
    const validValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    return validValues.filter(v => !visibleValues.includes(v));
  }

  private getVisibleValues(row: number, col: number): number[] {
    this.checkIndex(row, "row");
    this.checkIndex(col, "col");

    const visibleValues: Set<number> = new Set();

    // Check the row for visible values
    for (let colCheck = 0; colCheck < 9; colCheck++) {
      const checkValue = this.slots[row][colCheck]
      if (colCheck != col && checkValue != 0)
        visibleValues.add(checkValue)
    }

    // Check the column for visible values
    for (let rowCheck = 0; rowCheck < 9; rowCheck++) {
      const checkValue = this.slots[rowCheck][col]
      if (rowCheck != row && checkValue != 0)
        visibleValues.add(checkValue)
    }

    // Check the square 
    const squareCornerX = Math.floor(col / 3) * 3;
    const squareCornerY = Math.floor(row / 3) * 3;
    for (let rowCheck = squareCornerY; rowCheck < squareCornerY + 3; rowCheck++) {
      for (let colCheck = squareCornerX; colCheck < squareCornerX + 3; colCheck++) {
        const checkValue = this.slots[rowCheck][colCheck];
        if (!(rowCheck == row && colCheck == col) && checkValue != 0)
          visibleValues.add(checkValue);
      }
    }

    return [...visibleValues];
  }

  solve(solver: SudokuSolver) {
    return solver.solve(this);
  }
}