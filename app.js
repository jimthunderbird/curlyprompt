class TopNavigationBar {
  constructor() {
    this.links = [
      { text: 'About', url: '/about' },
      { text: 'Login', url: '/login' }
    ];
  }

  render() {
    const nav = document.createElement('nav');
    nav.className = 'top-navigation-bar';
    
    this.links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.text;
      nav.appendChild(a);
    });
    
    return nav;
  }
}


class Counter {
  constructor() {
    this.data = {
      counter: 0
    };
  }

  render() {
    const container = document.createElement('div');
    
    const counterDisplay = document.createElement('div');
    counterDisplay.id = 'counter-display';
    counterDisplay.innerHTML = `the current counter value is ${this.data.counter}`;
    
    const incrementButton = document.createElement('button');
    incrementButton.id = 'counter-increment';
    incrementButton.textContent = '+';
    incrementButton.addEventListener('click', () => {
      this.data.counter++;
      this.update();
    });
    
    const decrementButton = document.createElement('button');
    decrementButton.id = 'counter-decrement';
    decrementButton.textContent = '-';
    decrementButton.addEventListener('click', () => {
      if (this.data.counter > 0) {
        this.data.counter--;
      }
      this.update();
    });
    
    container.appendChild(counterDisplay);
    container.appendChild(incrementButton);
    container.appendChild(decrementButton);
    
    this.container = container;
    this.counterDisplay = counterDisplay;
    
    return container;
  }
  
  update() {
    if (this.counterDisplay) {
      this.counterDisplay.innerHTML = `the current counter value is ${this.data.counter}`;
    }
  }
}

class LoginForm {
  constructor() {
    this.formHolder = null;
  }

  render() {
    this.formHolder = document.createElement('div');
    this.formHolder.id = 'login-form-holder';
    this.formHolder.style.cssText = `
      background: lightyellow;
      padding: 2rem;
      border-radius: 8px;
      max-width: 400px;
      margin: 2rem auto;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    `;

    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Enter Username';
    usernameLabel.style.cssText = `
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    `;

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.style.cssText = `
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    `;

    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Enter Password';
    passwordLabel.style.cssText = `
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    `;

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.style.cssText = `
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    `;

    const loginButton = document.createElement('button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.style.cssText = `
      width: 100%;
      padding: 0.75rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s ease;
    `;

    loginButton.addEventListener('mouseenter', () => {
      loginButton.style.background = '#0056b3';
    });

    loginButton.addEventListener('mouseleave', () => {
      loginButton.style.background = '#007bff';
    });

    loginButton.addEventListener('click', async () => {
      const username = usernameInput.value;
      const password = passwordInput.value;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        });

        const data = await response.json();
        console.log('Login response:', data);
      } catch (error) {
        console.error('Login error:', error);
      }
    });

    this.formHolder.appendChild(usernameLabel);
    this.formHolder.appendChild(usernameInput);
    this.formHolder.appendChild(passwordLabel);
    this.formHolder.appendChild(passwordInput);
    this.formHolder.appendChild(loginButton);

    return this.formHolder;
  }
}

// Route handling with History API
const routes = {
  '/counter': () => {
    document.title = 'simple counter';
    const container = document.getElementById('container');
    container.innerHTML = '';
    container.appendChild(new TopNavigationBar().render());
    container.appendChild(new Counter().render());
  },
  '/login': () => {
    document.title = 'simple login form';
    const container = document.getElementById('container');
    container.innerHTML = '';
    container.appendChild(new TopNavigationBar().render());
    container.appendChild(new LoginForm().render());
    const div = document.createElement('div');
    div.style.border = '1px silver solid';
    div.textContent = 'this is a log in form generated by AI';
    container.appendChild(div);
  }
};

function navigate(path) {
  if (routes[path]) {
    routes[path]();
    history.pushState(null, '', path);
  } else {
    history.pushState(null, '', '/error');
    window.location.href = '/error';
  }
}

window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  if (routes[path]) {
    routes[path]();
  } else {
    window.location.href = '/error';
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path === '/') {
    document.title = 'Welcome to the portal';
  } else if (routes[path]) {
    routes[path]();
  } else {
    window.location.href = '/error';
  }
});
