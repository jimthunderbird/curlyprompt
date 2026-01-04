const components = {};
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

components["LoginForm"] = class {
  constructor() {
    this.data = new Proxy(
      { username: "", password: "" },
      {
        set: (target, property, value) => {
          target[property] = value;
          this.updateDOM();
          return true;
        }
      }
    );
    this.element = null;
  }

  updateDOM() {
    if (this.element) {
      const usernameInput = this.element.querySelector('input[type="text"]');
      const passwordInput = this.element.querySelector('input[type="password"]');
      if (usernameInput && usernameInput !== document.activeElement) {
        usernameInput.value = this.data.username;
      }
      if (passwordInput && passwordInput !== document.activeElement) {
        passwordInput.value = this.data.password;
      }
    }
  }

  async handleLogin() {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.data.username,
          password: this.data.password
        })
      });
      const result = await response.json();
      console.log('Login response:', result);
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  render() {
    const container = document.createElement('div');
    container.id = 'login-form-holder';
    container.style.backgroundColor = 'lightyellow';
    container.style.padding = '30px';
    container.style.borderRadius = '8px';
    container.style.maxWidth = '400px';
    container.style.margin = '50px auto';
    container.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';

    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Enter Username';
    usernameLabel.style.display = 'block';
    usernameLabel.style.marginBottom = '8px';
    usernameLabel.style.fontWeight = 'bold';

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.value = this.data.username;
    usernameInput.style.width = '100%';
    usernameInput.style.padding = '10px';
    usernameInput.style.marginBottom = '20px';
    usernameInput.style.border = '1px solid #ccc';
    usernameInput.style.borderRadius = '4px';
    usernameInput.style.boxSizing = 'border-box';
    usernameInput.addEventListener('input', (e) => {
      this.data.username = e.target.value;
    });

    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Enter Password';
    passwordLabel.style.display = 'block';
    passwordLabel.style.marginBottom = '8px';
    passwordLabel.style.fontWeight = 'bold';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.value = this.data.password;
    passwordInput.style.width = '100%';
    passwordInput.style.padding = '10px';
    passwordInput.style.marginBottom = '20px';
    passwordInput.style.border = '1px solid #ccc';
    passwordInput.style.borderRadius = '4px';
    passwordInput.style.boxSizing = 'border-box';
    passwordInput.addEventListener('input', (e) => {
      this.data.password = e.target.value;
    });

    const loginButton = document.createElement('button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.style.width = '100%';
    loginButton.style.padding = '12px';
    loginButton.style.backgroundColor = '#007bff';
    loginButton.style.color = 'white';
    loginButton.style.border = 'none';
    loginButton.style.borderRadius = '4px';
    loginButton.style.fontSize = '16px';
    loginButton.style.fontWeight = 'bold';
    loginButton.style.cursor = 'pointer';
    loginButton.addEventListener('click', () => this.handleLogin());

    container.appendChild(usernameLabel);
    container.appendChild(usernameInput);
    container.appendChild(passwordLabel);
    container.appendChild(passwordInput);
    container.appendChild(loginButton);

    this.element = container;
    return container;
  }
}
components["UserProfile"] = class {
  constructor(id) {
    this.data = new Proxy(
      { id },
      {
        set: (target, prop, value) => {
          target[prop] = value;
          this.update();
          return true;
        }
      }
    );
    this.element = null;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.id = "user-profile-wrapper";
    wrapper.textContent = `This is the profile for user with id ${this.data.id}`;
    this.element = wrapper;
    return wrapper;
  }

  update() {
    if (this.element) {
      this.element.textContent = `This is the profile for user with id ${this.data.id}`;
    }
  }
};

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
    const container = document.createElement('div');
    
    const p = document.createElement('p');
    p.textContent = 'About US';
    container.appendChild(p);
    
    return container;
  }

  update() {
    if (this.element && this.element.parentNode) {
      const newElement = this.render();
      this.element.parentNode.replaceChild(newElement, this.element);
      this.element = newElement;
    }
  }
};
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


// Router logic
function route() {
    const path = window.location.pathname;
    const container = document.getElementById("container");
    container.innerHTML = "";
    
    if (path === "/") {
        window.history.pushState({}, "", "/about");
        route();
        return;
    }
    
    if (path === "/counter") {
        document.title = "simple counter";
        container.appendChild(new components["navigation.TopNavigationBar"]().render());
        container.appendChild(new components["Counter"]().render());
    } else if (path === "/login") {
        document.title = "simple login form";
        container.appendChild(new components["navigation.TopNavigationBar"]().render());
        container.appendChild(new components["LoginForm"]().render());
        const div = document.createElement("div");
        div.style.border = "1px silver solid";
        div.textContent = "this is a log in form generated by AI";
        container.appendChild(div);
    } else if (path.match(/^\/user\/(.+)\/profile$/)) {
        const id = path.match(/^\/user\/(.+)\/profile$/)[1];
        document.title = "user profile";
        container.appendChild(new components["UserProfile"]({id: id}).render());
    } else if (path === "/about") {
        document.title = "about";
        container.appendChild(new components["About"]().render());
    } else if (path === "/error") {
        document.title = "error";
        container.appendChild(new components["Error"]().render());
    } else {
        window.history.pushState({}, "", "/error");
        route();
        return;
    }
}

window.addEventListener("popstate", route);
document.addEventListener("DOMContentLoaded", route);

document.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && e.target.href.startsWith(window.location.origin)) {
        e.preventDefault();
        window.history.pushState({}, "", e.target.href);
        route();
    }
});
