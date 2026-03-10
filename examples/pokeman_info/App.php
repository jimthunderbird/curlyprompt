<?php

class App
{
    public function init()
    {
        $url = "https://pokeapi.co/api/v2/pokemon/pikachu";
        $content = file_get_contents($url);
        $info = json_decode($content, true);
        echo json_encode($info, JSON_PRETTY_PRINT) . "\n";
    }
}

?>
