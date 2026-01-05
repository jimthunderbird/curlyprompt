components["LoginForm"] = class {
  constructor() {
    this.data = new Proxy(
      {
        username: "",
        password: "",
        errorMessage: ""
      },
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
    const errorDiv = document.querySelector("#error-messages");
    const usernameInput = document.querySelector("#username-input");
    const passwordInput = document.querySelector("#password-input");
    
    if (errorDiv) errorDiv.textContent = this.data.errorMessage;
    if (usernameInput) usernameInput.value = this.data.username;
    if (passwordInput) passwordInput.value = this.data.password;
  }

  async handleLogin() {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.data.username,
          password: this.data.password
        })
      });
      
      const result = await response.json();
      
      if (result.success !== 1) {
        this.data.errorMessage = "Error logging in user";
        this.data.username = "your user name ...";
        this.data.password = "";
        setTimeout(() => document.querySelector("#username-input")?.focus(), 0);
      }
    } catch (error) {
      this.data.errorMessage = "Error logging in user";
      this.data.username = "your user name ...";
      this.data.password = "";
      setTimeout(() => document.querySelector("#username-input")?.focus(), 0);
    }
  }

  render() {
    const container = document.createElement("div");
    container.id = "login-form-holder";
    
    container.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        #login-form-holder {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #e0e5ec;
          font-family: 'Poppins', 'Segoe UI', Tahoma, sans-serif;
          position: fixed;
          top: 0;
          left: 0;
        }
        
        .form-wrapper {
          background: #e0e5ec;
          padding: 60px 50px;
          border-radius: 30px;
          box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #ffffff;
          width: 400px;
        }
        
        .form-title {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
          color: #5a5a5a;
          margin-bottom: 40px;
          letter-spacing: 1px;
        }
        
        #error-messages {
          color: #e74c3c;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
          margin-bottom: 20px;
          min-height: 20px;
        }
        
        .input-group {
          margin-bottom: 30px;
        }
        
        .input-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #6a6a6a;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }
        
        .input-group input {
          width: 100%;
          padding: 15px 20px;
          border: none;
          outline: none;
          background: #e0e5ec;
          border-radius: 25px;
          box-shadow: inset 6px 6px 10px #cbced1, inset -6px -6px 10px #ffffff;
          font-size: 15px;
          font-weight: 500;
          color: #5a5a5a;
          font-family: 'Poppins', 'Segoe UI', Tahoma, sans-serif;
          transition: all 0.3s ease;
        }
        
        .input-group input::placeholder {
          color: #a3a3a3;
          font-weight: 400;
        }
        
        .input-group input:focus {
          box-shadow: inset 4px 4px 8px #cbced1, inset -4px -4px 8px #ffffff;
        }
        
        #login-button {
          width: 100%;
          padding: 15px;
          margin-top: 20px;
          border: none;
          outline: none;
          background: #e0e5ec;
          border-radius: 25px;
          box-shadow: 6px 6px 12px #cbced1, -6px -6px 12px #ffffff;
          font-size: 16px;
          font-weight: 700;
          color: #5a5a5a;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', 'Segoe UI', Tahoma, sans-serif;
          letter-spacing: 1px;
        }
        
        #login-button:hover {
          box-shadow: 4px 4px 8px #cbced1, -4px -4px 8px #ffffff;
        }
        
        #login-button:active {
          box-shadow: inset 6px 6px 12px #cbced1, inset -6px -6px 12px #ffffff;
        }
      </style>
      
      <div class="form-wrapper">
        <div class="form-title">Login</div>
        <div id="error-messages"></div>
        
        <div class="input-group">
          <label for="username-input">Enter Username</label>
          <input 
            type="text" 
            id="username-input" 
            placeholder="your username"
          />
        </div>
        
        <div class="input-group">
          <label for="password-input">Enter Password</label>
          <input 
            type="password" 
            id="password-input" 
            placeholder="your password"
          />
        </div>
        
        <button id="login-button">Login</button>
      </div>
    `;
    
    setTimeout(() => {
      const usernameInput = container.querySelector("#username-input");
      const passwordInput = container.querySelector("#password-input");
      const loginButton = container.querySelector("#login-button");
      
      usernameInput?.addEventListener("input", (e) => {
        this.data.username = e.target.value;
      });
      
      usernameInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          passwordInput?.focus();
        }
      });
      
      passwordInput?.addEventListener("input", (e) => {
        this.data.password = e.target.value;
      });
      
      passwordInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          loginButton?.click();
        }
      });
      
      loginButton?.addEventListener("click", () => {
        this.handleLogin();
      });
    }, 0);
    
    return container;
  }
};