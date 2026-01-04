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