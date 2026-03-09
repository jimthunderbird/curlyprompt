<?php

$command = 'php pokeapi_helper.php';
exec($command, $output, $returnCode);

if ($returnCode === 0) {
    $pikachuData = implode("\n", $output);
    $question = "Please extract the hp of Pikachu based on the following:" . $pikachuData;
    
    $data = [
        'model' => 'gemma3:latest',
        'prompt' => $question,
        'stream' => false,
        'options' => [
            'temperature' => 0.3
        ]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:11434/api/generate');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $responseData = json_decode($response, true);
    echo $responseData['response'];
} else {
    echo "Error running command";
}

?>
