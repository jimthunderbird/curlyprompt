// Application state
const state = {
    counter: 0
};

// Components
const components = {
    Navigation: () => {
        return `
            <ul id="navigation">
                <li><a href="/login" data-link>Login</a></li>
                <li><a href="/hello" data-link>Hello</a></li>
            </ul>
        `;
    },

    CounterDisplay: () => {
        return `
            <div>
                <div id="counter-display">the current counter value is ${state.counter}</div>
                <button id="counter-increment">+</button>
                <button id="counter-decrement">-</button>
            </div>
        `;
    },

    LoginForm: () => {
        return `
            <div id="login-form-holder">
                <form id="login-form">
                    <div>
                        <label for="username">Enter Username</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div>
                        <label for="password">Enter Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        `;
    }
};

// Routes
const routes = {
    '/hello': {
        title: 'simple hello',
        render: () => {
            document.title = 'simple hello';
            const container = document.createElement('div');
            container.id = 'container';
            container.innerHTML = components.CounterDisplay() + components.Navigation();
            return container;
        }
    },
    '/login': {
        title: 'simple hello',
        render: () => {
            document.title = 'simple hello';
            const container = document.createElement('div');
            container.id = 'container';
            
            const navWrapper = document.createElement('div');
            navWrapper.style.border = '1px solid silver';
            navWrapper.innerHTML = components.Navigation();
            
            container.innerHTML = components.LoginForm();
            container.appendChild(navWrapper);
            return container;
        }
    }
};

// Router
function router() {
    const path = window.location.pathname;
    const route = routes[path] || routes['/hello'];
    
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(route.render());
    
    attachEventHandlers();
}

// Attach event handlers
function attachEventHandlers() {
    // Navigation links
    document.querySelectorAll('a[data-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            history.pushState(null, null, href);
            router();
        });
    });

    // Counter buttons
    const incrementBtn = document.getElementById('counter-increment');
    const decrementBtn = document.getElementById('counter-decrement');
    
    if (incrementBtn) {
        incrementBtn.addEventListener('click', () => {
            state.counter++;
            router();
        });
    }
    
    if (decrementBtn) {
        decrementBtn.addEventListener('click', () => {
            state.counter--;
            router();
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
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
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', router);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    router();
});
