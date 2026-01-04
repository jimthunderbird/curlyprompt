const components = {};
components["navigation.TopNavigationBar"] = class {
  constructor() {
    this.data = new Proxy(
      { links: [
        { text: "About", url: "/about" },
        { text: "Login", url: "/login" }
      ]},
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
    const nav = document.createElement('nav');
    nav.className = 'top-navigation-bar';
    
    this.data.links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.text;
      nav.appendChild(a);
    });
    
    this.element = nav;
    return nav;
  }

  update() {
    if (this.element) {
      const newElement = this.render();
      this.element.replaceWith(newElement);
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
    const container = document.createElement('div');
    
    const counterDisplay = document.createElement('div');
    counterDisplay.id = 'counter-display';
    this.elements.counterDisplay = counterDisplay;
    
    const incrementButton = document.createElement('button');
    incrementButton.id = 'counter-increment';
    incrementButton.textContent = '+';
    incrementButton.addEventListener('click', () => {
      this.data.counter++;
    });
    
    const decrementButton = document.createElement('button');
    decrementButton.id = 'counter-decrement';
    decrementButton.textContent = '-';
    decrementButton.addEventListener('click', () => {
      if (this.data.counter > 0) {
        this.data.counter--;
      }
    });
    
    container.appendChild(counterDisplay);
    container.appendChild(incrementButton);
    container.appendChild(decrementButton);
    
    this.updateDOM();
    
    return container;
  }

  updateDOM() {
    if (this.elements.counterDisplay) {
      this.elements.counterDisplay.innerHTML = `the current counter value is ${this.data.counter}`;
    }
  }
};

components["LoginForm"] = class {
  constructor() {
    this.data = new Proxy(
      {
        username: "",
        password: "",
        errorMessage: ""
      },
      {
        set: (target, property, value) => {
          target[property] = value;
          this.updateDOM(property, value);
          return true;
        }
      }
    );
    this.elements = {};
  }

  updateDOM(property, value) {
    if (property === "username" && this.elements.usernameInput) {
      this.elements.usernameInput.value = value;
    } else if (property === "password" && this.elements.passwordInput) {
      this.elements.passwordInput.value = value;
    } else if (property === "errorMessage" && this.elements.errorMessages) {
      this.elements.errorMessages.textContent = value;
    }
  }

  async handleLogin() {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.data.username,
          password: this.data.password
        })
      });

      const result = await response.json();

      if (result.success !== 1) {
        this.data.errorMessage = "Error logging in user";
        this.data.username = "your user name ...";
        this.data.password = "";
        this.elements.usernameInput.focus();
      }
    } catch (error) {
      this.data.errorMessage = "Error logging in user";
      this.data.username = "your user name ...";
      this.data.password = "";
      this.elements.usernameInput.focus();
    }
  }

  render() {
    const container = document.createElement("div");
    container.id = "login-form-holder";
    container.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      width: 100vw;
      background: #e0e5ec;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      position: fixed;
      top: 0;
      left: 0;
    `;

    const formWrapper = document.createElement("div");
    formWrapper.style.cssText = `
      background: #e0e5ec;
      padding: 60px 50px;
      border-radius: 30px;
      box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #ffffff;
      min-width: 380px;
    `;

    const errorMessages = document.createElement("div");
    errorMessages.id = "error-messages";
    errorMessages.style.cssText = `
      color: #ff6b6b;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 20px;
      min-height: 20px;
      text-align: center;
    `;
    this.elements.errorMessages = errorMessages;

    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "Enter Username";
    usernameLabel.style.cssText = `
      display: block;
      font-size: 15px;
      font-weight: 600;
      color: #555;
      margin-bottom: 10px;
    `;

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.placeholder = "your username";
    usernameInput.style.cssText = `
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 15px;
      background: #e0e5ec;
      box-shadow: inset 6px 6px 10px #cbced1, inset -6px -6px 10px #ffffff;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      outline: none;
      margin-bottom: 30px;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
    `;
    usernameInput.addEventListener("input", (e) => {
      this.data.username = e.target.value;
    });
    usernameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.elements.passwordInput.focus();
      }
    });
    this.elements.usernameInput = usernameInput;

    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Enter Password";
    passwordLabel.style.cssText = `
      display: block;
      font-size: 15px;
      font-weight: 600;
      color: #555;
      margin-bottom: 10px;
    `;

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "your password";
    passwordInput.style.cssText = `
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 15px;
      background: #e0e5ec;
      box-shadow: inset 6px 6px 10px #cbced1, inset -6px -6px 10px #ffffff;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      outline: none;
      margin-bottom: 30px;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
    `;
    passwordInput.addEventListener("input", (e) => {
      this.data.password = e.target.value;
    });
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.elements.loginButton.click();
      }
    });
    this.elements.passwordInput = passwordInput;

    const loginButton = document.createElement("button");
    loginButton.id = "login-button";
    loginButton.textContent = "Login";
    loginButton.style.cssText = `
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 15px;
      background: #e0e5ec;
      box-shadow: 6px 6px 10px #cbced1, -6px -6px 10px #ffffff;
      font-size: 16px;
      font-weight: 700;
      color: #555;
      cursor: pointer;
      outline: none;
      font-family: 'Poppins', sans-serif;
      transition: all 0.3s ease;
    `;
    loginButton.addEventListener("mousedown", (e) => {
      e.target.style.boxShadow = "inset 6px 6px 10px #cbced1, inset -6px -6px 10px #ffffff";
    });
    loginButton.addEventListener("mouseup", (e) => {
      e.target.style.boxShadow = "6px 6px 10px #cbced1, -6px -6px 10px #ffffff";
    });
    loginButton.addEventListener("click", () => {
      this.handleLogin();
    });
    this.elements.loginButton = loginButton;

    formWrapper.appendChild(errorMessages);
    formWrapper.appendChild(usernameLabel);
    formWrapper.appendChild(usernameInput);
    formWrapper.appendChild(passwordLabel);
    formWrapper.appendChild(passwordInput);
    formWrapper.appendChild(loginButton);

    container.appendChild(formWrapper);

    return container;
  }
};

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
    const wrapper = document.createElement('div');
    wrapper.id = 'user-profile-wrapper';
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


// Router
function navigate(path) {
    history.pushState(null, '', path);
    render();
}

function render() {
    const path = window.location.pathname;
    const container = document.getElementById("container");
    container.innerHTML = '';
    
    if (path === '/') {
        navigate('/about');
        return;
    } else if (path === '/counter') {
        document.title = 'simple counter';
        container.appendChild(new components["navigation.TopNavigationBar"]().render());
        container.appendChild(new components["Counter"]().render());
    } else if (path === '/login') {
        document.title = 'simple login form';
        container.appendChild(new components["navigation.TopNavigationBar"]().render());
        container.appendChild(new components["LoginForm"]().render());
        const div = document.createElement('div');
        div.style.border = '1px silver solid';
        div.textContent = 'this is a log in form generated by AI';
        container.appendChild(div);
    } else if (path.match(/^\/user\/(\d+)\/profile$/)) {
        const match = path.match(/^\/user\/(\d+)\/profile$/);
        const id = parseInt(match[1]);
        document.title = 'user profile';
        container.appendChild(new components["UserProfile"](id).render());
    } else if (path === '/about') {
        document.title = 'about';
        container.appendChild(new components["About"]().render());
    } else if (path === '/error') {
        document.title = 'error';
        container.appendChild(new components["Error"]().render());
    } else {
        navigate('/error');
    }
}

window.addEventListener('popstate', render);
document.addEventListener('DOMContentLoaded', render);

window.navigate = navigate;
