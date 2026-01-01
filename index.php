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
                    echo '<li data-number="' . $number . '" data-type="odd">odd number ' . $number . '</li>';
                } else {
                    echo '<li data-number="' . $number . '" data-type="even">even number ' . $number . '</li>';
                }
            }
            ?>
        </ul>
        <div id="displayer"></div>
        <button id="button1">button 1</button>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        {
            const numbersList = document.getElementById('numbers-list');
            let listCounter = 0;

            numbersList.addEventListener('click', function(e) {
                if (e.target.tagName === 'LI') {
                    listCounter++;
                    const number = e.target.getAttribute('data-number');
                    const type = e.target.getAttribute('data-type');
                    document.getElementById('displayer').innerHTML = `clicked on ${type} number ${number} in the list, current counter ${listCounter}`;
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
            let buttonCounter = 0;

            button1.addEventListener('click', function() {
                buttonCounter++;
                document.getElementById('displayer').innerHTML = `button 1 counter ${buttonCounter}`;
            });
        }
    });
    </script>
</body>
</html>