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
          this.updateDOM();
          return true;
        }
      }
    );
  }

  updateDOM() {
    const errorDiv = document.querySelector("#error-messages");
    const usernameInput = document.querySelector("#username-input");
    const passwordInput = document.querySelector("#password-input");
    
    if (errorDiv) errorDiv.textContent = this.data.errorMessage;
    if (usernameInput) usernameInput.value = this.data.username;
    if (passwordInput) passwordInput.value = this.data.password;
  }

  async handleLogin() {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        setTimeout(() => document.querySelector("#username-input")?.focus(), 0);
      }
    } catch (error) {
      this.data.errorMessage = "Error logging in user";
      this.data.username = "your user name ...";
      this.data.password = "";
      setTimeout(() => document.querySelector("#username-input")?.focus(), 0);
    }
  }

  render() {
    const container = document.createElement("div");
    container.id = "login-form-holder";
    
    container.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        #login-form-holder {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #e0e5ec;
          font-family: 'Poppins', 'Segoe UI', Tahoma, sans-serif;
          position: fixed;
          top: 0;
          left: 0;
        }
        
        .form-wrapper {
          background: #e0e5ec;
          padding: 60px 50px;
          border-radius: 30px;
          box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #ffffff;
          width: 400px;
        }
        
        .form-title {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
          color: #5a5a5a;
          margin-bottom: 40px;
          letter-spacing: 1px;
        }
        
        #error-messages {
          color: #e74c3c;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
          margin-bottom: 20px;
          min-height: 20px;
        }
        
        .input-group {
          margin-bottom: 30px;
        }
        
        .input-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #6a6a6a;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }
        
        .input-group input {
          width: 100%;
          padding: 15px 20px;
          border: none;
          outline: none;
          background: #e0e5ec;
          border-radius: 25px;
          box-shadow: inset 6px 6px 10px #cbced1, inset -6px -6px 10px #ffffff;
          font-size: 15px;
          font-weight: 500;
          color: #5a5a5a;
          font-family: 'Poppins', 'Segoe UI', Tahoma, sans-serif;
          transition: all 0.3s ease;
        }
        
        .input-group input::placeholder {
          color: #a3a3a3;
          font-weight: 400;
        }
        
        .input-group input:focus {
          box-shadow: inset 4px 4px 8px #cbced1, inset -4px -4px 8px #ffffff;
        }
        
        #login-button {
          width: 100%;
          padding: 15px;
          margin-top: 20px;
          border: none;
          outline: none;
          background: #e0e5ec;
          border-radius: 25px;
          box-shadow: 6px 6px 12px #cbced1, -6px -6px 12px #ffffff;
          font-size: 16px;
          font-weight: 700;
          color: #5a5a5a;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', 'Segoe UI', Tahoma, sans-serif;
          letter-spacing: 1px;
        }
        
        #login-button:hover {
          box-shadow: 4px 4px 8px #cbced1, -4px -4px 8px #ffffff;
        }
        
        #login-button:active {
          box-shadow: inset 6px 6px 12px #cbced1, inset -6px -6px 12px #ffffff;
        }
      </style>
      
      <div class="form-wrapper">
        <div class="form-title">Login</div>
        <div id="error-messages"></div>
        
        <div class="input-group">
          <label for="username-input">Enter Username</label>
          <input 
            type="text" 
            id="username-input" 
            placeholder="your username"
          />
        </div>
        
        <div class="input-group">
          <label for="password-input">Enter Password</label>
          <input 
            type="password" 
            id="password-input" 
            placeholder="your password"
          />
        </div>
        
        <button id="login-button">Login</button>
      </div>
    `;
    
    setTimeout(() => {
      const usernameInput = container.querySelector("#username-input");
      const passwordInput = container.querySelector("#password-input");
      const loginButton = container.querySelector("#login-button");
      
      usernameInput?.addEventListener("input", (e) => {
        this.data.username = e.target.value;
      });
      
      usernameInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          passwordInput?.focus();
        }
      });
      
      passwordInput?.addEventListener("input", (e) => {
        this.data.password = e.target.value;
      });
      
      passwordInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          loginButton?.click();
        }
      });
      
      loginButton?.addEventListener("click", () => {
        this.handleLogin();
      });
    }, 0);
    
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
        return;
    }
}

window.addEventListener('popstate', render);
document.addEventListener('DOMContentLoaded', render);

window.navigate = navigate;
