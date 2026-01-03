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

class About {
  constructor() {
    this.element = null;
  }

  render() {
    this.element = document.createElement('div');
    
    const p = document.createElement('p');
    p.textContent = 'About US';
    
    this.element.appendChild(p);
    
    return this.element;
  }
}

class UserProfile {
  constructor(id) {
    this.id = id;
  }

  render() {
    const div = document.createElement('div');
    div.id = 'user-profile';
    div.textContent = `This is the user profile for user with id ${this.id}`;
    return div;
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
    this.formHolder.style.cssText = 'background: lightyellow; padding: 40px; border-radius: 8px; max-width: 400px; margin: 50px auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1);';
    
    const title = document.createElement('h2');
    title.textContent = 'Login';
    title.style.cssText = 'text-align: center; margin-bottom: 30px; color: #333;';
    this.formHolder.appendChild(title);
    
    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Enter Username';
    usernameLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: 600; color: #555;';
    this.formHolder.appendChild(usernameLabel);
    
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username-input';
    usernameInput.style.cssText = 'width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 14px;';
    this.formHolder.appendChild(usernameInput);
    
    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Enter Password';
    passwordLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: 600; color: #555;';
    this.formHolder.appendChild(passwordLabel);
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password-input';
    passwordInput.style.cssText = 'width: 100%; padding: 12px; margin-bottom: 30px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 14px;';
    this.formHolder.appendChild(passwordInput);
    
    const loginButton = document.createElement('button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.style.cssText = 'width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.3s;';
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
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        console.log('Login response:', data);
      } catch (error) {
        console.error('Login error:', error);
      }
    });
    this.formHolder.appendChild(loginButton);
    
    return this.formHolder;
  }
}

class Error {
  constructor() {
    this.element = null;
  }

  render() {
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.textContent = 'Page Not Found';
    
    this.element = errorMessage;
    return this.element;
  }
}


const routes = {
  '/': () => { window.history.pushState({}, '', '/about'); route(); },
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
  },
  '/about': () => {
    document.title = 'about';
    const container = document.getElementById('container');
    container.innerHTML = '';
    container.appendChild(new About().render());
  },
  '/error': () => {
    document.title = 'error';
    const container = document.getElementById('container');
    container.innerHTML = '';
    container.appendChild(new Error().render());
  }
};

function route() {
  const path = window.location.pathname;
  const userProfileMatch = path.match(/^\/user\/([^\/]+)\/profile$/);
  
  if (userProfileMatch) {
    document.title = 'user profile';
    const container = document.getElementById('container');
    container.innerHTML = '';
    container.appendChild(new UserProfile(userProfileMatch[1]).render());
  } else if (routes[path]) {
    routes[path]();
  } else {
    window.history.pushState({}, '', '/error');
    route();
  }
}

window.addEventListener('popstate', route);
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      window.history.pushState({}, '', e.target.href);
      route();
    }
  });
  route();
});
