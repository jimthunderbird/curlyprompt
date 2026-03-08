<?php

$numbers = array_map(function($n) { return rand(1, 500); }, range(1, 100));
shuffle($numbers);
$slicedNumbers = array_slice($numbers, 0, 100);

foreach ($slicedNumbers as $number) {
    echo $number . PHP_EOL;
}
