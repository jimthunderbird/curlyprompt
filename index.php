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
                <?php if ($number % 2 !== 0): ?>
                    <li>odd number <?php echo $number; ?></li>
                <?php else: ?>
                    <li>even number <?php echo $number; ?></li>
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
        const button1 = document.getElementById('button1');
        const displayer = document.getElementById('displayer');
        let counter1 = 0;
        
        button1.addEventListener('click', function() {
            counter1++;
            displayer.innerHTML = 'buton 1 counter ' + counter1;
        });
    })();

    (function() {
        const button2 = document.getElementById('button2');
        const displayer = document.getElementById('displayer');
        let counter2 = 0;
        
        button2.addEventListener('click', function() {
            counter2++;
            displayer.innerHTML = 'buton 2 counter ' + counter2;
        });
    })();

    (function() {
        const button3 = document.getElementById('button3');
        const displayer = document.getElementById('displayer');
        let counter3 = 0;
        
        button3.addEventListener('click', function() {
            counter3++;
            displayer.innerHTML = 'buton 3 counter ' + counter3;
        });
    })();

    (function() {
        const paragraph1 = document.getElementById('paragraph1');
        const displayer = document.getElementById('displayer');
        let counter_p1 = 0;
        
        paragraph1.addEventListener('click', function() {
            counter_p1 += 2;
            displayer.innerHTML = 'paragraph 1 counter ' + counter_p1;
        });
    })();
    </script>
</body>
</html>