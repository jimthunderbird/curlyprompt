<?php
$numbers = [];
for ($i = 0; $i < 10; $i++) {
    $numbers[] = rand(1, 100);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>clicking components demo</title>
    <link rel="stylesheet" href="/web.css">
    <style>
        #numbers-list li {
            cursor: pointer;
        }
        #paragraph1 {
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="container">
        <ul id="numbers-list">
            <?php foreach ($numbers as $number): ?>
                <?php if ($number % 2 !== 0): ?>
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
            const numbersList = document.getElementById('numbers-list');
            numbersList.addEventListener('click', function(e) {
                if (e.target.tagName === 'LI') {
                    const number = e.target.getAttribute('data-number');
                    const isOdd = parseInt(number) % 2 !== 0;
                    const type = isOdd ? 'odd' : 'even';
                    document.getElementById('displayer').innerHTML = `clicked on ${type} number ${number} in the list`;
                }
            });
        })();
        
        (function() {
            let counter = 0;
            document.getElementById('button1').addEventListener('click', function() {
                counter++;
                document.getElementById('displayer').innerHTML = `buton 1 counter ${counter}`;
            });
        })();
        
        (function() {
            let counter = 0;
            document.getElementById('button2').addEventListener('click', function() {
                counter++;
                document.getElementById('displayer').innerHTML = `buton 2 counter ${counter}`;
            });
        })();
        
        (function() {
            let counter = 0;
            document.getElementById('button3').addEventListener('click', function() {
                counter++;
                document.getElementById('displayer').innerHTML = `buton 3 counter ${counter}`;
            });
        })();
        
        (function() {
            let counter = 0;
            document.getElementById('paragraph1').addEventListener('click', function() {
                counter += 2;
                document.getElementById('displayer').innerHTML = `paragraph 1 counter ${counter}`;
            });
        })();
    </script>
</body>
</html>