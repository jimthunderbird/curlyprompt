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
            'max_redirects' => 5
        ]
    ]);
    
    $content = @file_get_contents($url, false, $context);
    
    if ($content === false) {
        return "Failed to load content from URL";
    }
    
    // Basic sanitization to prevent nested HTML issues
    $content = strip_tags($content, '<p><br><h1><h2><h3><h4><h5><h6><ul><ol><li><strong><em><a><img>');
    $content = str_replace(['<script', '</script>'], ['&lt;script', '&lt;/script&gt;'], $content);
    
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
            background: white;
            padding: 20px;
            border-radius: 5px;
            min-height: 200px;
            max-height: 600px;
            overflow-y: auto;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        #book-content p {
            line-height: 1.6;
        }
        
        #book-content h1, #book-content h2, #book-content h3 {
            color: #333;
        }
        
        #book-content a {
            color: #0066cc;
            text-decoration: none;
        }
        
        #book-content a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL here...">
    </div>
    
    <div id="book-content">
        <!-- Book content will be loaded here -->
    </div>

    <script>
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const url = this.value;
                if (url.trim() !== '') {
                    // Use fetch to get content from PHP endpoint
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
        
        // Also handle the case where someone clicks on the URL input
        document.getElementById('book-url').addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    </script>
</body>
</html>
