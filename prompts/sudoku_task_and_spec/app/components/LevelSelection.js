// Level Selection Component
document.getElementById('level-selection').addEventListener('change', function() {
    currentDifficulty = this.value;
    createSudokuBoard();
});
