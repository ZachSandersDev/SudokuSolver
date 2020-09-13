<template>
  <div id="app">
    <div class="view">
      <sudoku-board-comp class="sudoku-wrapper" :originalBoard="originalBoard" :board="board" />
      <div class="controls">
        <div class="button-row">
          <input type="checkbox" name="animateSolve" id="animateSolve" v-model="animate" />
          <label for="animateSolve">Show solve animation</label>
        </div>

        <div class="button-row" v-if="animate">
          <label class="delay-label">Delay (ms)</label>
          <input type="number" v-model="delay" />
        </div>

        <div class="button-row">
          <button v-if="!solving" @click="reset">Clear Board</button>
          <button v-if="!solving" @click="clearSolution">Clear Solution</button>

          <button v-if="solving" @click="cancel = true">Cancel Solve</button>
        </div>

        <div class="button-row" v-if="!solving">
          <button @click="solveBacktrack">Solve with backtracking</button>
        </div>

        <div class="button-row" v-if="!solving">
          <button @click="solveInformed">Solve using lowest possibilities first</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

import SudokuBoard, { isValid, newBoard } from "@/@modules/Sudoku/SudokuBoard";
import BacktrackingSolver from "@/@modules/Sudoku/BacktrackingSolver";
import InformedSolver from "@/@modules/Sudoku/InformedSolver";

import SudokuBoardComp from "@/components/SudokuBoard.vue";
import SudokuSolver from "@/@types/SudokuSolver";

@Component({ components: { SudokuBoardComp } })
export default class DefaultView extends Vue {
  originalBoard = newBoard();
  board = newBoard();

  animate: boolean = true;
  cancel: boolean = false;
  solving: boolean = false;

  delay: number = 25;

  created() {
    this.board = [
      [0, 0, 0, 0, 9, 4, 0, 0, 0],
      [0, 0, 5, 3, 0, 0, 7, 0, 2],
      [0, 0, 9, 0, 0, 0, 0, 8, 0],
      [0, 0, 4, 0, 0, 7, 0, 0, 6],
      [2, 0, 1, 0, 0, 0, 5, 0, 9],
      [7, 0, 0, 6, 0, 0, 4, 0, 0],
      [0, 5, 0, 0, 0, 0, 9, 0, 0],
      [8, 0, 6, 0, 0, 1, 3, 0, 0],
      [0, 0, 0, 8, 6, 0, 0, 0, 0],
    ];
  }

  reset() {
    this.board = newBoard();
    this.originalBoard = newBoard();
  }

  clearSolution() {
    this.board = newBoard(this.originalBoard);
  }

  solve(solver: SudokuSolver) {
    if (!isValid(this.board)) {
      alert("The provided puzzle was invalid.");
      return;
    }

    this.originalBoard = newBoard(this.board);
    this.cancel = false;
    // const delay = this.delay;

    const solution = solver.solve(this.board);
    let iter = solution.next();

    if (this.animate) {
      this.solving = true;

      const stepFunc = () => {
        if (iter.done && !iter.value)
          alert(`The given board could not be solved`);

        if (iter.done || this.cancel) {
          this.solving = false;
          return;
        }

        iter = solution.next();
        setTimeout(stepFunc, this.delay || 0);
      };

      setTimeout(stepFunc, this.delay || 0);
      return;
    }

    while (!iter.done) {
      iter = solution.next();
    }
    if (!iter.value) alert(`The given board could not be solved`);
  }

  solveBacktrack() {
    this.solve(new BacktrackingSolver());
  }

  solveInformed() {
    this.solve(new InformedSolver());
  }
}
</script>

<style lang="scss">
@import "./assets/index.scss";
#app {
  width: 100%;
  height: 100%;
}

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
    margin-right: 0.5em;
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

.delay-label {
  margin-right: 1em;
}
</style>