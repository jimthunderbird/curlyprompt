class TopNavigationBar {
  constructor() {
    this.links = [
      { text: 'About', url: '/about' },
      { text: 'Login', url: '/login' }
    ];
  }

  render() {
    const nav = document.createElement('nav');
    nav.className = 'top-navigation-bar';
    
    this.links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.text;
      nav.appendChild(a);
    });
    
    return nav;
  }
}
