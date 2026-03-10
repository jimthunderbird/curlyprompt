<?php

class Greeter
{
    public function greet() {
        $new_year_message = $this->getNewYearMessage();
        echo "this is the very simple hello message from greeter, also here is the {$new_year_message}\n";
    }

    public function getNewYearMessage() {
        return "happy new year 2016";
    }
}

$greeter = new Greeter();
$greeter->greet();

?>
