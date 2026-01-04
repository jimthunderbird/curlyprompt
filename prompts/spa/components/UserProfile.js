components["UserProfile"] = class {
  constructor(id) {
    this.data = new Proxy(
      { id },
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
    const div = document.createElement('div');
    div.id = 'user-profile-wrapper';
    div.textContent = `This is the profile for user with id ${this.data.id}`;
    this.element = div;
    return div;
  }

  update() {
    if (this.element) {
      this.element.textContent = `This is the profile for user with id ${this.data.id}`;
    }
  }
};
