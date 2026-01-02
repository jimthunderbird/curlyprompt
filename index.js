// Router and State Management
const state = {
    currentRoute: '/',
    components: {}
};

// Component: Navigation
function Navigation() {
    const nav = document.createElement('ul');
    nav.id = 'navigation';
    
    const loginItem = document.createElement('li');
    const loginLink = document.createElement('a');
    loginLink.textContent = 'Login';
    loginLink.href = '/login';
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/login');
    });
    loginItem.appendChild(loginLink);
    
    const helloItem = document.createElement('li');
    const helloLink = document.createElement('a');
    helloLink.textContent = 'Hello';
    helloLink.href = '/hello';
    helloLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/hello');
    });
    helloItem.appendChild(helloLink);
    
    nav.appendChild(loginItem);
    nav.appendChild(helloItem);
    
    return nav;
}

// Component: CounterDisplay
function CounterDisplay() {
    let counter = 0;
    
    const container = document.createElement('div');
    
    const display = document.createElement('div');
    display.id = 'counter-display';
    
    const incrementBtn = document.createElement('button');
    incrementBtn.id = 'counter-increment';
    incrementBtn.textContent = '+';
    
    const decrementBtn = document.createElement('button');
    decrementBtn.id = 'counter-decrement';
    decrementBtn.textContent = '-';
    
    function updateDisplay() {
        display.innerHTML = `the current counter value is ${counter}`;
    }
    
    incrementBtn.addEventListener('click', () => {
        counter += 1;
        updateDisplay();
    });
    
    decrementBtn.addEventListener('click', () => {
        counter -= 1;
        updateDisplay();
    });
    
    updateDisplay();
    
    container.appendChild(display);
    container.appendChild(incrementBtn);
    container.appendChild(decrementBtn);
    
    return container;
}

// Component: LoginForm
function LoginForm() {
    const container = document.createElement('div');
    
    const paragraph = document.createElement('p');
    paragraph.id = 'placeholder';
    paragraph.textContent = 'this is a login form';
    
    container.appendChild(paragraph);
    
    return container;
}

// Route Handlers
const routes = {
    '/hello': () => {
        document.title = 'simple hello';
        const app = document.getElementById('app');
        app.innerHTML = '';
        
        const container = document.createElement('div');
        container.id = 'container';
        
        container.appendChild(CounterDisplay());
        container.appendChild(Navigation());
        
        app.appendChild(container);
    },
    '/login': () => {
        document.title = 'simple hello';
        const app = document.getElementById('app');
        app.innerHTML = '';
        
        const container = document.createElement('div');
        container.id = 'container';
        
        container.appendChild(LoginForm());
        
        const navWrapper = document.createElement('div');
        navWrapper.style.border = '1px solid silver';
        navWrapper.appendChild(Navigation());
        container.appendChild(navWrapper);
        
        app.appendChild(container);
    }
};

// Navigation Function
function navigateTo(path) {
    history.pushState(null, null, path);
    state.currentRoute = path;
    renderRoute(path);
}

// Render Route
function renderRoute(path) {
    const route = routes[path];
    if (route) {
        route();
    } else {
        navigateTo('/hello');
    }
}

// Handle Browser Back/Forward
window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
});

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    renderRoute(path === '/' ? '/hello' : path);
});