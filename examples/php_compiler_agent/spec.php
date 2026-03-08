<?php

$numbers = array_map(function($i) {
    return rand(1, 500);
}, range(1, 100));

$unique_numbers = [];
$hash_map = [];

foreach ($numbers as $number) {
    if (!isset($hash_map[$number])) {
        $hash_map[$number] = true;
        $unique_numbers[] = $number;
    }
}

shuffle($unique_numbers);

foreach ($unique_numbers as $unique_number) {
    echo $unique_number . PHP_EOL;
}
