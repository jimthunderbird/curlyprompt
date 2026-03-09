<?php
function read_book_url($url) {
    // Get the content of the URL
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
?>

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
        document.getElementById('book-url').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const url = this.value;
                if (url) {
                    // In a real implementation, we would make an AJAX call to the PHP function
                    // For this example, we'll just show a placeholder
                    document.getElementById('book-content').innerHTML = '<p>Loading book content...</p>';
                    
                    // Simulate loading with a timeout
                    setTimeout(() => {
                        document.getElementById('book-content').innerHTML = '<p>Book content would be loaded here from: ' + url + '</p>';
                    }, 1000);
                }
            }
        });
    </script>
</body>
</html>
