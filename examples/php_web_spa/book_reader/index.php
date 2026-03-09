<?php
function read_book_url($url) {
    // Get the content from the URL
    $content = file_get_contents($url);
    
    // Split by newlines and convert to HTML paragraphs
    $lines = explode("\n", $content);
    $paragraphs = [];
    
    foreach ($lines as $line) {
        // Skip empty lines
        if (trim($line) !== '') {
            $paragraphs[] = '<p>' . htmlspecialchars($line) . '</p>';
        }
    }
    
    return implode('', $paragraphs);
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
        }
        
        #book-content p {
            margin: 10px 0;
            line-height: 1.6;
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
        // Get the URL input and book content div
        const urlInput = document.getElementById('book-url');
        const bookContent = document.getElementById('book-content');
        
        // Function to load book content
        function load_book(url) {
            // Create XMLHttpRequest object
            const xhr = new XMLHttpRequest();
            
            // Configure the request
            xhr.open('POST', '', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            // Handle response
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    bookContent.innerHTML = xhr.responseText;
                }
            };
            
            // Send the request with the URL
            xhr.send('action=read_book_url&url=' + encodeURIComponent(url));
        }
        
        // Add event listener for Enter key
        urlInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                load_book(urlInput.value);
            }
        });
    </script>
</body>
</html>
