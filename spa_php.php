<?php
function read_book_url($url) {
    // Check if URL is valid and accessible
    if (filter_var($url, FILTER_VALIDATE_URL) === false) {
        return "Invalid URL";
    }
    
    // Attempt to get content from URL
    $context = stream_context_create([
        'http' => [
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'timeout' => 10,
            'follow_location' => true,
        ]
    ]);
    
    $content = @file_get_contents($url, false, $context);
    
    if ($content === false) {
        return "Failed to load content from URL";
    }
    
    return $content;
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
            border: 1px solid #ccc;
            padding: 15px;
            background: white;
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
        Enter a URL above to load book content
    </div>

    <script>
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const url = this.value;
                if (url) {
                    // Create a simple AJAX request to get the content
                    fetch('spa_php.php?url=' + encodeURIComponent(url))
                        .then(response => response.text())
                        .then(data => {
                            document.getElementById('book-content').innerHTML = data;
                        })
                        .catch(error => {
                            document.getElementById('book-content').innerHTML = 'Error loading content: ' + error.message;
                        });
                }
            }
        });
    </script>
</body>
</html>
<?php
// Handle AJAX request for book content
if (isset($_GET['url'])) {
    $url = $_GET['url'];
    $content = read_book_url($url);
    echo $content;
    exit;
}
?>
