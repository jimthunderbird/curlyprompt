<?php
$book_content = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['book_url'])) {
    $book_url = $_POST['book_url'];
    
    // Validate URL
    if (filter_var($book_url, FILTER_VALIDATE_URL)) {
        // Attempt to fetch content from URL
        $context = stream_context_create([
            'http' => [
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'timeout' => 10,
            ]
        ]);
        
        $content = @file_get_contents($book_url, false, $context);
        
        if ($content !== false) {
            $book_content = htmlspecialchars($content);
        } else {
            $book_content = "Failed to fetch content from the provided URL.";
        }
    } else {
        $book_content = "Invalid URL provided.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Book Reader</title>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL">
    </div>
    <div id="book-content"><?php echo $book_content; ?></div>

    <script>
        document.getElementById('book-url').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission if in a form
                let book_url = this.value;
                
                // Create a FormData object to send the data
                const formData = new FormData();
                formData.append('book_url', book_url);
                
                // Use fetch to get the content from the PHP backend
                fetch('spa_php.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(data => {
                    document.getElementById('book-content').innerHTML = data;
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('book-content').innerHTML = 'Error loading content';
                });
            }
        });
    </script>
</body>
</html>
