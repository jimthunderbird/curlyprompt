<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="demo, simple, php">
    <title>clicking components demo</title>
    <link rel="stylesheet" href="/web.css">
    <script src="/web1.js"></script>
    <script src="/web2.js"></script>
</head>
<body>
    <div id="container">
        <button id="button1">button 1</button>
        <ul id="numbers-list">
<?php
$numbers = [];
for ($i = 0; $i < 10; $i++) {
    $numbers[] = rand(1, 150);
}
foreach ($numbers as $number) {
    if ($number % 2 !== 0) {
        echo '<li data-number="' . $number . '" data-type="odd">odd number ' . $number . '</li>' . "\n";
    } else {
        echo '<li data-number="' . $number . '" data-type="even">even number ' . $number . '</li>' . "\n";
    }
}
?>
        </ul>
        <div id="displayer"></div>
    </div>
</body>
</html>