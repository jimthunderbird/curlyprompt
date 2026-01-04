components["Error"] = class {
  constructor() {
    this.data = new Proxy(
      { message: "Page Not Found" },
      {
        set: (target, property, value) => {
          target[property] = value;
          this.update();
          return true;
        }
      }
    );
    this.element = null;
  }

  render() {
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.textContent = this.data.message;
    
    this.element = errorMessage;
    return this.element;
  }

  update() {
    if (this.element) {
      this.element.textContent = this.data.message;
    }
  }
};
