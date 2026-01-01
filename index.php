<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>clicking components demo</title>
    <link rel="stylesheet" href="/web.css">
    <style>
        #numbers-list li:hover {
            cursor: pointer;
        }
    </style>
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
                    echo "<li data-number='$number'>odd number $number</li>";
                } else {
                    echo "<li data-number='$number'>even number $number</li>";
                }
            }
            ?>
        </ul>
        <div id="displayer"></div>
        <button id="button1">button 1</button>
    </div>

    <script>
        (function() {
            const numbersList = document.getElementById('numbers-list');
            const displayer = document.getElementById('displayer');
            
            numbersList.addEventListener('click', function(e) {
                if (e.target.tagName === 'LI') {
                    const number = e.target.dataset.number;
                    const isOdd = parseInt(number) % 2 !== 0;
                    displayer.innerHTML = `clicked on ${isOdd ? 'odd' : 'even'} number ${number} in the list`;
                }
            });

            const button1 = document.getElementById('button1');
            let counter = 0;
            
            button1.addEventListener('click', function() {
                counter++;
                displayer.innerHTML = `buton 1 counter ${counter}`;
            });
        })();
    </script>
</body>
</html>
