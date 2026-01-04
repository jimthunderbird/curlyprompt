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
    if (!this.elements.root) return;

    if (property === "username" && this.elements.usernameInput) {
      this.elements.usernameInput.value = value;
    } else if (property === "password" && this.elements.passwordInput) {
      this.elements.passwordInput.value = value;
    } else if (property === "errorMessage" && this.elements.errorDiv) {
      this.elements.errorDiv.textContent = value;
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
      }
    } catch (error) {
      this.data.errorMessage = "Error logging in user";
      this.data.username = "your user name ...";
    }
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.id = "login-form-holder";

    const style = document.createElement("style");
    style.textContent = `
      #login-form-holder {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #e0e5ec;
        font-family: 'Poppins', sans-serif;
      }

      .login-form-container {
        background: #e0e5ec;
        padding: 60px 50px;
        border-radius: 30px;
        box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #ffffff;
        width: 400px;
      }

      #error-messages {
        color: #ff6b6b;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 20px;
        min-height: 20px;
        text-align: center;
      }

      .form-group {
        margin-bottom: 30px;
      }

      .form-group label {
        display: block;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #555;
      }

      .form-group input {
        width: 100%;
        padding: 15px;
        border: none;
        border-radius: 15px;
        background: #e0e5ec;
        box-shadow: inset 6px 6px 10px #cbced1, inset -6px -6px 10px #ffffff;
        font-size: 16px;
        font-weight: 500;
        color: #555;
        font-family: 'Poppins', sans-serif;
        outline: none;
        transition: all 0.3s ease;
      }

      .form-group input::placeholder {
        color: #a0a0a0;
        font-weight: 400;
      }

      .form-group input:focus {
        box-shadow: inset 4px 4px 8px #cbced1, inset -4px -4px 8px #ffffff;
      }

      #login-button {
        width: 100%;
        padding: 15px;
        border: none;
        border-radius: 15px;
        background: #e0e5ec;
        box-shadow: 6px 6px 12px #cbced1, -6px -6px 12px #ffffff;
        font-size: 16px;
        font-weight: 700;
        color: #555;
        font-family: 'Poppins', sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 20px;
      }

      #login-button:hover {
        box-shadow: 4px 4px 8px #cbced1, -4px -4px 8px #ffffff;
      }

      #login-button:active {
        box-shadow: inset 6px 6px 12px #cbced1, inset -6px -6px 12px #ffffff;
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement("div");
    container.className = "login-form-container";

    const errorDiv = document.createElement("div");
    errorDiv.id = "error-messages";
    errorDiv.textContent = this.data.errorMessage;
    this.elements.errorDiv = errorDiv;

    const usernameGroup = document.createElement("div");
    usernameGroup.className = "form-group";
    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "Enter Username";
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.placeholder = "your username";
    usernameInput.value = this.data.username;
    usernameInput.addEventListener("input", (e) => {
      this.data.username = e.target.value;
    });
    this.elements.usernameInput = usernameInput;
    usernameGroup.appendChild(usernameLabel);
    usernameGroup.appendChild(usernameInput);

    const passwordGroup = document.createElement("div");
    passwordGroup.className = "form-group";
    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Enter Password";
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "your password";
    passwordInput.value = this.data.password;
    passwordInput.addEventListener("input", (e) => {
      this.data.password = e.target.value;
    });
    this.elements.passwordInput = passwordInput;
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);

    const loginButton = document.createElement("button");
    loginButton.id = "login-button";
    loginButton.textContent = "Login";
    loginButton.addEventListener("click", () => {
      this.handleLogin();
    });

    container.appendChild(errorDiv);
    container.appendChild(usernameGroup);
    container.appendChild(passwordGroup);
    container.appendChild(loginButton);

    wrapper.appendChild(container);

    this.elements.root = wrapper;

    return wrapper;
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


function navigate(path) {
  history.pushState(null, '', path);
  render();
}

function render() {
  const container = document.getElementById("container");
  container.innerHTML = '';
  const path = window.location.pathname;
  
  if (path === '/') {
    navigate('/about');
    return;
  }
  
  if (path === '/counter') {
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
  } else if (path.match(/^\/user\/\d+\/profile$/)) {
    document.title = 'user profile';
    const id = parseInt(path.split('/')[2]);
    container.appendChild(new components["UserProfile"](id).render());
  } else if (path === '/about') {
    document.title = 'about';
    container.appendChild(new components["About"]().render());
  } else if (path === '/error') {
    document.title = 'error';
    container.appendChild(new components["Error"]().render());
  } else {
    navigate('/error');
    return;
  }
}

window.addEventListener('popstate', render);
document.addEventListener('DOMContentLoaded', render);
