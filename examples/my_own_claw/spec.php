<?php
$command = 'php pokeapi_helper.php';
exec($command, $output, $return_code);
if ($return_code !== 0) {
    die("Failed to execute command: $command\n");
}
file_put_contents('PIKACHU.txt', implode("\n", $output));
$content = file_get_contents('./PIKACHU.txt');
$question = "Please extract the hp of Pikachu based on the following:" . $content;
$data = [
    'model' => 'gemma3:latest',
    'prompt' => $question,
    'stream' => false,
    'options' => [
        'temperature' => 0,
        'top_p' => 0,
        'top_k' => 0,
        'repeat_penalty' => 1,
        'num_predict' => 100,
        'stop' => ['\n\n']
    ]
];
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:11434/api/generate');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($httpCode !== 200) {
    die("HTTP request failed with code: $httpCode\n");
}
$decodedResponse = json_decode($response, true);
echo $decodedResponse['response'];
?>
