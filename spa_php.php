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
        ]
    ]);
    
    $content = @file_get_contents($url, false, $context);
    
    if ($content === false) {
        return "Failed to read content from URL";
    }
    
    return htmlspecialchars($content);
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
        }
        #book-controls {
            margin-bottom: 20px;
        }
        #book-url {
            width: 70%;
            padding: 10px;
            font-size: 16px;
        }
        #book-content {
            border: 1px solid #ccc;
            padding: 15px;
            min-height: 200px;
            background-color: #f9f9f9;
            white-space: pre-wrap;
        }
        .error {
            color: red;
        }
    </style>
</head>
<body>
    <h1>Book Reader</h1>
    
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL">
        <button onclick="loadBook()">Load Book</button>
    </div>
    
    <div id="book-content"></div>

    <script>
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadBook();
            }
        });

        function loadBook() {
            const url = document.getElementById('book-url').value;
            const contentDiv = document.getElementById('book-content');
            
            if (!url) {
                contentDiv.innerHTML = '<span class="error">Please enter a URL</span>';
                return;
            }
            
            // Simple AJAX request to PHP endpoint
            const xhr = new XMLHttpRequest();
            xhr.open('POST', window.location.href, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    contentDiv.innerHTML = xhr.responseText;
                }
            };
            
            xhr.send('book_url=' + encodeURIComponent(url));
        }
        
        // Handle form submission via POST
        <?php
        if (isset($_POST['book_url'])) {
            $content = read_book_url($_POST['book_url']);
            echo "document.getElementById('book-content').innerHTML = '" . str_replace("'", "\\'", $content) . "';";
        }
        ?>
    </script>
</body>
</html>
