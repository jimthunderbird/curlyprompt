class About {
  constructor() {
    this.element = null;
  }

  render() {
    this.element = document.createElement('div');
    
    const p = document.createElement('p');
    p.textContent = 'About US';
    
    this.element.appendChild(p);
    
    return this.element;
  }
}
