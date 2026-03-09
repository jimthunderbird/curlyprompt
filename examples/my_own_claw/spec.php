<?php
$command = 'php pokeapi_helper.php';
exec($command, $output, $return_code);
file_put_contents('PIKACHU.txt', implode("\n", $output));
$content = file_get_contents('./PIKACHU.txt');
$question = "Please extract the hp of Pikachu based on the following:" . $content;
$data = [
    'model' => 'gemma3:latest',
    'prompt' => $question,
    'stream' => false,
    'options' => [
        'temperature' => 0
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
$decoded = json_decode($response, true);
echo $decoded['response'];
?>
