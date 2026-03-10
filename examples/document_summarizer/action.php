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
            return "";
        }

        $result = json_decode($response, true);
        return $result['response'] ?? "";
    }
}

class App
{
    public function init(): void
    {
        $articlePath = './docs/php.md';
        $summaryPath = './docs/php.summary.txt';

        if (!file_exists($articlePath)) {
            echo "failed generated summary\n";
            return;
        }

        $content = file_get_contents($articlePath);
        if ($content === false) {
            echo "failed generated summary\n";
            return;
        }

        $llm = new LLM();
        $prompt = "Summarize the following content in 50 words and list all URLs:\n\n" . $content;
        $summary = $llm->sendPrompt($prompt);

        if (empty($summary)) {
            echo "failed generated summary\n";
            return;
        }

        $writeResult = file_put_contents($summaryPath, $summary);
        if ($writeResult !== false) {
            echo "successfully generated summary\n";
        } else {
            echo "failed generated summary\n";
        }
    }
}

$app = new App();
$app->init();

