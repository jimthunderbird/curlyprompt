<?php

class Greeter {
    public function greet() {
        return "Hello World";
    }
}

$greeter = new Greeter();
echo $greeter->greet();

?>
