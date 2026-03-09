<?php
// Updated by goose
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SPA PHP Page</title>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url"/>
    </div>
    <div id="book-content">
        <?php
        $book_url = $_GET["book_url"] ?? '';
        if ($book_url) {
            // Simple fetch. In real usage, should validate and handle errors.
            $content = @file_get_contents($book_url);
            if ($content !== false) {
                echo htmlspecialchars($content, ENT_QUOTES, 'UTF-8');
            } else {
                echo "Could not read content from: ".htmlspecialchars($book_url, ENT_QUOTES, 'UTF-8');
            }
        }
        ?>
    </div>
    <script>
        document.getElementById('book-url').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                var book_url = this.value;
                console.log('Entered URL:', book_url);
                // Submit form or reload page with query param
                window.location.href = window.location.pathname + '?book_url=' + encodeURIComponent(book_url);
            }
        });
    </script>
</body>
</html>
