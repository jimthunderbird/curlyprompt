<?php

class Math
{
    function getPI() {
        return 3.1415;
    }
}

class Greeter
{
    function greet($name) {
        $new_year_message = $this->getNewYearMessage();
        $pi = Math::getPI();
        echo "hi $name, this is the very simple hello message from greeter, also here is the $new_year_message, pi day is around the corner, pi is $pi\n";
    }

    function getNewYearMessage() {
        return "happy new year 2016";
    }
}

// Invoke the greet method as specified in the spec
$greeter = new Greeter();
$greeter->greet("Jim");

?>
