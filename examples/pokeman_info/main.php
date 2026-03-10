<?php

class JSON
{
    public function read_url($url) {
        $content = file_get_contents($url);
        $info = json_decode($content, true);
        print_r($info);
    }
}

// Invoke the method
$json = new JSON();
$json->read_url("https://pokeapi.co/api/v2/pokemon/pikachu");

?>
