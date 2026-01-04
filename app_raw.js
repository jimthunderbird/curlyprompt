const components = {};

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

components["LoginForm"] = class {
  constructor() {
    this.data = new Proxy(
      { username: '', password: '', error: '' },
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
    const container = document.createElement('div');
    container.id = 'login-form-holder';
    
    const style = document.createElement('style');
    style.textContent = `
      #login-form-holder {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .login-form-wrapper {
        background: white;
        padding: 60px 50px;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        width: 100%;
        max-width: 400px;
      }
      
      .login-form-wrapper h2 {
        margin: 0 0 40px 0;
        padding: 0;
        color: #333;
        text-align: center;
        font-size: 28px;
        font-weight: 300;
        letter-spacing: 1px;
      }
      
      .form-group {
        margin-bottom: 30px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 8px;
        color: #666;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0.5px;
      }
      
      .form-group input {
        width: 100%;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        transition: border-color 0.3s;
        box-sizing: border-box;
      }
      
      .form-group input:focus {
        outline: none;
        border-color: #667eea;
      }
      
      #login-button {
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 5px;
        color: white;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 1px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      #login-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      }
      
      #login-button:active {
        transform: translateY(0);
      }
      
      .error-message {
        color: #e74c3c;
        font-size: 13px;
        margin-top: 10px;
        text-align: center;
      }
    `;
    
    const formWrapper = document.createElement('div');
    formWrapper.className = 'login-form-wrapper';
    
    const title = document.createElement('h2');
    title.textContent = 'LOGIN';
    
    const usernameGroup = document.createElement('div');
    usernameGroup.className = 'form-group';
    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Enter Username';
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username-input';
    usernameInput.addEventListener('input', (e) => {
      this.data.username = e.target.value;
    });
    usernameGroup.appendChild(usernameLabel);
    usernameGroup.appendChild(usernameInput);
    
    const passwordGroup = document.createElement('div');
    passwordGroup.className = 'form-group';
    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Enter Password';
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password-input';
    passwordInput.addEventListener('input', (e) => {
      this.data.password = e.target.value;
    });
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    
    const loginButton = document.createElement('button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.data.username,
            password: this.data.password
          })
        });
        const result = await response.json();
        if (!response.ok) {
          this.data.error = result.message || 'Login failed';
        } else {
          this.data.error = '';
          console.log('Login successful', result);
        }
      } catch (error) {
        this.data.error = 'Network error occurred';
        console.error('Login error:', error);
      }
    });
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.id = 'error-message';
    
    formWrapper.appendChild(title);
    formWrapper.appendChild(usernameGroup);
    formWrapper.appendChild(passwordGroup);
    formWrapper.appendChild(loginButton);
    formWrapper.appendChild(errorDiv);
    
    container.appendChild(style);
    container.appendChild(formWrapper);
    
    this.element = container;
    this.usernameInput = usernameInput;
    this.passwordInput = passwordInput;
    this.errorDiv = errorDiv;
    
    return container;
  }
  
  update() {
    if (this.errorDiv) {
      this.errorDiv.textContent = this.data.error;
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


// Router
const router = {
    routes: {},
    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('DOMContentLoaded', () => this.handleRoute());
    },
    addRoute(path, handler) {
        this.routes[path] = handler;
    },
    navigate(path) {
        history.pushState(null, '', path);
        this.handleRoute();
    },
    handleRoute() {
        const path = window.location.pathname;
        
        if (path === '/') {
            this.navigate('/about');
            return;
        }
        
        const container = document.getElementById('container');
        container.innerHTML = '';
        
        if (path === '/counter') {
            document.title = 'simple counter';
            container.appendChild(new components['navigation.TopNavigationBar']().render());
            container.appendChild(new components['Counter']().render());
        } else if (path === '/login') {
            document.title = 'simple login form';
            container.appendChild(new components['navigation.TopNavigationBar']().render());
            container.appendChild(new components['LoginForm']().render());
            const div = document.createElement('div');
            div.style.border = '1px solid silver';
            div.textContent = 'this is a log in form generated by AI';
            container.appendChild(div);
        } else if (path.startsWith('/user/') && path.endsWith('/profile')) {
            const id = path.split('/')[2];
            document.title = 'user profile';
            const component = new components['UserProfile']();
            component.id = id;
            container.appendChild(component.render());
        } else if (path === '/about') {
            document.title = 'about';
            container.appendChild(new components['About']().render());
        } else if (path === '/error') {
            document.title = 'error';
            container.appendChild(new components['Error']().render());
        } else {
            this.navigate('/error');
        }
    }
};

router.init();
