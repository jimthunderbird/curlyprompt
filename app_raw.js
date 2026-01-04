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
    
    this.elements.display = document.createElement('div');
    this.elements.display.id = 'counter-display';
    
    this.elements.incrementBtn = document.createElement('button');
    this.elements.incrementBtn.id = 'counter-increment';
    this.elements.incrementBtn.textContent = '+';
    this.elements.incrementBtn.addEventListener('click', () => {
      this.data.counter++;
    });
    
    this.elements.decrementBtn = document.createElement('button');
    this.elements.decrementBtn.id = 'counter-decrement';
    this.elements.decrementBtn.textContent = '-';
    this.elements.decrementBtn.addEventListener('click', () => {
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
      { username: '', password: '' },
      {
        set: (target, property, value) => {
          target[property] = value;
          this.updateDOM();
          return true;
        }
      }
    );
  }

  render() {
    const container = document.createElement('div');
    container.id = 'login-form-holder';
    
    const style = document.createElement('style');
    style.textContent = `
      #login-form-holder {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px;
        border-radius: 10px;
        max-width: 400px;
        margin: 50px auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      
      #login-form-holder label {
        display: block;
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 8px;
        margin-top: 20px;
      }
      
      #login-form-holder input {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.9);
      }
      
      #login-button {
        width: 100%;
        padding: 14px;
        margin-top: 25px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 700;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      
      #login-button:hover {
        background-color: #45a049;
      }
    `;
    
    container.appendChild(style);
    
    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Enter Username';
    container.appendChild(usernameLabel);
    
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.value = this.data.username;
    usernameInput.addEventListener('input', (e) => {
      this.data.username = e.target.value;
    });
    container.appendChild(usernameInput);
    
    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Enter Password';
    container.appendChild(passwordLabel);
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.value = this.data.password;
    passwordInput.addEventListener('input', (e) => {
      this.data.password = e.target.value;
    });
    container.appendChild(passwordInput);
    
    const loginButton = document.createElement('button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.addEventListener('click', async () => {
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
    });
    container.appendChild(loginButton);
    
    this.container = container;
    return container;
  }
  
  updateDOM() {
    if (this.container) {
      const usernameInput = this.container.querySelector('input[type="text"]');
      const passwordInput = this.container.querySelector('input[type="password"]');
      if (usernameInput) usernameInput.value = this.data.username;
      if (passwordInput) passwordInput.value = this.data.password;
    }
  }
}

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


// Router setup
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
    } else if (path.match(/^\/user\/[^\/]+\/profile$/)) {
        document.title = "user profile";
        const id = path.split("/")[2];
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

window.navigateTo = function(path) {
    window.history.pushState({}, "", path);
    route();
};
