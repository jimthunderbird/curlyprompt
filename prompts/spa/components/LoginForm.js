components["LoginForm"] = class {
  constructor() {
    this.data = new Proxy(
      {
        username: "",
        password: "",
        error: ""
      },
      {
        set: (target, property, value) => {
          target[property] = value;
          this.updateDOM();
          return true;
        }
      }
    );
    this.container = null;
  }

  render() {
    const holder = document.createElement("div");
    holder.id = "login-form-holder";
    
    const style = document.createElement("style");
    style.textContent = `
      #login-form-holder {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #fffacd 0%, #fef9e7 100%);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .login-form-container {
        background: white;
        padding: 60px 50px;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
      }
      
      .login-form-container h2 {
        text-align: center;
        margin-bottom: 40px;
        color: #333;
        font-weight: 300;
        font-size: 28px;
        letter-spacing: 1px;
      }
      
      .form-group {
        margin-bottom: 30px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 10px;
        color: #666;
        font-size: 13px;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .form-group input {
        width: 100%;
        padding: 15px 0;
        border: none;
        border-bottom: 2px solid #e0e0e0;
        font-size: 16px;
        color: #333;
        background: transparent;
        transition: border-color 0.3s;
        box-sizing: border-box;
      }
      
      .form-group input:focus {
        outline: none;
        border-bottom-color: #4CAF50;
      }
      
      #login-button {
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        margin-top: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      #login-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
      }
      
      #login-button:active {
        transform: translateY(0);
      }
      
      .error-message {
        color: #f44336;
        font-size: 13px;
        margin-top: 10px;
        text-align: center;
      }
    `;
    
    holder.appendChild(style);
    
    const formContainer = document.createElement("div");
    formContainer.className = "login-form-container";
    
    const title = document.createElement("h2");
    title.textContent = "Sign In";
    formContainer.appendChild(title);
    
    // Username field
    const usernameGroup = document.createElement("div");
    usernameGroup.className = "form-group";
    
    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "Enter Username";
    usernameLabel.setAttribute("for", "username-input");
    
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.id = "username-input";
    usernameInput.addEventListener("input", (e) => {
      this.data.username = e.target.value;
    });
    
    usernameGroup.appendChild(usernameLabel);
    usernameGroup.appendChild(usernameInput);
    formContainer.appendChild(usernameGroup);
    
    // Password field
    const passwordGroup = document.createElement("div");
    passwordGroup.className = "form-group";
    
    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Enter Password";
    passwordLabel.setAttribute("for", "password-input");
    
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password-input";
    passwordInput.addEventListener("input", (e) => {
      this.data.password = e.target.value;
    });
    
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    formContainer.appendChild(passwordGroup);
    
    // Login button
    const loginButton = document.createElement("button");
    loginButton.id = "login-button";
    loginButton.textContent = "Login";
    loginButton.addEventListener("click", async () => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: this.data.username,
            password: this.data.password
          })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          this.data.error = "";
          console.log("Login successful", result);
        } else {
          this.data.error = result.message || "Login failed";
        }
      } catch (error) {
        this.data.error = "Network error. Please try again.";
        console.error("Login error:", error);
      }
    });
    
    formContainer.appendChild(loginButton);
    
    // Error message
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    formContainer.appendChild(errorMessage);
    
    holder.appendChild(formContainer);
    
    this.container = holder;
    return holder;
  }
  
  updateDOM() {
    if (this.container) {
      const errorMessage = this.container.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.textContent = this.data.error;
      }
    }
  }
};
