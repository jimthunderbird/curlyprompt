
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

  updateDOM() {
    const usernameInput = this.element?.querySelector('#username-input');
    const passwordInput = this.element?.querySelector('#password-input');
    if (usernameInput && usernameInput.value !== this.data.username) {
      usernameInput.value = this.data.username;
    }
    if (passwordInput && passwordInput.value !== this.data.password) {
      passwordInput.value = this.data.password;
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
    const holder = document.createElement('div');
    holder.id = 'login-form-holder';
    
    const style = document.createElement('style');
    style.textContent = `
      #login-form-holder {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #e0e5ec;
        font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .login-form-container {
        background: #e0e5ec;
        padding: 60px 50px;
        border-radius: 30px;
        box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #ffffff;
        width: 350px;
      }
      
      .login-form-title {
        text-align: center;
        font-size: 32px;
        font-weight: 700;
        color: #1e3a8a;
        margin-bottom: 40px;
        letter-spacing: 1px;
      }
      
      .form-group {
        margin-bottom: 30px;
      }
      
      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #5a5a5a;
        margin-bottom: 10px;
        letter-spacing: 0.5px;
      }
      
      .form-input {
        width: 100%;
        padding: 15px 20px;
        border: none;
        outline: none;
        background: #e0e5ec;
        border-radius: 25px;
        box-shadow: inset 6px 6px 10px #cbced1, inset -6px -6px 10px #ffffff;
        font-size: 15px;
        font-weight: 500;
        color: #3a3a3a;
        font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-sizing: border-box;
      }
      
      .form-input::placeholder {
        color: #a0a0a0;
        font-weight: 400;
      }
      
      .form-input:focus {
        box-shadow: inset 4px 4px 8px #cbced1, inset -4px -4px 8px #ffffff;
      }
      
      #login-button {
        width: 100%;
        padding: 15px;
        border: none;
        outline: none;
        background: #1e3a8a;
        color: #ffffff;
        font-size: 16px;
        font-weight: 700;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 6px 6px 12px #cbced1, -6px -6px 12px #ffffff;
        transition: all 0.3s ease;
        font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        letter-spacing: 1px;
        margin-top: 10px;
      }
      
      #login-button:hover {
        background: #2563eb;
        box-shadow: 4px 4px 10px #cbced1, -4px -4px 10px #ffffff;
      }
      
      #login-button:active {
        box-shadow: inset 4px 4px 8px #cbced1, inset -4px -4px 8px #ffffff;
      }
    `;
    
    holder.appendChild(style);
    
    const container = document.createElement('div');
    container.className = 'login-form-container';
    
    const title = document.createElement('div');
    title.className = 'login-form-title';
    title.textContent = 'Login';
    container.appendChild(title);
    
    const usernameGroup = document.createElement('div');
    usernameGroup.className = 'form-group';
    
    const usernameLabel = document.createElement('label');
    usernameLabel.className = 'form-label';
    usernameLabel.textContent = 'Enter Username';
    usernameLabel.htmlFor = 'username-input';
    
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username-input';
    usernameInput.className = 'form-input';
    usernameInput.placeholder = 'Username';
    usernameInput.addEventListener('input', (e) => {
      this.data.username = e.target.value;
    });
    
    usernameGroup.appendChild(usernameLabel);
    usernameGroup.appendChild(usernameInput);
    container.appendChild(usernameGroup);
    
    const passwordGroup = document.createElement('div');
    passwordGroup.className = 'form-group';
    
    const passwordLabel = document.createElement('label');
    passwordLabel.className = 'form-label';
    passwordLabel.textContent = 'Enter Password';
    passwordLabel.htmlFor = 'password-input';
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password-input';
    passwordInput.className = 'form-input';
    passwordInput.placeholder = 'Password';
    passwordInput.addEventListener('input', (e) => {
      this.data.password = e.target.value;
    });
    
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    container.appendChild(passwordGroup);
    
    const loginButton = document.createElement('button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.addEventListener('click', () => {
      this.handleLogin();
    });
    container.appendChild(loginButton);
    
    holder.appendChild(container);
    
    this.element = holder;
    return holder;
  }
}
