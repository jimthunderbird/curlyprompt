(() => {
    let button1Counter = 0;
    let listCounter = 0;

    document.addEventListener('DOMContentLoaded', () => {
        {
            const button1 = document.getElementById('button1');
            const displayer = document.getElementById('displayer');
            
            button1.addEventListener('click', () => {
                button1Counter++;
                displayer.innerHTML = `buton 1 counter ${button1Counter}`;
            });
        }

        {
            const numbersList = document.getElementById('numbers-list');
            const displayer = document.getElementById('displayer');

            numbersList.addEventListener('click', (e) => {
                if (e.target.tagName === 'LI') {
                    const number = e.target.getAttribute('data-number');
                    listCounter++;
                    displayer.innerHTML = `clicked on odd number ${number} in the list, current counter ${listCounter}`;
                }
            });

            numbersList.addEventListener('mouseover', (e) => {
                if (e.target.tagName === 'LI') {
                    e.target.style.cursor = 'pointer';
                }
            });

            numbersList.addEventListener('mouseout', (e) => {
                if (e.target.tagName === 'LI') {
                    e.target.style.cursor = 'default';
                }
            });
        }
    });
})();