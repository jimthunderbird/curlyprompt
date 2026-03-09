<?php
function read_book_url($url) {
    // Check if URL is valid and accessible
    if (filter_var($url, FILTER_VALIDATE_URL) === false) {
        return "Invalid URL";
    }
    
    // Use cURL to fetch content
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    $content = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Check if request was successful
    if ($httpCode !== 200) {
        return "Error: HTTP " . $httpCode;
    }
    
    // If content is HTML, extract just the body content
    if (strpos($content, '<html') !== false) {
        // Simple HTML parsing to extract body content
        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($content);
        libxml_clear_errors();
        
        $body = $dom->getElementsByTagName('body');
        if ($body->length > 0) {
            $bodyContent = $body->item(0);
            $content = $dom->saveHTML($bodyContent);
        }
    }
    
    return $content;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Book Reader</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        #book-controls {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        #book-url {
            width: 70%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        #book-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            min-height: 300px;
        }
        button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #45a049;
        }
        .loading {
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <h2>Book Reader</h2>
        <input type="text" id="book-url" placeholder="Enter book URL (e.g., https://example.com/book.txt)">
        <button onclick="loadBook()">Load Book</button>
    </div>
    
    <div id="book-content" class="loading">
        Enter a URL above to load book content
    </div>

    <script>
        // Handle Enter key press in the URL textbox
        document.getElementById('book-url').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadBook();
            }
        });

        function loadBook() {
            const url = document.getElementById('book-url').value;
            const contentDiv = document.getElementById('book-content');
            
            if (!url) {
                contentDiv.innerHTML = "Please enter a URL";
                return;
            }
            
            // Show loading message
            contentDiv.innerHTML = "Loading book content...";
            
            // Create a form to submit the request
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '';
            
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'book_url';
            input.value = url;
            
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    </script>
    
    <?php
    // Handle form submission
    if (isset($_POST['book_url'])) {
        $url = $_POST['book_url'];
        $content = read_book_url($url);
        echo "<script>";
        echo "document.getElementById('book-content').innerHTML = " . json_encode($content) . ";";
        echo "</script>";
    }
    ?>
</body>
</html>
