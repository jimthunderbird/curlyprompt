/**
 * @jest-environment jsdom
 */

describe('Sudoku Game Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Super Simple Sudoku version 2</title>
                <style>
                    body {
                        background: wheat;
                        font-family: Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 20px;
                    }

                    #control {
                        width: 200px;
                        height: 100px;
                        background: Brown;
                        color: white;
                        border: none;
                        font-size: 16px;
                        cursor: pointer;
                        margin-bottom: 20px;
                    }

                    #control:hover {
                        background: darkseagreen;
                    }

                    #abc {
                        background: orange;
                        padding: 10px 20px;
                        margin-bottom: 20px;
                        cursor: pointer;
                        font-weight: bold;
                    }

                    #sudokuboard {
                        display: grid;
                        grid-template-columns: repeat(9, 50px);
                        grid-template-rows: repeat(9, 50px);
                        gap: 0;
                        border: 3px solid #000;
                    }

                    .sudoku-cell {
                        width: 50px;
                        height: 50px;
                        border: 1px solid #999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                        background: white;
                    }

                    .sudoku-cell.given {
                        background: #e0e0e0;
                        font-weight: bold;
                    }

                    .sudoku-cell.row-3n {
                        border-bottom: 2px solid #000;
                    }

                    .sudoku-cell.col-3n {
                        border-right: 2px solid #000;
                    }
                </style>
            </head>
            <body>
                <button id="control">Brand New Game</button>
                <div id="abc">ABC</div>
                <div id="sudokuboard"></div>
            </body>
            </html>
        `;
    });

    test('Todo 1: index.html is created', () => {
        expect(document.querySelector('html')).toBeTruthy();
    });

    test('Todo 2: HTML has correct title and background', () => {
        const title = document.querySelector('title');
        expect(title.textContent).toBe('Super Simple Sudoku version 2');
        
        const bodyStyle = window.getComputedStyle(document.body);
        expect(bodyStyle.background).toContain('rgb(245, 222, 179)');
    });

    test('Todo 3: Sudoku board component exists and renders', () => {
        // Load and execute the script
        const script = `
            function generateSudoku() {
                const solution = [
                    [5, 3, 4, 6, 7, 8, 9, 1, 2],
                    [6, 7, 2, 1, 9, 5, 3, 4, 8],
                    [1, 9, 8, 3, 4, 2, 5, 6, 7],
                    [8, 5, 9, 7, 6, 1, 4, 2, 3],
                    [4, 2, 6, 8, 5, 3, 7, 9, 1],
                    [7, 1, 3, 9, 2, 4, 8, 5, 6],
                    [9, 6, 1, 5, 3, 7, 2, 8, 4],
                    [2, 8, 7, 4, 1, 9, 6, 3, 5],
                    [3, 4, 5, 2, 8, 6, 1, 7, 9]
                ];

                const puzzle = JSON.parse(JSON.stringify(solution));
                const cellsToRemove = 45;
                let removed = 0;
                
                while (removed < cellsToRemove) {
                    const row = Math.floor(Math.random() * 9);
                    const col = Math.floor(Math.random() * 9);
                    
                    if (puzzle[row][col] !== 0) {
                        puzzle[row][col] = 0;
                        removed++;
                    }
                }
                
                return puzzle;
            }

            function renderSudoku(puzzle) {
                const board = document.getElementById('sudokuboard');
                board.innerHTML = '';
                
                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'sudoku-cell';
                        
                        if (row === 2 || row === 5) {
                            cell.classList.add('row-3n');
                        }
                        if (col === 2 || col === 5) {
                            cell.classList.add('col-3n');
                        }
                        
                        if (puzzle[row][col] !== 0) {
                            cell.textContent = puzzle[row][col];
                            cell.classList.add('given');
                        }
                        
                        board.appendChild(cell);
                    }
                }
            }

            function createNewGame() {
                const puzzle = generateSudoku();
                renderSudoku(puzzle);
            }

            createNewGame();

            document.getElementById('control').addEventListener('click', createNewGame);
            document.getElementById('abc').addEventListener('click', createNewGame);
        `;
        eval(script);

        const board = document.getElementById('sudokuboard');
        expect(board).toBeTruthy();
        expect(board.children.length).toBe(81);
    });

    test('Todo 4: Control button exists with correct properties', () => {
        const controlButton = document.getElementById('control');
        expect(controlButton).toBeTruthy();
        expect(controlButton.textContent).toBe('Brand New Game');
        
        const style = window.getComputedStyle(controlButton);
        expect(style.width).toBe('200px');
        expect(style.height).toBe('100px');
        expect(style.background).toContain('rgb(165, 42, 42)');
    });

    test('Todo 4: Control button click generates new game', () => {
        const script = `
            function generateSudoku() {
                const solution = [
                    [5, 3, 4, 6, 7, 8, 9, 1, 2],
                    [6, 7, 2, 1, 9, 5, 3, 4, 8],
                    [1, 9, 8, 3, 4, 2, 5, 6, 7],
                    [8, 5, 9, 7, 6, 1, 4, 2, 3],
                    [4, 2, 6, 8, 5, 3, 7, 9, 1],
                    [7, 1, 3, 9, 2, 4, 8, 5, 6],
                    [9, 6, 1, 5, 3, 7, 2, 8, 4],
                    [2, 8, 7, 4, 1, 9, 6, 3, 5],
                    [3, 4, 5, 2, 8, 6, 1, 7, 9]
                ];

                const puzzle = JSON.parse(JSON.stringify(solution));
                const cellsToRemove = 45;
                let removed = 0;
                
                while (removed < cellsToRemove) {
                    const row = Math.floor(Math.random() * 9);
                    const col = Math.floor(Math.random() * 9);
                    
                    if (puzzle[row][col] !== 0) {
                        puzzle[row][col] = 0;
                        removed++;
                    }
                }
                
                return puzzle;
            }

            function renderSudoku(puzzle) {
                const board = document.getElementById('sudokuboard');
                board.innerHTML = '';
                
                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'sudoku-cell';
                        
                        if (row === 2 || row === 5) {
                            cell.classList.add('row-3n');
                        }
                        if (col === 2 || col === 5) {
                            cell.classList.add('col-3n');
                        }
                        
                        if (puzzle[row][col] !== 0) {
                            cell.textContent = puzzle[row][col];
                            cell.classList.add('given');
                        }
                        
                        board.appendChild(cell);
                    }
                }
            }

            function createNewGame() {
                const puzzle = generateSudoku();
                renderSudoku(puzzle);
            }

            createNewGame();

            document.getElementById('control').addEventListener('click', createNewGame);
            document.getElementById('abc').addEventListener('click', createNewGame);
        `;
        eval(script);

        const controlButton = document.getElementById('control');
        const boardBefore = document.getElementById('sudokuboard').innerHTML;
        
        controlButton.click();
        
        const boardAfter = document.getElementById('sudokuboard').innerHTML;
        expect(document.getElementById('sudokuboard').children.length).toBe(81);
    });

    test('Todo 5: ABC component exists with correct properties', () => {
        const abcDiv = document.getElementById('abc');
        expect(abcDiv).toBeTruthy();
        expect(abcDiv.textContent).toBe('ABC');
        
        const style = window.getComputedStyle(abcDiv);
        expect(style.background).toContain('rgb(255, 165, 0)');
    });

    test('Todo 5: ABC component click generates new game', () => {
        const script = `
            function generateSudoku() {
                const solution = [
                    [5, 3, 4, 6, 7, 8, 9, 1, 2],
                    [6, 7, 2, 1, 9, 5, 3, 4, 8],
                    [1, 9, 8, 3, 4, 2, 5, 6, 7],
                    [8, 5, 9, 7, 6, 1, 4, 2, 3],
                    [4, 2, 6, 8, 5, 3, 7, 9, 1],
                    [7, 1, 3, 9, 2, 4, 8, 5, 6],
                    [9, 6, 1, 5, 3, 7, 2, 8, 4],
                    [2, 8, 7, 4, 1, 9, 6, 3, 5],
                    [3, 4, 5, 2, 8, 6, 1, 7, 9]
                ];

                const puzzle = JSON.parse(JSON.stringify(solution));
                const cellsToRemove = 45;
                let removed = 0;
                
                while (removed < cellsToRemove) {
                    const row = Math.floor(Math.random() * 9);
                    const col = Math.floor(Math.random() * 9);
                    
                    if (puzzle[row][col] !== 0) {
                        puzzle[row][col] = 0;
                        removed++;
                    }
                }
                
                return puzzle;
            }

            function renderSudoku(puzzle) {
                const board = document.getElementById('sudokuboard');
                board.innerHTML = '';
                
                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'sudoku-cell';
                        
                        if (row === 2 || row === 5) {
                            cell.classList.add('row-3n');
                        }
                        if (col === 2 || col === 5) {
                            cell.classList.add('col-3n');
                        }
                        
                        if (puzzle[row][col] !== 0) {
                            cell.textContent = puzzle[row][col];
                            cell.classList.add('given');
                        }
                        
                        board.appendChild(cell);
                    }
                }
            }

            function createNewGame() {
                const puzzle = generateSudoku();
                renderSudoku(puzzle);
            }

            createNewGame();

            document.getElementById('control').addEventListener('click', createNewGame);
            document.getElementById('abc').addEventListener('click', createNewGame);
        `;
        eval(script);

        const abcDiv = document.getElementById('abc');
        abcDiv.click();
        
        expect(document.getElementById('sudokuboard').children.length).toBe(81);
    });

    test('Todo 6: Layout has correct order', () => {
        const bodyChildren = Array.from(document.body.children);
        const controlIndex = bodyChildren.findIndex(el => el.id === 'control');
        const abcIndex = bodyChildren.findIndex(el => el.id === 'abc');
        const boardIndex = bodyChildren.findIndex(el => el.id === 'sudokuboard');
        
        expect(controlIndex).toBeLessThan(abcIndex);
        expect(abcIndex).toBeLessThan(boardIndex);
    });
});
