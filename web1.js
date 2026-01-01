document.addEventListener('DOMContentLoaded', function() {
    {
        const button1 = document.getElementById('button1');
        let button1Counter = 0;
        const displayer = document.getElementById('displayer');
        
        button1.addEventListener('click', function() {
            button1Counter++;
            displayer.innerHTML = `buton 1 counter ${button1Counter}`;
        });
    }
    
    {
        const numbersList = document.getElementById('numbers-list');
        const displayer = document.getElementById('displayer');
        let listCounter = 0;
        
        numbersList.addEventListener('click', function(e) {
            if (e.target.tagName === 'LI') {
                listCounter++;
                const number = e.target.getAttribute('data-number');
                displayer.innerHTML = `clicked on odd number ${number} in the list, current counter ${listCounter}`;
            }
        });
        
        numbersList.addEventListener('mouseover', function(e) {
            if (e.target.tagName === 'LI') {
                e.target.style.cursor = 'pointer';
            }
        });
        
        numbersList.addEventListener('mouseout', function(e) {
            if (e.target.tagName === 'LI') {
                e.target.style.cursor = 'default';
            }
        });
    }
});