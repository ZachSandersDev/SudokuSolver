<template>
  <div class="sudoku-wrapper">
    <div class="sudoku-board">
      <span class="row" v-for="(row, ri) in board.slots" :key="'sudokuRow' + ri">
        <span
          v-for="(slot, ci) in row"
          :key="'sudokuSlot' + ri + ci"
          class="slot"
          :class="['slot-' + ri + '-' + ci, slot == originalBoard.slots[ri][ci] ? 'original-value' : '']"
        >
          <input
            type="number"
            :ref="'input-' + ri + '-' + ci"
            :value="getValue(ri, ci)"
            @focus="selected = [ri, ci]"
            @blur="selected = [ri, ci]"
            @keydown="onArrow"
            @input="setValue(ri, ci, $event.target)"
          />
        </span>
      </span>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import SudokuBoard from "@/@modules/Sudoku/SudokuBoard";

@Component
export default class SudokuBoardComponent extends Vue {
  @Prop() originalBoard!: SudokuBoard;
  @Prop() board!: SudokuBoard;

  selected: [number, number] = [-1, -1];

  getValue(row: number, col: number) {
    return this.board.getSlotValue(row, col) || "";
  }

  onArrow(event: KeyboardEvent) {
    let [row, col] = this.selected;

    // Left
    if (event.keyCode == 37) {
      event.preventDefault();
      col -= 1;
    }

    // Right
    if (event.keyCode == 39) {
      event.preventDefault();
      col++;
    }

    // Up
    if (event.keyCode == 38) {
      event.preventDefault();
      row--;
    }

    // Down
    if (event.keyCode == 40) {
      event.preventDefault();
      row++;
    }

    if (col < 0) col = 0;
    if (col > 8) col = 8;
    if (row < 0) row = 0;
    if (row > 8) row = 8;

    this.selected = [row, col];
    this.focusSelectedInput();
  }

  onBlur(row: number, col: number) {
    if (row == this.selected[0] && col == this.selected[1]) {
      this.selected = [-1, -1];
    }
  }

  focusSelectedInput() {
    let elements = this.$refs["input-" + this.selected.join("-")] as
      | HTMLInputElement[]
      | HTMLInputElement
      | undefined;
    if (!elements) return;

    let element: HTMLInputElement;
    if (Array.isArray(elements)) element = elements[0];
    else element = elements;

    element.focus();
  }

  setValue(row: number, col: number, input: HTMLInputElement) {
    const numValue = Number(input.value) % 10;
    if (numValue > 9 || numValue < 1) {
      this.board.emptySlot(row, col);
      return;
    }
    this.board.setSlotValue(row, col, numValue);
  }
}
</script>

<style lang="scss" scoped>
.sudoku-wrapper {
  position: relative;
  display: flex;
  flex-flow: column;
}

.sudoku-wrapper:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.sudoku-board {
  display: flex;
  flex-flow: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.row {
  flex: 1;
  display: flex;
  flex-flow: row;
}

.slot {
  flex: 1;
  position: relative;

  input {
    outline: none;
    border: none;
    background-color: rgba(0, 0, 0, 0);

    min-width: 2ch;
    position: absolute;
    width: 100%;
    height: 100%;

    text-align: center;
    font-size: 1.75em;
    padding: 0;
  }
}

.original-value {
  input {
    color: red;
  }
}

@function slot-shadow($row, $col) {
  $baseShadow: inset 1px 1px hsl(0, 0, 80%);
  $shadow: null;

  @if $row != 0 and $row % 3 == 0 {
    $shadow: append($shadow, (inset 0 1px black), comma);
    $shadow: append($shadow, (0 -1px black), comma);
  }

  @if $col != 0 and $col % 3 == 0 {
    $shadow: append($shadow, (inset 1px 0 black), comma);
    $shadow: append($shadow, (-1px 0 black), comma);
  }

  @if $row == 8 {
    $shadow: append($shadow, (inset 0 -1px hsl(0, 0, 80%)), comma);
  }

  @if $col == 8 {
    $shadow: append($shadow, (inset -1px 0 hsl(0, 0, 80%)), comma);
  }

  @return append($shadow, $baseShadow, comma);
}

@mixin slot-list {
  @for $r from 0 through 9 {
    @for $c from 0 through 9 {
      .slot-#{$r}-#{$c} {
        box-shadow: slot-shadow($r, $c);
      }
    }
  }
}

@include slot-list;
</style>
