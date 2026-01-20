// Solve Component - Solve this puzzle button
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('solve').addEventListener('click', function() {
            // Check if we have a stored solution
            if (solution && solution.length === 9 && solution[0].length === 9) {
                // Use stored solution directly
                board = solution.map(row => [...row]);
            } else {
                // Generate new valid solution if no solution exists
                board = generateFullBoard();
                solution = board.map(row => [...row]);
            }
            
            renderBoard();
        });
    });
} else {
    document.getElementById('solve').addEventListener('click', function() {
        // Check if we have a stored solution
        if (solution && solution.length === 9 && solution[0].length === 9) {
            // Use stored solution directly
            board = solution.map(row => [...row]);
        } else {
            // Generate new valid solution if no solution exists
            board = generateFullBoard();
            solution = board.map(row => [...row]);
        }
        
        renderBoard();
    });
}
