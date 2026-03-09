<?php
$config = [
    'llm_api_endpoint' => 'http://127.0.0.1:11434/api/generate',
    'llm_model' => 'gemma3:latest',
    'llm_thinking_mode' => false
];

$content = file_get_contents('./PIKACHU.txt');
$question = "Please extract the hp of Pikachu based on the following:" . $content;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $config['llm_api_endpoint']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'model' => $config['llm_model'],
    'stream' => false,
    'prompt' => $question
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

echo json_decode($response)->response;
?>
