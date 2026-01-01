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
        #button1, #button2, #button3 {
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
                    <li data-number="<?php echo $number; ?>" data-type="odd">odd number <?php echo $number; ?></li>
                <?php else: ?>
                    <li data-number="<?php echo $number; ?>" data-type="even">even number <?php echo $number; ?></li>
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
            const displayer = document.getElementById('displayer');
            
            numbersList.addEventListener('click', function(e) {
                if (e.target.tagName === 'LI') {
                    const number = e.target.getAttribute('data-number');
                    const type = e.target.getAttribute('data-type');
                    displayer.innerHTML = `clicked on ${type} number ${number} in the list`;
                }
            });
            
            const button1 = document.getElementById('button1');
            let button1Counter = 0;
            button1.addEventListener('click', function() {
                button1Counter += 1;
                displayer.innerHTML = `buton 1 counter ${button1Counter}`;
            });
            
            const button2 = document.getElementById('button2');
            let button2Counter = 0;
            button2.addEventListener('click', function() {
                button2Counter += 1;
                displayer.innerHTML = `buton 2 counter ${button2Counter}`;
            });
            
            const button3 = document.getElementById('button3');
            let button3Counter = 0;
            button3.addEventListener('click', function() {
                button3Counter += 1;
                displayer.innerHTML = `buton 3 counter ${button3Counter}`;
            });
            
            const paragraph1 = document.getElementById('paragraph1');
            let paragraph1Counter = 0;
            paragraph1.addEventListener('click', function() {
                paragraph1Counter += 2;
                displayer.innerHTML = `paragraph 1 counter ${paragraph1Counter}`;
            });
        })();
    </script>
</body>
</html>
