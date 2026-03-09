<?php
// PHP logic at the top
function read_book_url($url) {
    // Validate URL
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        return "Invalid URL";
    }
    
    // Get content from URL
    $context = stream_context_create([
        'http' => [
            'user_agent' => 'Book Reader Application',
            'timeout' => 10,
        ]
    ]);
    
    $content = @file_get_contents($url, false, $context);
    
    if ($content === false) {
        return "Failed to load content from URL";
    }
    
    return $content;
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'read_book_url' && isset($_POST['url'])) {
        $result = read_book_url($_POST['url']);
        echo $result;
        exit;
    }
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
            margin: 0;
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
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            min-height: 200px;
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL (e.g., https://example.com/book.txt)">
    </div>
    
    <div id="book-content">
        <!-- Book content will be loaded here -->
    </div>

    <script>
        // JavaScript for handling the book loading
        document.getElementById('book-url').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                load_book(this.value);
            }
        });

        function load_book(url) {
            // Show loading message
            document.getElementById('book-content').innerHTML = 'Loading book...';
            
            // Create POST request
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        document.getElementById('book-content').innerHTML = xhr.responseText;
                    } else {
                        document.getElementById('book-content').innerHTML = 'Error loading book content.';
                    }
                }
            };
            
            // Send request with payload
            const payload = 'action=read_book_url&url=' + encodeURIComponent(url);
            xhr.send(payload);
        }
    </script>
</body>
</html>
