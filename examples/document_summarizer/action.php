<?php

class LLM
{
    private static $config = [
        'api_endpoint' => '127.0.0.1:11434',
        'model' => 'gemma3:latest',
        'thinking_mode' => false
    ];

    public static function sendPrompt(string $prompt): string
    {
        $data = [
            'model' => self::$config['model'],
            'prompt' => $prompt,
            'stream' => false
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://' . self::$config['api_endpoint'] . '/api/generate');
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
            return '';
        }

        $result = json_decode($response, true);
        return $result['response'] ?? '';
    }
}

class App
{
    public static function init(): void
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
        summerize <content>" . $content . "</content> in 50 words
        list all the urls
        ";
        
        $summary = LLM::sendPrompt($prompt);
        
        if (empty($summary)) {
            echo "failed generated summary\n";
            return;
        }
        
        $result = file_put_contents('./docs/php.summary.txt', $summary);
        
        if ($result !== false) {
            echo "successfully generated summary\n";
        } else {
            echo "failed generated summary\n";
        }
    }
}

App::init();

