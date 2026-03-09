<?php
function read_book_url($url) {
    $result = file_get_contents($url);
    $lines = explode("\n", $result);
    $html = "";
    foreach ($lines as $line) {
        if (!empty(trim($line))) {
            $html .= "<p>" . htmlspecialchars($line) . "</p>";
        }
    }
    return $html;
}

if (isset($_GET['action']) && $_GET['action'] == "load_book") {
    $url = $_GET['url'];
    $content = read_book_url($url);
    echo $content;
    exit;
}
?>

<html>
<head>
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
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL">
    </div>
    <div id="book-content">
        <!-- Book content will appear here -->
    </div>

    <script>
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                var url = this.value;
                if (url) {
                    fetch('?action=load_book&url=' + encodeURIComponent(url))
                        .then(response => response.text())
                        .then(data => {
                            document.getElementById('book-content').innerHTML = data;
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            document.getElementById('book-content').innerHTML = '<p>Error loading book content.</p>';
                        });
                }
            }
        });
    </script>
</body>
</html>
