<?php
function read_book_url($url) {
    $result = file_get_contents($url);
    return $result;
}

if (isset($_GET['action']) && $_GET['action'] == "load_book") {
    $url = $_GET['url'];
    $content = read_book_url($url);
    echo $content;
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
            border: 1px solid #ccc;
            min-height: 200px;
            max-height: 500px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL">
    </div>
    
    <div id="book-content">
        Enter a book URL above to load content
    </div>

    <script>
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const url = this.value;
                if (url) {
                    fetch('?action=load_book&url=' + encodeURIComponent(url))
                        .then(response => response.text())
                        .then(data => {
                            document.getElementById('book-content').innerHTML = data;
                        })
                        .catch(error => {
                            document.getElementById('book-content').innerHTML = 'Error loading book content';
                            console.error('Error:', error);
                        });
                }
            }
        });
    </script>
</body>
</html>
