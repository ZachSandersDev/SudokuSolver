<template>
  <div class="view">
    <sudoku-board-comp class="sudoku-wrapper" :originalBoard="originalBoard" :board="board" />
    <div class="controls">
      <div class="button-row">
        <input type="checkbox" name="animateSolve" id="animateSolve" v-model="animate" />
        <label for="animateSolve">Show solve animation</label>
      </div>

      <div class="button-row">
        <button @click="reset">Clear Board</button>
        <button @click="clearSolution">Clear Solution</button>
      </div>

      <div class="button-row">
        <button @click="solveBacktrack">Solve with backtracking</button>
      </div>

      <div class="button-row">
        <button @click="solveInformed">Solve using lowest possibilities first</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

import SudokuBoard from "@/@modules/Sudoku/SudokuBoard";
import BacktrackingSolver from "@/@modules/Sudoku/BacktrackingSolver";
import InformedSolver from "@/@modules/Sudoku/InformedSolver";

import SudokuBoardComp from "@/components/SudokuBoard.vue";

@Component({ components: { SudokuBoardComp } })
export default class DefaultView extends Vue {
  originalBoard = new SudokuBoard();
  board = new SudokuBoard();

  animate: boolean = false;

  created() {
    (this.board.slots as any) = [
      [0, 0, 0, 0, 9, 4, 0, 0, 0],
      [0, 0, 5, 3, 0, 0, 7, 0, 2],
      [0, 0, 9, 0, 0, 0, 0, 8, 0],
      [0, 0, 4, 0, 0, 7, 0, 0, 6],
      [2, 0, 1, 0, 0, 0, 5, 0, 9],
      [7, 0, 0, 6, 0, 0, 4, 0, 0],
      [0, 5, 0, 0, 0, 0, 9, 0, 0],
      [8, 0, 6, 0, 0, 1, 3, 0, 0],
      [0, 0, 0, 8, 6, 0, 0, 0, 0]
    ];
  }

  reset() {
    this.board = new SudokuBoard();
    this.originalBoard = new SudokuBoard();
  }

  clearSolution() {
    this.board = new SudokuBoard(this.originalBoard);
  }

  solveBacktrack() {
    this.originalBoard = new SudokuBoard(this.board);
    const solver = new BacktrackingSolver();

    const now = Date.now();

    if (this.animate) {
      solver.solveSlowly(this.board, 5).then(solved => {
        console.log(`Solve took ${Date.now() - now}ms`);
        if (!solved) alert(`Failed to solve!`);
      });
    } else {
      if (solver.solve(this.board))
        console.log(`Solve took ${Date.now() - now}ms`);
      else alert(`The given board is not valid!`);
    }
  }

  solveInformed() {
    this.originalBoard = new SudokuBoard(this.board);
    const solver = new InformedSolver();

    const now = Date.now();

    if (this.animate) {
      solver.solveSlowly(this.board, 50).then(solved => {
        console.log(`Solve took ${Date.now() - now}ms`);
        if (!solved) alert(`Failed to solve!`);
      });
    } else {
      if (solver.solve(this.board))
        console.log(`Solve took ${Date.now() - now}ms`);
      else alert(`The given board is not valid!`);
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  padding: 1.5em;

  @media (orientation: landscape) {
    flex-flow: row;
    justify-content: center;

    .controls {
      margin-left: 2em;
    }
  
  }
}

.button-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5em;

  button:not(:last-of-type) {
    margin-right: .5em;
  }
}

.sudoku-wrapper {
  width: 40%;
  @media screen and (max-width: 1000px) {
    width: 60%;
  }
  @media screen and (max-width: 700px) {
    width: 80%;
  }
  @media screen and (max-width: 500px) {
    width: 100%;
  }
}

button {
  width: 100%;
  min-width: 10ch;
}
</style>