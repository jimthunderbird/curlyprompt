<?php
function read_book_url($url) {
    // Get the file content
    $content = file_get_contents($url);

    // Split by newlines and convert to HTML paragraphs
    $lines = explode("\n", $content);
    $paragraphs = [];

    foreach ($lines as $line) {
        if (!empty(trim($line))) {
            $paragraphs[] = "<p>" . htmlspecialchars($line) . "</p>";
        }
    }

    return implode("", $paragraphs);
}

// Handle the load_book action
if (isset($_GET['action']) && $_GET['action'] == "load_book") {
    $url = $_GET['url'];
    $content = read_book_url($url);
    echo $content;
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Book Reader</title>
    <style>
        body {
            background: wheat;
            font-family: Arial, sans-serif;
            padding: 20px;
        }

        #book-controls {
            margin-bottom: 20px;
        }

        #book-url {
            width: 80%;
            padding: 10px;
            font-size: 16px;
        }

        #book-content {
            background: white;
            padding: 20px;
            border-radius: 5px;
            min-height: 200px;
            max-height: 600px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL">
    </div>

    <div id="book-content">
        <!-- Book content will be loaded here -->
    </div>

    <script>
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const url = this.value;
                if (url) {
                    // Create XMLHttpRequest object
                    const xhr = new XMLHttpRequest();

                    // Configure the request
                    xhr.open('GET', '?action=load_book&url=' + encodeURIComponent(url), true);

                    // Handle the response
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            document.getElementById('book-content').innerHTML = xhr.responseText;
                        }
                    };

                    // Send the request
                    xhr.send();
                }
            }
        });
    </script>
</body>
</html>
