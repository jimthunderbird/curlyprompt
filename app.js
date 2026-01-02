// SPA Application with History API
class SPARouter {
    constructor() {
        this.routes = {};
        this.components = {};
        this.appElement = document.getElementById('app');
        
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => this.handleLinkClick(e));
        
        this.initializeComponents();
        this.initializeRoutes();
        this.handleRoute();
    }
    
    initializeComponents() {
        this.components.Navigation = new NavigationComponent();
        this.components.CounterDisplay = new CounterDisplayComponent();
        this.components.LoginForm = new LoginFormComponent();
    }
    
    initializeRoutes() {
        this.routes['/hello'] = {
            title: 'simple hello',
            render: () => {
                document.title = 'simple hello';
                const container = document.createElement('div');
                container.id = 'container';
                container.appendChild(this.components.CounterDisplay.render());
                container.appendChild(this.components.Navigation.render());
                return container;
            }
        };
        
        this.routes['/login'] = {
            title: 'simple hello',
            render: () => {
                document.title = 'simple hello';
                const container = document.createElement('div');
                container.id = 'container';
                container.appendChild(this.components.LoginForm.render());
                
                const navWrapper = document.createElement('div');
                navWrapper.style.border = '1px solid silver';
                navWrapper.appendChild(this.components.Navigation.render());
                container.appendChild(navWrapper);
                
                return container;
            }
        };
    }
    
    handleLinkClick(e) {
        if (e.target.tagName === 'A' && e.target.dataset.link) {
            e.preventDefault();
            this.navigateTo(e.target.dataset.link);
        }
    }
    
    navigateTo(path) {
        history.pushState(null, null, path);
        this.handleRoute();
    }
    
    handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/hello'];
        
        this.appElement.innerHTML = '';
        this.appElement.appendChild(route.render());
    }
}

class NavigationComponent {
    render() {
        const ul = document.createElement('ul');
        ul.id = 'navigation';
        
        const links = [
            { text: 'Login', url: '/login' },
            { text: 'Hello', url: '/hello' }
        ];
        
        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.text;
            a.dataset.link = link.url;
            li.appendChild(a);
            ul.appendChild(li);
        });
        
        return ul;
    }
}

class CounterDisplayComponent {
    constructor() {
        this.data = { counter: 0 };
    }
    
    render() {
        const wrapper = document.createElement('div');
        
        const display = document.createElement('div');
        display.id = 'counter-display';
        display.textContent = `the current counter value is ${this.data.counter}`;
        
        const incrementBtn = document.createElement('button');
        incrementBtn.id = 'counter-increment';
        incrementBtn.textContent = '+';
        incrementBtn.onclick = () => {
            this.data.counter++;
            display.textContent = `the current counter value is ${this.data.counter}`;
        };
        
        const decrementBtn = document.createElement('button');
        decrementBtn.id = 'counter-decrement';
        decrementBtn.textContent = '-';
        decrementBtn.onclick = () => {
            this.data.counter--;
            display.textContent = `the current counter value is ${this.data.counter}`;
        };
        
        wrapper.appendChild(display);
        wrapper.appendChild(incrementBtn);
        wrapper.appendChild(decrementBtn);
        
        return wrapper;
    }
}

class LoginFormComponent {
    render() {
        const holder = document.createElement('div');
        holder.id = 'login-form-holder';
        
        const title = document.createElement('h2');
        title.textContent = 'Login';
        
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.placeholder = 'Username';
        usernameInput.id = 'username';
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Password';
        passwordInput.id = 'password';
        
        const loginBtn = document.createElement('button');
        loginBtn.textContent = 'Login';
        loginBtn.onclick = async () => {
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
        };
        
        holder.appendChild(title);
        holder.appendChild(usernameInput);
        holder.appendChild(passwordInput);
        holder.appendChild(loginBtn);
        
        return holder;
    }
}

// Initialize the application
new SPARouter();
