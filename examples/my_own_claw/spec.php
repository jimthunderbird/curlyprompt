<?php
$config = [
    'llm_api_endpoint' => 'http://127.0.0.1:11434/api/generate',
    'llm_model' => 'gemma3:latest',
    'llm_thinking_mode' => false
];

exec('php pokeapi_helper.php', $output, $return_code);
file_put_contents('PIKACHU.txt', implode("\n", $output));

$content = file_get_contents('./PIKACHU.txt');
$question = "Please extract the hp of Pikachu based on the following:" . $content;

$data = [
    'model' => $config['llm_model'],
    'stream' => false,
    'prompt' => $question
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $config['llm_api_endpoint']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
echo $result['response'];
?>
