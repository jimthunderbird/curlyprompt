<?php
// PHP logic for reading book content
function read_book_url($url) {
    // Check if URL is valid and accessible
    if (filter_var($url, FILTER_VALIDATE_URL) === false) {
        return "Invalid URL";
    }
    
    // Attempt to read the file content
    $content = @file_get_contents($url);
    
    if ($content === false) {
        return "Failed to read content from URL";
    }
    
    return $content;
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'read_book_url') {
        $url = $_POST['url'] ?? '';
        $result = read_book_url($url);
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
            min-height: 300px;
            max-height: 600px;
            overflow-y: auto;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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
        // Function to load book content
        function load_book(url) {
            // Create XMLHttpRequest object
            const xhr = new XMLHttpRequest();
            
            // Set up the request
            xhr.open('POST', '', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            // Handle response
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    document.getElementById('book-content').innerHTML = xhr.responseText;
                }
            };
            
            // Send the request with the URL
            xhr.send('action=read_book_url&url=' + encodeURIComponent(url));
        }
        
        // Handle Enter key press in the URL textbox
        document.getElementById('book-url').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const url = this.value;
                if (url) {
                    load_book(url);
                }
            }
        });
    </script>
</body>
</html>
