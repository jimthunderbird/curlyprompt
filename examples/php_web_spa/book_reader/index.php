<?php
// PHP logic at the top of the page
function read_book_url($url) {
    // In a real application, this would fetch and parse the book content
    // For this example, we'll simulate it with some placeholder content
    return "<h2>Book Content from: " . htmlspecialchars($url) . "</h2><p>This is where the book content would appear. In a real application, this would fetch and display the actual book content from the provided URL.</p>";
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'read_book_url') {
        $url = $_POST['url'] ?? '';
        echo read_book_url($url);
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
            width: 70%;
            padding: 10px;
            font-size: 16px;
        }
        #book-content {
            background: white;
            padding: 20px;
            border-radius: 5px;
            min-height: 200px;
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL">
        <button onclick="load_book()">Load Book</button>
    </div>
    
    <div id="book-content">
        <!-- Book content will appear here -->
    </div>

    <script>
        function load_book() {
            const url = document.getElementById('book-url').value;
            if (!url) return;
            
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
