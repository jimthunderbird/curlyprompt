<?php

// Parse prompt from: positional arg, -p flag, or prompt.txt fallback
$options = getopt('p:');
if (isset($options['p'])) {
    $promptContent = $options['p'];
    file_put_contents('prompt.txt', $promptContent);
} elseif (isset($argv[1]) && $argv[1][0] !== '-') {
    $promptContent = $argv[1];
    file_put_contents('prompt.txt', $promptContent);
} else {
    $promptContent = file_get_contents('prompt.txt');
    if ($promptContent === false) {
        fwrite(STDERR, "Error: Could not read prompt.txt\n");
        exit(1);
    }
}

$skillFilesMap = shell_exec("find skills/ -type f -name 'SKILL.md'");
if ($skillFilesMap === null) {
    fwrite(STDERR, "Error: Could not find skill files\n");
    exit(1);
}

$deferredMessages = [];
$deferredMessages[] = "getting the intent...\n";
$prompt = "<instruction>\n$promptContent\n</instruction>\n<skill_files_map>\n$skillFilesMap</skill_files_map>\nbased on the intent of <instruction>, return ALL corresponding paths in <skill_files_map> that map the intent, one path per line, no explanation, no extra words\n";

file_put_contents("intent_prompt.txt", $prompt);

// Send prompt to Ollama to get skill path
$ollamaUrl = 'http://localhost:11434/api/generate';

$payload = json_encode([
    'model' => 'qwen3-coder:30b',
    'prompt' => $prompt,
    'stream' => false,
]);

$ch = curl_init($ollamaUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
if ($response === false) {
    fwrite(STDERR, "Error: Ollama request failed: " . curl_error($ch) . "\n");
    curl_close($ch);
    exit(1);
}
curl_close($ch);

$result = json_decode($response, true);
if (!isset($result['response'])) {
    fwrite(STDERR, "Error: Invalid Ollama response\n");
    exit(1);
}

$output = $result['response'];
// Strip </think>...</think> blocks from qwen3 thinking output
$output = preg_replace('/<think>.*?<\/think>/s', '', $output);
$output = trim(str_replace("#", "", $output));

// Parse multiple skill paths (one per line)
$skillPaths = array_filter(array_map('trim', explode("\n", $output)));
if (empty($skillPaths)) {
    fwrite(STDERR, "Error: No skill paths returned\n");
    exit(1);
}

$deferredMessages[] = "finding related skills...\n";
// Read all skill files
$skillContents = '';
foreach ($skillPaths as $skillPath) {
    $content = file_get_contents($skillPath);
    if ($content === false) {
        fwrite(STDERR, "Warning: Could not read skill file: $skillPath\n");
        continue;
    }
    $skillContents .= "<skill path=\"$skillPath\">\n$content\n</skill>\n\n";
}
$deferredMessages[] = "done...\n";

if (empty($skillContents)) {
    fwrite(STDERR, "Error: Could not read any skill files\n");
    exit(1);
}

// Save SKILL.py to the directory of the first matched SKILL.md
$skillDir = dirname($skillPaths[0]);
$skillPyPath = $skillDir . '/SKILL.py';
$quiet = file_exists($skillPyPath);

if (!$quiet) {
    foreach ($deferredMessages as $msg) {
        print $msg;
    }
}

if ($quiet) {
    // SKILL.py already exists, skip generation silently
} else {
    print "generating action...\n";
    // Build final prompt and send to Ollama
    $finalPrompt = "learn from the following skills:\n$skillContents\n<instruction>\n$promptContent\n</instruction>\ngenerate python code as a reusable module to follow the exact logic in <instruction>. Define a main(payload) function that accepts a dict (the parsed JSON payload) as its only argument. DO NOT include any 'if __name__ == \"__main__\"' block or any invocation logic. no explanation, no extra words";

    file_put_contents("final_prompt.txt", $finalPrompt);

    $payload2 = json_encode([
        'model' => 'qwen3-coder:30b',
        'prompt' => $finalPrompt,
        'stream' => true,
    ]);

    $fullResponse = '';
    $ch2 = curl_init($ollamaUrl);
    curl_setopt($ch2, CURLOPT_POST, true);
    curl_setopt($ch2, CURLOPT_POSTFIELDS, $payload2);
    curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, false);
    curl_setopt($ch2, CURLOPT_WRITEFUNCTION, function($ch, $data) use (&$fullResponse) {
        $json = json_decode($data, true);
        if (isset($json['response'])) {
            $token = $json['response'];
            fwrite(STDOUT, $token);
            $fullResponse .= $token;
        }
        return strlen($data);
    });
    curl_exec($ch2);
    if (curl_errno($ch2)) {
        fwrite(STDERR, "\nError: Second Ollama request failed: " . curl_error($ch2) . "\n");
        curl_close($ch2);
        exit(1);
    }
    curl_close($ch2);
    fwrite(STDOUT, "\n");

    $finalPromptContent = $fullResponse;
    // Strip <think>...</think> blocks from qwen3 thinking output
    $finalPromptContent = preg_replace('/<think>.*?<\/think>/s', '', $finalPromptContent);
    // Filter out beginning ```py/```python line and ending ``` line
    $finalPromptContent = preg_replace('/^.*?```(?:py|python)?\s*\n/s', '', trim($finalPromptContent));
    $finalPromptContent = preg_replace('/\n```\s*$/', '', $finalPromptContent);

    // Strip any if __name__ == "__main__" block as a safety measure
    $finalPromptContent = preg_replace('/\nif\s+__name__\s*==\s*["\']__main__["\']\s*:.*$/s', '', $finalPromptContent);

    file_put_contents($skillPyPath, $finalPromptContent);
}

