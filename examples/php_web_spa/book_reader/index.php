<?php
// PHP logic at the top
function read_book_url($url) {
    // Read the file content
    $content = file_get_contents($url);
    
    // Return the content directly
    return $content;
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'read_book_url') {
        $url = $_POST['url'];
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
        // JavaScript for loading books
        document.getElementById('book-url').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const url = this.value;
                load_book(url);
            }
        });

        function load_book(url) {
            // Create XMLHttpRequest object
            const xhr = new XMLHttpRequest();
            
            // Configure the request
            xhr.open('POST', '', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            // Handle response
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // Convert text to HTML paragraphs
                    const lines = xhr.responseText.split('\n');
                    const paragraphs = lines.filter(line => line.trim() !== '');
                    let html = '';
                    paragraphs.forEach(paragraph => {
                        html += '<p>' + paragraph + '</p>';
                    });
                    document.getElementById('book-content').innerHTML = html;
                }
            };
            
            // Send the request
            xhr.send('action=read_book_url&url=' + encodeURIComponent(url));
        }
    </script>
</body>
</html>
