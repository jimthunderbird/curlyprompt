<?php

// Check if a name was provided via CLI argument
$pokemonName = $argv[1] ?? 'pikachu';
$url = "https://pokeapi.co/api/v2/pokemon/" . strtolower($pokemonName);

echo "\n" . str_repeat("-", 45) . "\n";
echo "  Fetching data for: " . ucfirst($pokemonName) . "\n";
echo str_repeat("-", 45) . "\n";

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Error handling for 404s or connection issues
if ($httpCode !== 200) {
    die("\033[31mError: Could not find Pokémon '$pokemonName'. (HTTP $httpCode)\033[0m\n\n");
}

$data = json_decode($response, true);

// Formatting helpers (ANSI Colors)
$bold  = "\033[1m";
$blue  = "\033[34m";
$green = "\033[32m";
$cyan  = "\033[36m";
$reset = "\033[0m";

// Header Info
echo "{$bold}NAME:{$reset}   " . strtoupper($data['name']) . " (ID: #{$data['id']})\n";
echo "{$bold}TYPE:{$reset}   " . implode(', ', array_column(array_column($data['types'], 'type'), 'name')) . "\n";
echo "{$bold}STATS:{$reset}\n";

// Stats Loop
foreach ($data['stats'] as $stat) {
    $statName = str_pad($stat['stat']['name'], 15, " ");
    $value = (int)$stat['base_stat'];

    /** * THE FIX: Explicitly cast the division result to (int)
     * to prevent "Implicit conversion from float to int" deprecation notices.
     */
    $barLength = (int)($value / 10);
    $bar = str_repeat("■", $barLength);

    // Using printf for aligned columns
    printf("  - %-15s : %3d %s%s%s\n",
        $cyan . $statName . $reset,
        $value,
        $green,
        $bar,
        $reset
    );
}

echo str_repeat("-", 45) . "\n\n";
