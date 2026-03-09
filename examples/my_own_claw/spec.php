<?php
$command = 'php pokeapi_helper.php';
exec($command, $output, $return_code);
file_put_contents('PIKACHU.txt', implode("\n", $output));
$content = file_get_contents('./PIKACHU.txt');
$question = "Please extract the hp of Pikachu based on the following:" . $content;
$config = [
  'llm_api_endpoint' => 'http://127.0.0.1:11434/api/generate',
  'llm_model' => 'gemma3:latest',
  'llm_model_options' => [
    'temperature' => 0.3
  ],
  'llm_thinking_mode' => false
];
$data = [
  'model' => $config['llm_model'],
  'prompt' => $question,
  'options' => $config['llm_model_options'],
  'stream' => false
];
$ch = curl_init($config['llm_api_endpoint']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$result = curl_exec($ch);
curl_close($ch);
$decoded_result = json_decode($result, true);
echo $decoded_result['response'];
?>
