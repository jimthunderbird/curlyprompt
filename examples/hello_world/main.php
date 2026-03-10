<?php

class Math
{
  public function getPI() {
    return 3.1415;
  }
}

class Greeter
{
  public function greet() {
    $new_year_message = $this->getNewYearMessage();
    $pi = (new Math())->getPI();
    echo "Hey there, this is the very simple hello message from greeter, also here is the {$new_year_message}, pi day is around the corner, pi is {$pi}\n";
  }

  public function getNewYearMessage() {
    return "happy new year 2016";
  }
}

$greeter = new Greeter();
$greeter->greet();
?>
