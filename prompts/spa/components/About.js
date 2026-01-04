components["About"] = class {
  constructor() {
    this.data = new Proxy({}, {
      set: (target, property, value) => {
        target[property] = value;
        this.update();
        return true;
      }
    });
  }

  render() {
    const p = document.createElement('p');
    p.textContent = 'About This LLM generated component demo';
    return p;
  }

  update() {
    if (this.element && this.element.parentNode) {
      const newElement = this.render();
      this.element.parentNode.replaceChild(newElement, this.element);
      this.element = newElement;
    }
  }
};
