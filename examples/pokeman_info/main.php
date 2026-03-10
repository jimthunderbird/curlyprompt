<?php

class App
{
    private $pokeman_info_url;

    public function __construct()
    {
        $this->pokeman_info_url = "https://pokeapi.co/api/v2/pokemon/pikachu";
    }

    public function init()
    {
        // Read the content of the URL
        $content = file_get_contents($this->pokeman_info_url);
        
        // Decode the JSON content
        $info = json_decode($content, true);
        
        // Pretty print the JSON
        $prettyPrint = json_encode($info, JSON_PRETTY_PRINT);
        
        // Print with new line
        echo $prettyPrint . "\n";
    }
}

// Invoke the method
$app = new App();
$app->init();

?>
