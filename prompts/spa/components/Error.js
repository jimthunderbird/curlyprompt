components["Error"] = class {
  constructor() {
    this.data = new Proxy(
      { message: "Invalid Page" },
      {
        set: (target, property, value) => {
          target[property] = value;
          this.update();
          return true;
        }
      }
    );
  }

  render() {
    const div = document.createElement('div');
    div.id = 'error-message';
    div.textContent = this.data.message;
    this.element = div;
    return div;
  }

  update() {
    if (this.element) {
      this.element.textContent = this.data.message;
    }
  }
};
