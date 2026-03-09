<?php
function read_book_url($url) {
    // Check if URL is valid and accessible
    if (filter_var($url, FILTER_VALIDATE_URL) === false) {
        return "Invalid URL";
    }
    
    // Use file_get_contents to read the content
    $content = @file_get_contents($url);
    
    if ($content === false) {
        return "Failed to read content from URL";
    }
    
    return $content;
}
?>

<html>
<head>
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
            padding: 10px;
            width: 80%;
            font-size: 16px;
        }
        #book-content {
            background: white;
            padding: 20px;
            border-radius: 5px;
            min-height: 200px;
            max-height: 500px;
            overflow-y: auto;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL">
    </div>
    
    <div id="book-content"></div>

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
