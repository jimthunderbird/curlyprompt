// Sudoku Board Component
let board = [];
let solution = [];
let currentDifficulty = 'superhard';

function getDifficultyRange(difficulty) {
    switch(difficulty) {
        case 'easy': return [36, 45];
        case 'medium': return [46, 54];
        case 'hard': return [55, 64];
        case 'superhard': return [65, 74];
        default: return [65, 74];
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isValid(board, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
    }
    
    // Check 3x3 box
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    
    return true;
}

function fillDiagonalBoxes(board) {
    for (let box = 0; box < 3; box++) {
        let nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let idx = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[box * 3 + i][box * 3 + j] = nums[idx++];
            }
        }
    }
}

function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function generateFullBoard() {
    let newBoard = Array(9).fill().map(() => Array(9).fill(0));
    fillDiagonalBoxes(newBoard);
    solveSudoku(newBoard);
    return newBoard;
}

function removeNumbers(board, difficulty) {
    let attempts = getDifficultyRange(difficulty);
    let cellsToRemove = Math.floor(Math.random() * (attempts[1] - attempts[0] + 1)) + attempts[0];
    
    let removed = 0;
    while (removed < cellsToRemove) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            removed++;
        }
    }
}

function renderBoard() {
    const boardElement = document.getElementById('sudokuboard');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Add box background
            const boxNum = Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1;
            cell.classList.add(boxNum % 2 === 0 ? 'box-even' : 'box-odd');
            
            if (board[row][col] !== 0) {
                cell.textContent = board[row][col];
                cell.classList.add('filled');
            } else {
                cell.contentEditable = false;
                cell.addEventListener('click', function() {
                    if (!this.classList.contains('filled')) {
                        // Remove selected class from all cells
                        document.querySelectorAll('.cell').forEach(c => {
                            if (!c.classList.contains('filled')) {
                                c.classList.remove('selected');
                                c.contentEditable = false;
                            }
                        });
                        
                        this.classList.add('selected');
                        this.contentEditable = true;
                        this.focus();
                    }
                });
                
                cell.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = parseInt(this.textContent);
                        if (value >= 1 && value <= 9) {
                            const row = parseInt(this.dataset.row);
                            const col = parseInt(this.dataset.col);
                            board[row][col] = value;
                            this.classList.remove('selected');
                            this.contentEditable = false;
                            this.blur();
                        }
                    }
                });
                
                cell.addEventListener('input', function() {
                    // Only allow single digit numbers
                    this.textContent = this.textContent.replace(/[^1-9]/g, '').slice(0, 1);
                });
            }
            
            boardElement.appendChild(cell);
        }
    }
}

function createSudokuBoard() {
    solution = generateFullBoard();
    board = solution.map(row => [...row]);
    removeNumbers(board, currentDifficulty);
    renderBoard();
}

// Initialize board on page load
window.addEventListener('DOMContentLoaded', createSudokuBoard);
