<?php

class App
{
    private $pokeman_info_url = "https://pokeapi.co/api/v2/pokemon/pikachu";

    public function init() {
        $content = file_get_contents($this->pokeman_info_url);
        $info = json_decode($content, true);
        echo json_encode($info, JSON_PRETTY_PRINT) . "\n";
    }
}

// Execute the spec
$app = new App();
$app->init();

?>
