document.addEventListener('DOMContentLoaded', function() {
    {
        const button1 = document.getElementById('button1');
        let button1Counter = 0;
        const displayer = document.getElementById('displayer');

        if (button1) {
            button1.addEventListener('click', function() {
                button1Counter++;
                displayer.innerHTML = 'buton 1 counter ' + button1Counter;
            });
        }
    }

    {
        const numbersList = document.getElementById('numbers-list');
        let listCounter = 0;
        const displayer = document.getElementById('displayer');

        if (numbersList) {
            numbersList.addEventListener('click', function(e) {
                if (e.target && e.target.nodeName === 'LI') {
                    const number = e.target.getAttribute('data-number');
                    const type = e.target.getAttribute('data-type');
                    listCounter++;
                    displayer.innerHTML = 'clicked on ' + type + ' number ' + number + ' in the list, current counter ' + listCounter;
                }
            });

            numbersList.addEventListener('mouseover', function(e) {
                if (e.target && e.target.nodeName === 'LI') {
                    e.target.style.cursor = 'pointer';
                }
            });

            numbersList.addEventListener('mouseout', function(e) {
                if (e.target && e.target.nodeName === 'LI') {
                    e.target.style.cursor = 'default';
                }
            });
        }
    }
});