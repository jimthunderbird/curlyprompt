<?php
function read_book_url($url) {
    $content = @file_get_contents($url);
    if ($content === false) {
        return "<p style='color: red;'>Error: Unable to read content from the provided URL.</p>";
    }
    
    $lines = explode("\n", $content);
    $html = "";
    foreach ($lines as $line) {
        $trimmed = trim($line);
        if (!empty($trimmed)) {
            $html .= "<p>" . htmlspecialchars($trimmed) . "</p>";
        }
    }
    
    return $html;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'read_book_url') {
    $url = $_POST['url'] ?? '';
    echo read_book_url($url);
    exit;
}
?>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Reader</title>
    <style>
        body {
            background: wheat;
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
        }
        
        #book-controls {
            margin-bottom: 20px;
        }
        
        #book-url {
            width: 70%;
            padding: 10px;
            font-size: 16px;
            border: 2px solid #8b7355;
            border-radius: 4px;
        }
        
        #book-content {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-height: 200px;
        }
        
        #book-content p {
            line-height: 1.6;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL and press Enter...">
    </div>
    
    <div id="book-content"></div>
    
    <script>
        function load_book(url) {
            const formData = new FormData();
            formData.append('action', 'read_book_url');
            formData.append('url', url);
            
            fetch('index.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(html => {
                document.getElementById('book-content').innerHTML = html;
            })
            .catch(error => {
                document.getElementById('book-content').innerHTML = 
                    '<p style="color: red;">Error loading book: ' + error.message + '</p>';
            });
        }
        
        document.getElementById('book-url').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const url = this.value.trim();
                if (url) {
                    load_book(url);
                }
            }
        });
    </script>
</body>
</html>
