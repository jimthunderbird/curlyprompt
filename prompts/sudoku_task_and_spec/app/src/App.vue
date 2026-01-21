<template>
  <div id="app">
    <div id="board-row" style="display: flex; gap: 20px; align-items: flex-start; justify-content: center;">
      <SudokuBoard ref="sudokuBoard" />
      <LevelSelection @difficulty-changed="handleDifficultyChange" />
    </div>
    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
      <Control @new-game="handleNewGame" />
      <Hint @hint-requested="handleHint" />
      <Solve @solve-requested="handleSolve" />
    </div>
  </div>
</template>

<script>
import SudokuBoard from './components/SudokuBoard.vue'
import Control from './components/Control.vue'
import Solve from './components/Solve.vue'
import LevelSelection from './components/LevelSelection.vue'
import Hint from './components/Hint.vue'

export default {
  name: 'App',
  components: {
    SudokuBoard,
    Control,
    Solve,
    LevelSelection,
    Hint
  },
  methods: {
    handleNewGame() {
      this.$refs.sudokuBoard.createSudokuBoard()
    },
    handleDifficultyChange(difficulty) {
      this.$refs.sudokuBoard.setDifficulty(difficulty)
      this.$refs.sudokuBoard.createSudokuBoard()
    },
    handleSolve() {
      this.$refs.sudokuBoard.solvePuzzle()
    },
    handleHint() {
      this.$refs.sudokuBoard.giveHint()
    }
  }
}
</script>

<style>
body {
  background: wheat;
  font-family: 'Garamond', serif;
  margin: 20px;
}
</style>
