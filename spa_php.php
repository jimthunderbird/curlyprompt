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
        <button onclick="loadBook()">Load Book</button>
    </div>
    
    <div id="book-content"></div>

    <script>
        function loadBook() {
            const url = document.getElementById('book-url').value;
            if (!url) {
                alert('Please enter a URL');
                return;
            }
            
            // Create a PHP request to fetch the content
            const xhr = new XMLHttpRequest();
            xhr.open('POST', window.location.href, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    document.getElementById('book-content').innerHTML = xhr.responseText;
                }
            };
            
            xhr.send('book_url=' + encodeURIComponent(url));
        }
        
        // Handle Enter key press
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadBook();
            }
        });
    </script>
    
    <?php
    // Handle the PHP request
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['book_url'])) {
        $url = $_POST['book_url'];
        $content = read_book_url($url);
        echo htmlspecialchars($content);
    }
    ?>
</body>
</html>
