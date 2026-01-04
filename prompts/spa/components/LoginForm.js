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
          this.updateDOM(property, value);
          return true;
        }
      }
    );
    this.elements = {};
  }

  updateDOM(property, value) {
    if (property === "username" && this.elements.usernameInput) {
      this.elements.usernameInput.value = value;
    } else if (property === "password" && this.elements.passwordInput) {
      this.elements.passwordInput.value = value;
    } else if (property === "errorMessage" && this.elements.errorMessages) {
      this.elements.errorMessages.textContent = value;
    }
  }

  async handleLogin() {
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

      if (result.success !== 1) {
        this.data.errorMessage = "Error logging in user";
        this.data.username = "your user name ...";
        this.data.password = "";
        this.elements.usernameInput.focus();
      }
    } catch (error) {
      this.data.errorMessage = "Error logging in user";
      this.data.username = "your user name ...";
      this.data.password = "";
      this.elements.usernameInput.focus();
    }
  }

  render() {
    const container = document.createElement("div");
    container.id = "login-form-holder";
    container.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      width: 100vw;
      background: #e0e5ec;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      position: fixed;
      top: 0;
      left: 0;
    `;

    const formWrapper = document.createElement("div");
    formWrapper.style.cssText = `
      background: #e0e5ec;
      padding: 60px 50px;
      border-radius: 30px;
      box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #ffffff;
      min-width: 380px;
    `;

    const errorMessages = document.createElement("div");
    errorMessages.id = "error-messages";
    errorMessages.style.cssText = `
      color: #ff6b6b;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 20px;
      min-height: 20px;
      text-align: center;
    `;
    this.elements.errorMessages = errorMessages;

    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "Enter Username";
    usernameLabel.style.cssText = `
      display: block;
      font-size: 15px;
      font-weight: 600;
      color: #555;
      margin-bottom: 10px;
    `;

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.placeholder = "your username";
    usernameInput.style.cssText = `
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 15px;
      background: #e0e5ec;
      box-shadow: inset 6px 6px 10px #cbced1, inset -6px -6px 10px #ffffff;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      outline: none;
      margin-bottom: 30px;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
    `;
    usernameInput.addEventListener("input", (e) => {
      this.data.username = e.target.value;
    });
    usernameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.elements.passwordInput.focus();
      }
    });
    this.elements.usernameInput = usernameInput;

    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Enter Password";
    passwordLabel.style.cssText = `
      display: block;
      font-size: 15px;
      font-weight: 600;
      color: #555;
      margin-bottom: 10px;
    `;

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "your password";
    passwordInput.style.cssText = `
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 15px;
      background: #e0e5ec;
      box-shadow: inset 6px 6px 10px #cbced1, inset -6px -6px 10px #ffffff;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      outline: none;
      margin-bottom: 30px;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
    `;
    passwordInput.addEventListener("input", (e) => {
      this.data.password = e.target.value;
    });
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.elements.loginButton.click();
      }
    });
    this.elements.passwordInput = passwordInput;

    const loginButton = document.createElement("button");
    loginButton.id = "login-button";
    loginButton.textContent = "Login";
    loginButton.style.cssText = `
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 15px;
      background: #e0e5ec;
      box-shadow: 6px 6px 10px #cbced1, -6px -6px 10px #ffffff;
      font-size: 16px;
      font-weight: 700;
      color: #555;
      cursor: pointer;
      outline: none;
      font-family: 'Poppins', sans-serif;
      transition: all 0.3s ease;
    `;
    loginButton.addEventListener("mousedown", (e) => {
      e.target.style.boxShadow = "inset 6px 6px 10px #cbced1, inset -6px -6px 10px #ffffff";
    });
    loginButton.addEventListener("mouseup", (e) => {
      e.target.style.boxShadow = "6px 6px 10px #cbced1, -6px -6px 10px #ffffff";
    });
    loginButton.addEventListener("click", () => {
      this.handleLogin();
    });
    this.elements.loginButton = loginButton;

    formWrapper.appendChild(errorMessages);
    formWrapper.appendChild(usernameLabel);
    formWrapper.appendChild(usernameInput);
    formWrapper.appendChild(passwordLabel);
    formWrapper.appendChild(passwordInput);
    formWrapper.appendChild(loginButton);

    container.appendChild(formWrapper);

    return container;
  }
};
