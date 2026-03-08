<?php
$numbers = array_map(function() {
    return rand(1, 500);
}, range(1, 100));

shuffle($numbers);

array_slice($numbers, 0, count($numbers), true);

foreach ($numbers as $number) {
    echo $number . PHP_EOL;
}
