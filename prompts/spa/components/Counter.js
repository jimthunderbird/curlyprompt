class Counter {
  constructor() {
    this.data = {
      counter: 0
    };
  }

  render() {
    const container = document.createElement('div');
    
    const counterDisplay = document.createElement('div');
    counterDisplay.id = 'counter-display';
    counterDisplay.innerHTML = `the current counter value is ${this.data.counter}`;
    
    const incrementButton = document.createElement('button');
    incrementButton.id = 'counter-increment';
    incrementButton.textContent = '+';
    incrementButton.addEventListener('click', () => {
      this.data.counter += 1;
      counterDisplay.innerHTML = `the current counter value is ${this.data.counter}`;
    });
    
    const decrementButton = document.createElement('button');
    decrementButton.id = 'counter-decrement';
    decrementButton.textContent = '-';
    decrementButton.addEventListener('click', () => {
      this.data.counter -= 1;
      counterDisplay.innerHTML = `the current counter value is ${this.data.counter}`;
    });
    
    container.appendChild(counterDisplay);
    container.appendChild(incrementButton);
    container.appendChild(decrementButton);
    
    return container;
  }
}
