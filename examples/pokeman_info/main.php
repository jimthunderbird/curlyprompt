<?php

class JSON
{
    public function read_url($url)
    {
        $content = file_get_contents($url);
        $info = json_decode($content, true);
        echo json_encode($info, JSON_PRETTY_PRINT) . "\n";
    }
}

// Invoke the method
$json = new JSON();
$json->read_url("https://pokeapi.co/api/v2/pokemon/pikachu");

?>
