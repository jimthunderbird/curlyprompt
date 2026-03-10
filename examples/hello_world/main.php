<?php

class Math
{
    public function getPI()
    {
        return 3.14159265;
    }
}

class Greeter
{
    public function greet($name)
    {
        $new_year_message = $this->getNewYearMessage();
        $pi = (new Math())->getPI();
        echo "hi {$name}, this is the very simple hello message from greeter, also here is the {$new_year_message}, pi day is around the corner, pi is {$pi}\n";
    }

    private function getNewYearMessage()
    {
        return "happy new year 2016";
    }
}

// Invoke the greet method as specified in the spec
$greeter = new Greeter();
$greeter->greet("Jim");

?>
