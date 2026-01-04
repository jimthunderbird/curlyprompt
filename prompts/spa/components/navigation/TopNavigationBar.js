components["navigation.TopNavigationBar"] = class {
  constructor() {
    this.data = new Proxy(
      {
        links: [
          { text: "About", url: "/about" },
          { text: "Login", url: "/login" }
        ]
      },
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
    const nav = document.createElement("nav");
    
    this.data.links.forEach(link => {
      const a = document.createElement("a");
      a.textContent = link.text;
      a.href = link.url;
      nav.appendChild(a);
    });

    this.element = nav;
    return nav;
  }

  update() {
    if (this.element && this.element.parentNode) {
      const newElement = this.render();
      this.element.parentNode.replaceChild(newElement, this.element);
    }
  }
};
