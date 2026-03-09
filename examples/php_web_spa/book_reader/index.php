<?php
function read_book_url($url) {
    $content = file_get_contents($url);
    if ($content === false) {
        return '<p>Error: Could not fetch the book content.</p>';
    }
    $lines = explode("\n", $content);
    $html = '';
    foreach ($lines as $line) {
        $html .= '<p>' . htmlspecialchars($line) . '</p>';
    }
    return $html;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['action']) && $input['action'] === 'read_book_url' && isset($input['url'])) {
        header('Content-Type: text/html; charset=utf-8');
        echo read_book_url($input['url']);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Reader</title>
    <style>
        body {
            background: wheat;
            font-family: serif;
            margin: 0;
            padding: 20px;
        }
        #book-controls {
            margin-bottom: 20px;
        }
        #book-url {
            width: 400px;
            padding: 8px;
            font-size: 16px;
        }
        #book-content {
            max-width: 800px;
            line-height: 1.6;
        }
        #book-content p {
            margin: 0.5em 0;
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL and press Enter">
    </div>
    <div id="book-content"></div>

    <script>
        function load_book(url) {
            return fetch(window.location.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'read_book_url', url: url })
            }).then(response => response.text());
        }

        document.getElementById('book-url').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                load_book(this.value).then(function(html) {
                    document.getElementById('book-content').innerHTML = html;
                });
            }
        });
    </script>
</body>
</html>
