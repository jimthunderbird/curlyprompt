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
