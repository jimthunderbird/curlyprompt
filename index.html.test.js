const fs = require('fs');
const path = require('path');

describe('Sudoku Layout Tests', () => {
  let html;
  let dom;
  let document;

  beforeAll(() => {
    html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    const { JSDOM } = require('jsdom');
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  test('only components in spec.layout should show up: level_selection, control, sudokuboard, jkl, ghi', () => {
    expect(document.getElementById('level_selection')).not.toBeNull();
    expect(document.getElementById('control')).not.toBeNull();
    expect(document.getElementById('sudokuboard')).not.toBeNull();
    expect(document.getElementById('jkl')).not.toBeNull();
    expect(document.getElementById('ghi')).not.toBeNull();
    expect(document.getElementById('def')).toBeNull();
  });

  test('components order in horizontal layout: level_selection, control, sudokuboard, jkl, ghi', () => {
    const container = document.getElementById('container');
    const children = Array.from(container.children);
    const ids = children.map(child => {
      if (child.id) return child.id;
      return child.querySelector('[id]')?.id || '';
    });
    const expectedOrder = ['level_selection', 'control', 'sudokuboard', 'jkl', 'ghi'];
    const actualOrder = ids.filter(id => expectedOrder.includes(id));
    expect(actualOrder).toEqual(expectedOrder);
  });

  test('layout should be horizontal N column layout with N=5 components', () => {
    const container = document.getElementById('container');
    const computedStyle = dom.window.getComputedStyle(container);
    expect(computedStyle.display).toBe('flex');
    expect(computedStyle.flexDirection).toBe('row');
    const visibleComponents = Array.from(container.children).filter(child => {
      return child.id || child.querySelector('[id]');
    });
    expect(visibleComponents.length).toBe(5);
  });
});
