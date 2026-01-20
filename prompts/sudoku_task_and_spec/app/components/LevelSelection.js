// Level Selection Component
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('level-selection').addEventListener('change', function() {
            currentDifficulty = this.value;
            createSudokuBoard();
        });
    });
} else {
    document.getElementById('level-selection').addEventListener('change', function() {
        currentDifficulty = this.value;
        createSudokuBoard();
    });
}