// Check if action.prompt exists alongside SKILL.py
$actionPromptPath = $skillDir . '/action.prompt';
if (file_exists($skillPyPath) && file_exists($actionPromptPath)) {
    if (!$quiet) print "found action.prompt, sending to LLM...\n";
    $actionPromptContent = file_get_contents($actionPromptPath);
    if ($actionPromptContent === false) {
        fwrite(STDERR, "Error: Could not read action.prompt\n");
        exit(1);
    }
    // Read constraint.prompt if it exists
    $constraintPrompt = '';
    $constraintPromptPath = $skillDir . '/constraint.prompt';
    if (file_exists($constraintPromptPath)) {
        $constraintPrompt = file_get_contents($constraintPromptPath);
        if ($constraintPrompt === false) {
            $constraintPrompt = '';
        }
    }
    $constraintInner = "  MUST include \"import SKILL\" in the python code\n  always assume SKILL.py exists and do not raise concern that it might not exist, no explanation, no extra words";
    if ($constraintPrompt) {
        $constraintInner .= "\n  $constraintPrompt";
    }
    $finalPrompt = "role: python3.11 expert\nobject {\n  create python code to perform and answer instruction {\n    $promptContent\n  }\n}\ncontext {\n  $actionPromptContent\n}\nconstraint {\n$constraintInner\n}";

    file_put_contents($skillDir . '/.final_prompt.prompt', $finalPrompt);

    $actionFullResponse = '';
    $payload3 = json_encode([
        'model' => 'qwen3-coder:30b',
        'prompt' => $finalPrompt,
        'stream' => true,
    ]);

    $ch3 = curl_init($ollamaUrl);
    curl_setopt($ch3, CURLOPT_POST, true);
    curl_setopt($ch3, CURLOPT_POSTFIELDS, $payload3);
    curl_setopt($ch3, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch3, CURLOPT_RETURNTRANSFER, false);
    curl_setopt($ch3, CURLOPT_WRITEFUNCTION, function($ch, $data) use (&$actionFullResponse, $quiet) {
        $json = json_decode($data, true);
        if (isset($json['response'])) {
            $token = $json['response'];
            if (!$quiet) {
                fwrite(STDOUT, $token);
            }
            $actionFullResponse .= $token;
        }
        return strlen($data);
    });
    curl_exec($ch3);
    if (curl_errno($ch3)) {
        fwrite(STDERR, "\nError: LLM request failed: " . curl_error($ch3) . "\n");
        curl_close($ch3);
        exit(1);
    }
    curl_close($ch3);
    if (!$quiet) fwrite(STDOUT, "\n");

    // Strip <think>...</think> blocks from qwen3 thinking output
    $actionFullResponse = preg_replace('/<think>.*?<\/think>/s', '', $actionFullResponse);

    // Extract Python code between the very first ```python and ```
    if (preg_match('/```python\s*\n(.*?)```/s', $actionFullResponse, $matches)) {
        $pythonActionCode = $matches[1];
        $finalActionPath = $skillDir . '/final_action.py';
        file_put_contents($finalActionPath, $pythonActionCode);
        if (!$quiet) print "saved final_action.py, running...\n";
        passthru('python3 -u ' . escapeshellarg($finalActionPath), $exitCode);
        exit($exitCode);
    } else {
        print "no Python code block found in LLM response\n";
        exit(0);
    }
}

if (!$quiet) print "running action...\n";
// Build JSON payload and pass as argument
$jsonPayload = json_encode(['prompt' => $promptContent]);
// Write a final_action.py that imports SKILL and calls main()
$finalActionPath = $skillDir . '/final_action.py';
$finalActionCode = "import sys, json, os\n";
$finalActionCode .= "sys.path.insert(0, " . var_export($skillDir, true) . ")\n";
$finalActionCode .= "import SKILL\n";
$finalActionCode .= "SKILL.main(json.loads(sys.argv[1]))\n";
file_put_contents($finalActionPath, $finalActionCode);
passthru('python3.11 -u ' . escapeshellarg($finalActionPath) . ' ' . escapeshellarg($jsonPayload), $exitCode);
exit($exitCode);
