// Control Component - Brand New Game Button
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('control').addEventListener('click', function() {
            createSudokuBoard();
        });
    });
} else {
    document.getElementById('control').addEventListener('click', function() {
        createSudokuBoard();
    });
}
