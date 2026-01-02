class SPARouter {
    constructor() {
        this.routes = {};
        this.components = {};
        this.appElement = document.getElementById('app');
        this.initializeComponents();
        this.initializeRoutes();
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.getAttribute('href'));
            }
        });
        this.handleRoute();
    }

    navigateTo(url) {
        history.pushState(null, null, url);
        this.handleRoute();
    }

    initializeComponents() {
        this.components.Navigation = () => {
            const nav = document.createElement('ul');
            nav.id = 'navigation';
            
            const loginLi = document.createElement('li');
            const loginLink = document.createElement('a');
            loginLink.href = '/login';
            loginLink.textContent = 'Login';
            loginLink.setAttribute('data-link', '');
            loginLi.appendChild(loginLink);
            
            const helloLi = document.createElement('li');
            const helloLink = document.createElement('a');
            helloLink.href = '/hello';
            helloLink.textContent = 'Hello';
            helloLink.setAttribute('data-link', '');
            helloLi.appendChild(helloLink);
            
            nav.appendChild(loginLi);
            nav.appendChild(helloLi);
            
            return nav;
        };

        this.components.CounterDisplay = () => {
            const container = document.createElement('div');
            let counter = 0;

            const display = document.createElement('div');
            display.id = 'counter-display';
            
            const incrementBtn = document.createElement('button');
            incrementBtn.id = 'counter-increment';
            incrementBtn.textContent = '+';
            
            const decrementBtn = document.createElement('button');
            decrementBtn.id = 'counter-decrement';
            decrementBtn.textContent = '-';

            const updateDisplay = () => {
                display.innerHTML = `the current counter value is ${counter}`;
            };

            incrementBtn.addEventListener('click', () => {
                counter++;
                updateDisplay();
            });

            decrementBtn.addEventListener('click', () => {
                counter--;
                updateDisplay();
            });

            updateDisplay();
            container.appendChild(display);
            container.appendChild(incrementBtn);
            container.appendChild(decrementBtn);

            return container;
        };

        this.components.LoginForm = () => {
            const holder = document.createElement('div');
            holder.id = 'login-form-holder';

            const usernameLabel = document.createElement('label');
            usernameLabel.textContent = 'Enter Username';
            const usernameInput = document.createElement('input');
            usernameInput.type = 'text';
            usernameInput.id = 'username';

            const passwordLabel = document.createElement('label');
            passwordLabel.textContent = 'Enter Password';
            const passwordInput = document.createElement('input');
            passwordInput.type = 'password';
            passwordInput.id = 'password';

            const loginButton = document.createElement('button');
            loginButton.id = 'login-button';
            loginButton.textContent = 'Login';
            loginButton.addEventListener('click', async () => {
                const payload = {
                    username: usernameInput.value,
                    password: passwordInput.value
                };
                
                try {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();
                    console.log('Login response:', data);
                } catch (error) {
                    console.error('Login error:', error);
                }
            });

            holder.appendChild(usernameLabel);
            holder.appendChild(usernameInput);
            holder.appendChild(passwordLabel);
            holder.appendChild(passwordInput);
            holder.appendChild(loginButton);

            return holder;
        };
    }

    initializeRoutes() {
        this.routes['/hello'] = {
            title: 'simple hello',
            render: () => {
                const container = document.createElement('div');
                container.id = 'container';
                container.appendChild(this.components.CounterDisplay());
                container.appendChild(this.components.Navigation());
                return container;
            }
        };

        this.routes['/login'] = {
            title: 'simple hello',
            render: () => {
                const container = document.createElement('div');
                container.id = 'container';
                
                container.appendChild(this.components.LoginForm());
                
                const navWrapper = document.createElement('div');
                navWrapper.style.border = '1px silver solid';
                navWrapper.appendChild(this.components.Navigation());
                container.appendChild(navWrapper);
                
                return container;
            }
        };
    }

    handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/hello'];
        
        document.title = route.title;
        this.appElement.innerHTML = '';
        this.appElement.appendChild(route.render());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SPARouter();
});