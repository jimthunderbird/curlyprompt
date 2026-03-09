<?php
function read_book_url($url) {
    // Check if URL is valid and accessible
    if (filter_var($url, FILTER_VALIDATE_URL) === false) {
        return "Invalid URL";
    }
    
    // Try to get the content from the URL
    $context = stream_context_create([
        'http' => [
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'timeout' => 10,
            'follow_location' => true,
            'max_redirects' => 5
        ]
    ]);
    
    $content = @file_get_contents($url, false, $context);
    
    if ($content === false) {
        return "Failed to load content from URL";
    }
    
    // Basic sanitization to prevent nested book readers
    $content = str_replace(['<iframe', '<frame', '<object', '<embed'], 
                           ['&lt;iframe', '&lt;frame', '&lt;object', '&lt;embed'], 
                           $content);
    
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
            border: 1px solid #ccc;
            padding: 20px;
            background: white;
            min-height: 300px;
            max-height: 600px;
            overflow: auto;
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
                    // Simple check to prevent nested book readers
                    if (url.includes('book-reader') || url.includes('reader')) {
                        document.getElementById('book-content').innerHTML = 
                            '<p style="color: red;">Nested book readers are not allowed.</p>';
                        return;
                    }
                    
                    // Make an AJAX request to the PHP function
                    fetch('spa_php.php?url=' + encodeURIComponent(url))
                        .then(response => response.text())
                        .then(data => {
                            document.getElementById('book-content').innerHTML = data;
                        })
                        .catch(error => {
                            document.getElementById('book-content').innerHTML = 
                                '<p style="color: red;">Error loading content: ' + error.message + '</p>';
                        });
                }
            }
        });
        
        // Also handle the case when the page loads with a URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const url = urlParams.get('url');
        if (url) {
            document.getElementById('book-url').value = url;
            // Trigger the load
            const event = new KeyboardEvent('keypress', {key: 'Enter'});
            document.getElementById('book-url').dispatchEvent(event);
        }
    </script>
</body>
</html>
