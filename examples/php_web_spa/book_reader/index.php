<?php
// PHP logic at the top
function read_book_url($url) {
    // In a real application, this would fetch and parse the book content
    // For this example, we'll simulate it with some placeholder content
    $content = "<h2>Book Content from: " . htmlspecialchars($url) . "</h2>";
    $content .= "<p>This is a placeholder for the book content that would be fetched from the URL.</p>";
    $content .= "<p>The actual implementation would parse the book content and display it here.</p>";
    return $content;
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'read_book_url') {
        $url = $_POST['url'] ?? '';
        $content = read_book_url($url);
        echo $content;
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
        <button onclick="load_book()">Load Book</button>
    </div>
    
    <div id="book-content">
        <!-- Book content will be loaded here -->
    </div>

    <script>
        function load_book() {
            const url = document.getElementById('book-url').value;
            if (!url) {
                alert('Please enter a URL');
                return;
            }
            
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    document.getElementById('book-content').innerHTML = xhr.responseText;
                }
            };
            
            xhr.send('action=read_book_url&url=' + encodeURIComponent(url));
        }
        
        // Handle Enter key press
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                load_book();
            }
        });
    </script>
</body>
</html>
