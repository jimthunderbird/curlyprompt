#!/usr/bin/env php
<?php

// Local LLM config
$llm_host = 'localhost';
$llm_port = 11434;
$llm_model = 'qwen3-coder:30b-determin';

// input_prompt: the first argument
if ($argc < 2) {
    echo "Usage: php agent.php <prompt>\n";
    exit(1);
}
$input_prompt = $argv[1];

// cli_find_skill_markdowns: find ./skills/ -type f -name "SKILL.md"
$skill_file_paths = trim(shell_exec('find ./skills/ -type f -name "SKILL.md"'));

// Build intent_prompt
$intent_prompt = "skill_file_paths {\n" . $skill_file_paths . "\n}\n";
$intent_prompt .= "instruction {\n" . $input_prompt . "\n}\n";
$intent_prompt .= "action {\nreturn the file paths in skill_file_paths that maps the intent of instruction, one path per line, no explanation, no extra words\n}\n";

echo "loading skills...\n";

// Send intent_prompt to local LLM to get related skill file paths
$related_skill_file_paths_raw = send_to_llm($llm_host, $llm_port, $llm_model, $intent_prompt);
$related_skill_file_paths = array_filter(array_map('trim', explode("\n", trim($related_skill_file_paths_raw))));

// Build final_prompt
$final_prompt = "contex {\n";
foreach ($related_skill_file_paths as $file_path) {
    if (file_exists($file_path)) {
        $skill_file_content = file_get_contents($file_path);
        $tmp = preg_replace('#/SKILL\.md$#', '', $file_path);
        $tmp = preg_replace('#^\\./#', '', $tmp);
        $python_import_package = str_replace('/', '.', $tmp);
        $final_prompt .= $skill_file_content . "\nREMEMBER: from {$python_import_package} import SKILL\n";
    }
}
$final_prompt .= "}\n";
$final_prompt .= "task {\n" . $input_prompt . "\n}\n";
$final_prompt .= "action {\nlearn from context, use context as example, generate python code to complete the task, show me the python code only, no explanation, no extra words\n}\n";

// Send final_prompt to local LLM with streaming
$result = send_to_llm_stream($llm_host, $llm_port, $llm_model, $final_prompt);

echo "generating action\n";

// Extract python code between first ```python and ```
if (preg_match('/```python\s*\n(.*?)```/s', $result, $matches)) {
    $python_action_code = $matches[1];
} else {
    echo "No python code block found in LLM response.\n";
    echo $result . "\n";
    exit(1);
}

// Save python_action_code to ./final_action.py
file_put_contents('./final_action.py', $python_action_code);

echo "running action...\n";

// Run cli: python3.11 final_action.py
passthru('python3.11 final_action.py', $exit_code);
exit($exit_code);

/**
 * Send a prompt to the local Ollama LLM with streaming and return the full response.
 */
function send_to_llm_stream($host, $port, $model, $prompt) {
    $url = "http://{$host}:{$port}/api/generate";
    $payload = json_encode([
        'model' => $model,
        'prompt' => $prompt,
        'stream' => true,
    ]);

    $full_response = '';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 300);
    curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($ch, $data) use (&$full_response) {
        foreach (explode("\n", $data) as $line) {
            $line = trim($line);
            if ($line === '') continue;
            $json = json_decode($line, true);
            if (isset($json['response'])) {
                echo $json['response'];
                $full_response .= $json['response'];
            }
        }
        return strlen($data);
    });

    $success = curl_exec($ch);
    if (curl_errno($ch)) {
        echo "cURL error: " . curl_error($ch) . "\n";
        curl_close($ch);
        exit(1);
    }
    curl_close($ch);
    echo "\n";

    return $full_response;
}

/**
 * Send a prompt to the local Ollama LLM and return the response.
 */
function send_to_llm($host, $port, $model, $prompt) {
    $url = "http://{$host}:{$port}/api/generate";
    $payload = json_encode([
        'model' => $model,
        'prompt' => $prompt,
        'stream' => false,
    ]);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 300);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo "cURL error: " . curl_error($ch) . "\n";
        curl_close($ch);
        exit(1);
    }
    curl_close($ch);

    $data = json_decode($response, true);
    return $data['response'] ?? '';
}
