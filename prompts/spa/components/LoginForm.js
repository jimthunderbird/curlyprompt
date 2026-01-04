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
