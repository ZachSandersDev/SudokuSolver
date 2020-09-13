type SudokuBoard = number[][];
export default SudokuBoard
export type Vector = [number, number];

export function newBoard(oldBoard?: SudokuBoard): SudokuBoard {
  const board = [
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

  if (!oldBoard) return board;

  for (let ri = 0; ri < 9; ri++) {
    for (let ci = 0; ci < 9; ci++) {
      board[ri][ci] = oldBoard[ri][ci];
    }
  }

  return board;
}

export function isValid(board: SudokuBoard): boolean {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (!posIsValid(board, [row, col])) return false;
    }
  }
  return true;
}

export function posIsValid(board: SudokuBoard, position: Vector): boolean {
  const slotValue = board[position[0]][position[1]];
  if (slotValue == 0) return true;

  const visibleValues = getVisibleValues(board, position);
  return !visibleValues.includes(slotValue);
}

export function getValidValues(board: SudokuBoard, position: Vector): number[] {
  const visibleValues = getVisibleValues(board, position);
  const validValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  return validValues.filter(v => !visibleValues.includes(v));
}

function getVisibleValues(board: SudokuBoard, [row, col]: Vector): number[] {

  const visibleValues: Set<number> = new Set();

  // Check the row for visible values
  for (let colCheck = 0; colCheck < 9; colCheck++) {
    const checkValue = board[row][colCheck]
    if (colCheck != col && checkValue != 0)
      visibleValues.add(checkValue)
  }

  // Check the column for visible values
  for (let rowCheck = 0; rowCheck < 9; rowCheck++) {
    const checkValue = board[rowCheck][col]
    if (rowCheck != row && checkValue != 0)
      visibleValues.add(checkValue)
  }

  // Check the square 
  const squareCornerX = Math.floor(col / 3) * 3;
  const squareCornerY = Math.floor(row / 3) * 3;
  for (let rowCheck = squareCornerY; rowCheck < squareCornerY + 3; rowCheck++) {
    for (let colCheck = squareCornerX; colCheck < squareCornerX + 3; colCheck++) {
      const checkValue = board[rowCheck][colCheck];
      if (!(rowCheck == row && colCheck == col) && checkValue != 0)
        visibleValues.add(checkValue);
    }
  }

  return [...visibleValues];
}