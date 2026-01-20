/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Sudoku Application Tests', () => {
  let html;
  let document;

  beforeEach(() => {
    html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    document = window.document;
    document.documentElement.innerHTML = html;
  });

  describe('Component Layout and Order', () => {
    test('should have component.abc as first element in horizontal layout', () => {
      const abcDiv = document.getElementById('abc');
      expect(abcDiv).not.toBeNull();
    });

    test('should have component.control as second element in horizontal layout', () => {
      const controlButton = document.getElementById('control');
      expect(controlButton).not.toBeNull();
    });

    test('should have component.sudokuboard as third element in horizontal layout', () => {
      const sudokuboardDiv = document.getElementById('sudokuboard');
      expect(sudokuboardDiv).not.toBeNull();
    });

    test('should have horizontal layout with abc before control before sudokuboard', () => {
      const abcDiv = document.getElementById('abc');
      const controlButton = document.getElementById('control');
      const sudokuboardDiv = document.getElementById('sudokuboard');

      const abcRect = abcDiv.getBoundingClientRect();
      const controlRect = controlButton.getBoundingClientRect();
      const sudokuboardRect = sudokuboardDiv.getBoundingClientRect();

      expect(abcRect.left).toBeLessThan(controlRect.left);
      expect(controlRect.left).toBeLessThan(sudokuboardRect.left);
    });
  });

  describe('Component Properties', () => {
    test('should have div#abc with text "ABC"', () => {
      const abcDiv = document.getElementById('abc');
      expect(abcDiv.tagName.toLowerCase()).toBe('div');
      expect(abcDiv.textContent.trim()).toBe('ABC');
    });

    test('should have button#control with text "Brand New Game"', () => {
      const controlButton = document.getElementById('control');
      expect(controlButton.tagName.toLowerCase()).toBe('button');
      expect(controlButton.textContent.trim()).toBe('Brand New Game');
    });

    test('should have div#sudokuboard', () => {
      const sudokuboardDiv = document.getElementById('sudokuboard');
      expect(sudokuboardDiv.tagName.toLowerCase()).toBe('div');
    });
  });

  describe('Sudoku Board Creation Functionality', () => {
    test('should create sudoku board on initial load', () => {
      const sudokuboardDiv = document.getElementById('sudokuboard');
      expect(sudokuboardDiv.innerHTML.trim()).not.toBe('');
    });

    test('should create 9x9 grid structure with 81 cells', () => {
      const sudokuboardDiv = document.getElementById('sudokuboard');
      const cells = sudokuboardDiv.querySelectorAll('[data-row][data-col]');
      expect(cells.length).toBe(81);
    });

    test('should have cells with data-row attributes from 0 to 8', () => {
      const sudokuboardDiv = document.getElementById('sudokuboard');
      for (let row = 0; row < 9; row++) {
        const rowCells = sudokuboardDiv.querySelectorAll(`[data-row="${row}"]`);
        expect(rowCells.length).toBeGreaterThan(0);
      }
    });

    test('should have cells with data-col attributes from 0 to 8', () => {
      const sudokuboardDiv = document.getElementById('sudokuboard');
      for (let col = 0; col < 9; col++) {
        const colCells = sudokuboardDiv.querySelectorAll(`[data-col="${col}"]`);
        expect(colCells.length).toBeGreaterThan(0);
      }
    });

    test('should have some pre-filled cells and some empty cells', () => {
      const sudokuboardDiv = document.getElementById('sudokuboard');
      const cells = sudokuboardDiv.querySelectorAll('[data-row][data-col]');
      
      const filledCells = Array.from(cells).filter(cell => cell.textContent.trim() !== '');
      const emptyCells = Array.from(cells).filter(cell => cell.textContent.trim() === '');

      expect(filledCells.length).toBeGreaterThan(0);
      expect(emptyCells.length).toBeGreaterThan(0);
    });

    test('should only contain valid sudoku numbers 1-9 in filled cells', () => {
      const sudokuboardDiv = document.getElementById('sudokuboard');
      const cells = sudokuboardDiv.querySelectorAll('[data-row][data-col]');
      
      const filledCells = Array.from(cells).filter(cell => cell.textContent.trim() !== '');
      
      filledCells.forEach(cell => {
        const num = parseInt(cell.textContent.trim());
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(9);
      });
    });
  });

  describe('Button#control Click Functionality', () => {
    test('should recreate sudoku board when button#control is clicked', () => {
      const controlButton = document.getElementById('control');
      const sudokuboardDiv = document.getElementById('sudokuboard');
      
      controlButton.click();
      
      const cells = sudokuboardDiv.querySelectorAll('[data-row][data-col]');
      expect(cells.length).toBe(81);
    });

    test('should create new board with filled and empty cells after button#control click', () => {
      const controlButton = document.getElementById('control');
      const sudokuboardDiv = document.getElementById('sudokuboard');
      
      controlButton.click();
      
      const cells = sudokuboardDiv.querySelectorAll('[data-row][data-col]');
      const filledCells = Array.from(cells).filter(cell => cell.textContent.trim() !== '');
      const emptyCells = Array.from(cells).filter(cell => cell.textContent.trim() === '');

      expect(filledCells.length).toBeGreaterThan(0);
      expect(emptyCells.length).toBeGreaterThan(0);
    });
  });

  describe('Div#abc Click Functionality', () => {
    test('should recreate sudoku board when div#abc is clicked', () => {
      const abcDiv = document.getElementById('abc');
      const sudokuboardDiv = document.getElementById('sudokuboard');
      
      abcDiv.click();
      
      const cells = sudokuboardDiv.querySelectorAll('[data-row][data-col]');
      expect(cells.length).toBe(81);
    });

    test('should create new board with filled and empty cells after div#abc click', () => {
      const abcDiv = document.getElementById('abc');
      const sudokuboardDiv = document.getElementById('sudokuboard');
      
      abcDiv.click();
      
      const cells = sudokuboardDiv.querySelectorAll('[data-row][data-col]');
      const filledCells = Array.from(cells).filter(cell => cell.textContent.trim() !== '');
      const emptyCells = Array.from(cells).filter(cell => cell.textContent.trim() === '');

      expect(filledCells.length).toBeGreaterThan(0);
      expect(emptyCells.length).toBeGreaterThan(0);
    });
  });
});
