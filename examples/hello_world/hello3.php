<?php

class Greeter
{
    public function greet() {
        echo "Hey there! This is a casual hello message from greeter\n";
    }
}

$greeter = new Greeter();
$greeter->greet();

?>
