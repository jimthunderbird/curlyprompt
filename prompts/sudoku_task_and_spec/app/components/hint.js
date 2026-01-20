// Hint Component - Give hint for one random empty cell
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('hint').addEventListener('click', function() {
            // Find all empty cells
            let emptyCells = [];
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        emptyCells.push({row, col});
                    }
                }
            }
            
            if (emptyCells.length === 0) {
                return; // No empty cells
            }
            
            // Pick a random empty cell
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const row = randomCell.row;
            const col = randomCell.col;
            
            // Get the correct answer from solution
            const answer = solution[row][col];
            
            // Update board
            board[row][col] = answer;
            
            // Find the cell element and apply hint styling
            const cells = document.querySelectorAll('.cell');
            const cellElement = cells[row * 9 + col];
            
            cellElement.textContent = answer;
            cellElement.classList.remove('selected');
            cellElement.classList.add('hint');
            cellElement.contentEditable = false;
            
            // After 5 seconds, change to filled styling
            setTimeout(() => {
                cellElement.classList.remove('hint');
                cellElement.classList.add('filled');
            }, 5000);
        });
    });
} else {
    document.getElementById('hint').addEventListener('click', function() {
        // Find all empty cells
        let emptyCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    emptyCells.push({row, col});
                }
            }
        }
        
        if (emptyCells.length === 0) {
            return; // No empty cells
        }
        
        // Pick a random empty cell
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const row = randomCell.row;
        const col = randomCell.col;
        
        // Get the correct answer from solution
        const answer = solution[row][col];
        
        // Update board
        board[row][col] = answer;
        
        // Find the cell element and apply hint styling
        const cells = document.querySelectorAll('.cell');
        const cellElement = cells[row * 9 + col];
        
        cellElement.textContent = answer;
        cellElement.classList.remove('selected');
        cellElement.classList.add('hint');
        cellElement.contentEditable = false;
        
        // After 5 seconds, change to filled styling
        setTimeout(() => {
            cellElement.classList.remove('hint');
            cellElement.classList.add('filled');
        }, 5000);
    });
}
