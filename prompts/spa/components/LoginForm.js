class LoginForm {
  constructor() {
    this.formHolder = null;
  }

  render() {
    this.formHolder = document.createElement('div');
    this.formHolder.id = 'login-form-holder';
    
    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Enter Username';
    usernameLabel.htmlFor = 'username-input';
    
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username-input';
    usernameInput.name = 'username';
    
    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Enter Password';
    passwordLabel.htmlFor = 'password-input';
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password-input';
    passwordInput.name = 'password';
    
    const loginButton = document.createElement('button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'Login';
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
