(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        {
            const button1 = document.getElementById('button1');
            let button1Counter = 0;
            const displayer = document.getElementById('displayer');
            
            if (button1) {
                button1.addEventListener('click', function() {
                    button1Counter++;
                    displayer.innerHTML = `button 1 counter ${button1Counter}`;
                });
            }
        }
        
        {
            const numbersList = document.getElementById('numbers-list');
            let listCounter = 0;
            const displayer = document.getElementById('displayer');
            
            if (numbersList) {
                numbersList.addEventListener('click', function(event) {
                    if (event.target.tagName === 'LI') {
                        listCounter++;
                        const number = event.target.getAttribute('data-number');
                        const type = event.target.getAttribute('data-type');
                        displayer.innerHTML = `clicked on ${type} number ${number} in the list, current counter ${listCounter}`;
                    }
                });
                
                numbersList.addEventListener('mouseover', function(event) {
                    if (event.target.tagName === 'LI') {
                        event.target.style.cursor = 'pointer';
                    }
                });
                
                numbersList.addEventListener('mouseout', function(event) {
                    if (event.target.tagName === 'LI') {
                        event.target.style.cursor = 'default';
                    }
                });
            }
        }
    });
})();