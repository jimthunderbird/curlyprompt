<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>clicking components demo</title>
    <link rel="stylesheet" href="/web.css">
</head>
<body>
    <div id="container">
        <ul id="numbers-list">
            <?php
            $numbers = [];
            for ($i = 0; $i < 15; $i++) {
                $numbers[] = rand(1, 150);
            }
            foreach ($numbers as $number) {
                if ($number % 2 !== 0) {
                    echo "<li data-number=\"$number\">odd number $number</li>";
                } else {
                    echo "<li data-number=\"$number\">even number $number</li>";
                }
            }
            ?>
        </ul>
        <div id="displayer"></div>
        <button id="button1">button 1</button>
    </div>

    <script>
    {
        const numbersList = document.getElementById('numbers-list');
        let numbersListCounter = 0;

        numbersList.addEventListener('click', function(e) {
            if (e.target.tagName === 'LI') {
                numbersListCounter++;
                const number = e.target.getAttribute('data-number');
                const displayer = document.getElementById('displayer');
                displayer.innerHTML = `clicked on odd number ${number} in the list, current counter ${numbersListCounter}`;
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

    {
        const button1 = document.getElementById('button1');
        let button1Counter = 0;

        button1.addEventListener('click', function() {
            button1Counter++;
            const displayer = document.getElementById('displayer');
            displayer.innerHTML = `buton 1 counter ${button1Counter}`;
        });
    }
    </script>
</body>
</html>