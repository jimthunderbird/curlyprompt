<?php
function read_book_url($url) {
    $result = file_get_contents($url);
    if ($result === false) {
        return "<p>Error: Could not load book content from URL.</p>";
    }
    
    // Split by 2 newlines and convert to HTML paragraphs
    $paragraphs = explode("\n\n", $result);
    $html = "";
    foreach ($paragraphs as $paragraph) {
        if (!empty(trim($paragraph))) {
            $html .= "<p>" . htmlspecialchars($paragraph) . "</p>";
        }
    }
    
    return $html;
}

// Handle the load_book action
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
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                var url = this.value;
                if (url) {
                    // Create XMLHttpRequest object
                    var xhr = new XMLHttpRequest();
                    
                    // Configure the request
                    xhr.open('GET', '?action=load_book&url=' + encodeURIComponent(url), true);
                    
                    // Set up a function to handle the response
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            document.getElementById('book-content').innerHTML = xhr.responseText;
                        }
                    };
                    
                    // Send the request
                    xhr.send();
                }
            }
        });
    </script>
</body>
</html>
