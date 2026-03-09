<?php
// PHP logic for handling book loading
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['action']) && $input['action'] === 'read_book_url') {
        $url = $input['url'];
        
        // Validate URL
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            // Fetch content from URL
            $content = file_get_contents($url);
            
            // Simple HTML parsing - extract body content
            if ($content) {
                // Try to extract body content
                if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $content, $matches)) {
                    $bodyContent = $matches[1];
                    // Remove script and style tags
                    $bodyContent = preg_replace('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i', '', $bodyContent);
                    $bodyContent = preg_replace('/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/i', '', $bodyContent);
                    echo $bodyContent;
                } else {
                    echo "<p>Could not extract content from the provided URL.</p>";
                }
            } else {
                echo "<p>Failed to fetch content from the provided URL.</p>";
            }
        } else {
            echo "<p>Invalid URL provided.</p>";
        }
    }
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
            margin: 0;
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
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
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
        // Get the URL input element
        const urlInput = document.getElementById('book-url');
        
        // Add event listener for Enter key
        urlInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                loadBook(urlInput.value);
            }
        });
        
        // Function to load book content
        function loadBook(url) {
            // Show loading message
            document.getElementById('book-content').innerHTML = '<p>Loading book content...</p>';
            
            // Create POST request
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            // Handle response
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    document.getElementById('book-content').innerHTML = xhr.responseText;
                } else if (xhr.readyState === 4) {
                    document.getElementById('book-content').innerHTML = '<p>Error loading book content.</p>';
                }
            };
            
            // Send request with payload
            const payload = {
                action: "read_book_url",
                url: url
            };
            
            xhr.send(JSON.stringify(payload));
        }
    </script>
</body>
</html>
