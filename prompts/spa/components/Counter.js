components["Counter"] = class {
  constructor() {
    this.data = new Proxy(
      { counter: 0 },
      {
        set: (target, property, value) => {
          target[property] = value;
          this.updateDOM();
          return true;
        }
      }
    );
    this.elements = {};
  }

  render() {
    const container = document.createElement("div");
    
    this.elements.display = document.createElement("div");
    this.elements.display.id = "counter-display";
    
    this.elements.incrementBtn = document.createElement("button");
    this.elements.incrementBtn.id = "counter-increment";
    this.elements.incrementBtn.textContent = "+";
    this.elements.incrementBtn.addEventListener("click", () => {
      this.data.counter++;
    });
    
    this.elements.decrementBtn = document.createElement("button");
    this.elements.decrementBtn.id = "counter-decrement";
    this.elements.decrementBtn.textContent = "-";
    this.elements.decrementBtn.addEventListener("click", () => {
      if (this.data.counter > 0) {
        this.data.counter--;
      }
    });
    
    container.appendChild(this.elements.display);
    container.appendChild(this.elements.incrementBtn);
    container.appendChild(this.elements.decrementBtn);
    
    this.updateDOM();
    
    return container;
  }

  updateDOM() {
    if (this.elements.display) {
      this.elements.display.innerHTML = `the current counter value is ${this.data.counter}`;
    }
  }
};
