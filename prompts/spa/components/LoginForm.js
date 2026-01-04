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
