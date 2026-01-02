// Application state
const state = {
    counter: 0
};

// Component: Navigation
function Navigation() {
    return `
        <ul id="navigation">
            <li><a href="/login" data-link>Login</a></li>
            <li><a href="/hello" data-link>Hello</a></li>
        </ul>
    `;
}

// Component: CounterDisplay
function CounterDisplay() {
    const html = `
        <div>
            <div id="counter-display">the current counter value is ${state.counter}</div>
            <button id="counter-increment">+</button>
            <button id="counter-decrement">-</button>
        </div>
    `;
    return html;
}

// Component: LoginForm
function LoginForm() {
    return `
        <div class="login-form-container">
            <h2>Login</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="login-button">Login</button>
            </form>
        </div>
    `;
}

// Routes configuration
const routes = {
    '/hello': {
        title: 'simple hello',
        render: () => {
            document.title = 'simple hello';
            return `
                <div id="container">
                    ${CounterDisplay()}
                    ${Navigation()}
                </div>
            `;
        }
    },
    '/login': {
        title: 'simple hello',
        render: () => {
            document.title = 'simple hello';
            return `
                <div id="container">
                    ${LoginForm()}
                    <div style="border: 1px silver solid; padding: 10px; margin-top: 20px;">
                        ${Navigation()}
                    </div>
                </div>
            `;
        }
    }
};

// Router function
function router() {
    const path = window.location.pathname;
    const route = routes[path] || routes['/hello'];

    const app = document.getElementById('app');
    app.innerHTML = route.render();

    attachEventListeners();
}

// Attach event listeners for dynamic elements
function attachEventListeners() {
    // Counter increment button
    const incrementBtn = document.getElementById('counter-increment');
    if (incrementBtn) {
        incrementBtn.addEventListener('click', () => {
            state.counter++;
            router();
        });
    }

    // Counter decrement button
    const decrementBtn = document.getElementById('counter-decrement');
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
                alert('Login request sent!');
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed: ' + error.message);
            }
        });
    }

    // Navigation links
    document.querySelectorAll('a[data-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.target.getAttribute('href');
            history.pushState(null, null, path);
            router();
        });
    });
}

// Handle browser back/forward buttons
window.addEventListener('popstate', router);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial route if at root
    if (window.location.pathname === '/') {
        history.replaceState(null, null, '/hello');
    }
    router();
});
