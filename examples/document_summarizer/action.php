<?php

class LLM
{
    private string $api_endpoint;
    private string $model;
    private bool $thinking_mode;

    public function __construct()
    {
        $this->api_endpoint = "127.0.0.1:11434";
        $this->model = "gemma3:latest";
        $this->thinking_mode = false;
    }

    public function sendPrompt(string $prompt): string
    {
        $data = [
            'model' => $this->model,
            'prompt' => $prompt,
            'stream' => false
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://" . $this->api_endpoint . "/api/generate");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            return "Error: HTTP " . $httpCode;
        }

        $result = json_decode($response, true);
        return $result['response'] ?? "No response";
    }
}

class App
{
    public function init(): void
    {
        $article = './docs/php.md';
        if (!file_exists($article)) {
            echo "failed generated summary\n";
            return;
        }

        $content = file_get_contents($article);
        if ($content === false) {
            echo "failed generated summary\n";
            return;
        }

        $prompt = "
summarize <content>" . htmlspecialchars($content) . "</content> in 50 words
list all the urls
";

        $llm = new LLM();
        $summary = $llm->sendPrompt($prompt);

        $outputFile = './docs/php.summary.txt';
        $result = file_put_contents($outputFile, $summary);

        if ($result !== false) {
            echo "successfully generated summary\n";
        } else {
            echo "failed generated summary\n";
        }
    }
}

$app = new App();
$app->init();

?>

