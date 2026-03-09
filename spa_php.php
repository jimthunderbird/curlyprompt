<?php
function read_book_url($url) {
    // Check if URL is valid and accessible
    if (filter_var($url, FILTER_VALIDATE_URL) === false) {
        return "Invalid URL";
    }
    
    // Attempt to get the content from the URL
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
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        #book-controls {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        #book-url {
            width: 70%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        #book-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-height: 200px;
        }
        #book-content pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL (e.g., https://example.com/book.txt)">
    </div>
    
    <div id="book-content">
        <!-- Book content will be displayed here -->
    </div>

    <script>
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const url = this.value;
                if (url.trim() !== '') {
                    // Create a PHP request to fetch the book content
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', window.location.href, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            document.getElementById('book-content').innerHTML = xhr.responseText;
                        }
                    };
                    
                    // Send the URL to PHP
                    xhr.send('book_url=' + encodeURIComponent(url));
                }
            }
        });
    </script>
    
    <?php
    // Handle the PHP request when a URL is submitted
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['book_url'])) {
        $url = $_POST['book_url'];
        $content = read_book_url($url);
        echo "<script>document.getElementById('book-content').innerHTML = '" . addslashes($content) . "';</script>";
    }
    ?>
</body>
</html>
