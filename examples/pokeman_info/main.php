<?php

class JSON
{
    public function read_url($url)
    {
        // Read the content of the URL
        $content = file_get_contents($url);
        
        // Decode the JSON content
        $data = json_decode($content, true);
        
        // Pretty print the JSON with color (in terminal context)
        $prettyPrint = $this->prettyPrintJson($data);
        
        // Print with new line
        echo $prettyPrint . "\n";
    }
    
    private function prettyPrintJson($data, $indent = 0)
    {
        $result = '';
        $spaces = str_repeat('  ', $indent);
        
        if (is_array($data)) {
            $result .= "{\n";
            $keys = array_keys($data);
            $lastKey = end($keys);
            
            foreach ($data as $key => $value) {
                $result .= $spaces . '  "' . $key . '": ';
                
                if (is_array($value)) {
                    $result .= $this->prettyPrintJson($value, $indent + 1);
                } else {
                    if (is_bool($value)) {
                        $result .= ($value ? 'true' : 'false');
                    } elseif (is_null($value)) {
                        $result .= 'null';
                    } else {
                        $result .= '"' . $value . '"';
                    }
                }
                
                if ($key !== $lastKey) {
                    $result .= ",";
                }
                $result .= "\n";
            }
            $result .= $spaces . "}";
        }
        
        return $result;
    }
}

// Invoke the method
$json = new JSON();
$json->read_url("https://pokeapi.co/api/v2/pokemon/pikachu");

?>
