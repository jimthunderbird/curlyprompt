class Error {
  constructor() {
    this.element = null;
  }

  render() {
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.textContent = 'Page Not Found';
    
    this.element = errorMessage;
    return this.element;
  }
}
