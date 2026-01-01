<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>clicking components demo</title>
    <link rel="stylesheet" href="/web.css">
</head>
<body>
    <?php
    $numbers = [];
    for ($i = 0; $i < 5; $i++) {
        $numbers[] = rand(1, 100);
    }
    ?>
    
    <div id="container">
        <ul id="numbers-list">
            <?php foreach ($numbers as $number): ?>
                <?php if ($number % 2 != 0): ?>
                    <li data-number="<?php echo $number; ?>">odd number <?php echo $number; ?></li>
                <?php else: ?>
                    <li data-number="<?php echo $number; ?>">even number <?php echo $number; ?></li>
                <?php endif; ?>
            <?php endforeach; ?>
        </ul>
        
        <div id="displayer"></div>
        
        <button id="button1">button 1</button>
        <button id="button2">button 2</button>
        <button id="button3">button 3</button>
        
        <p id="paragraph1">paragraph 1</p>
    </div>
    
    <script>
    (function() {
        const numbersListItems = document.querySelectorAll('#numbers-list li');
        numbersListItems.forEach(function(li) {
            li.addEventListener('click', function() {
                const number = this.getAttribute('data-number');
                const isOdd = parseInt(number) % 2 !== 0;
                const oddEven = isOdd ? 'odd' : 'even';
                document.querySelector('#displayer').innerHTML = `clicked on ${oddEven} number ${number} in the list`;
            });
        });
        
        const button1 = document.querySelector('#button1');
        let button1Counter = 0;
        button1.addEventListener('click', function() {
            button1Counter += 1;
            document.querySelector('#displayer').innerHTML = `buton 1 counter ${button1Counter}`;
        });
        
        const button2 = document.querySelector('#button2');
        let button2Counter = 0;
        button2.addEventListener('click', function() {
            button2Counter += 1;
            document.querySelector('#displayer').innerHTML = `buton 2 counter ${button2Counter}`;
        });
        
        const button3 = document.querySelector('#button3');
        let button3Counter = 0;
        button3.addEventListener('click', function() {
            button3Counter += 1;
            document.querySelector('#displayer').innerHTML = `buton 3 counter ${button3Counter}`;
        });
        
        const paragraph1 = document.querySelector('#paragraph1');
        let paragraph1Counter = 0;
        paragraph1.addEventListener('click', function() {
            paragraph1Counter += 2;
            document.querySelector('#displayer').innerHTML = `paragraph 1 counter ${paragraph1Counter}`;
        });
    })();
    </script>
</body>
</html>