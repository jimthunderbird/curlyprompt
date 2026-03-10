<?php
class App
{
    public function init()
    {
        // Act as HTML/CSS/Javascript Expert
        // Print the view
        echo $this->view();
    }

    public function getBookContent($book_url)
    {
        // Apply defensive coding
        if (empty($book_url)) {
            return "Error: No URL provided";
        }

        // Validate URL format
        if (!filter_var($book_url, FILTER_VALIDATE_URL)) {
            return "Error: Invalid URL format";
        }

        // Set user agent to avoid being blocked by some servers
        $context = stream_context_create([
            'http' => [
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'timeout' => 10,
                'header' => "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
            ]
        ]);

        // Get content from URL
        $book_content = @file_get_contents($book_url, false, $context);

        if ($book_content === false) {
            return "Error: Unable to fetch content from URL";
        }

        // Return content
        return $book_content;
    }

    public function view()
    {
        // Get book_url from GET request if available
        $book_url = $_GET['book_url'] ?? '';
        
        // If we have a URL, fetch content
        $book_content = '';
        if (!empty($book_url)) {
            $book_content = $this->getBookContent($book_url);
        }

        // Generate HTML
        $html = '
<!DOCTYPE html>
<html>
<head>
    <title>Book Content Fetcher</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        #book_url {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        #book_content {
            width: 100%;
            min-height: 200px;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f9f9f9;
            white-space: pre-wrap;
        }
        .error {
            color: red;
            background-color: #ffe6e6;
            padding: 10px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <h1>Book Content Fetcher</h1>
    <input type="text" id="book_url" placeholder="Enter book URL" value="' . htmlspecialchars($book_url) . '">
    <div id="book_content">' . htmlspecialchars($book_content) . '</div>

    <script>
        document.getElementById("book_url").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                let book_url = this.value;
                if (book_url) {
                    // Redirect to the same page with the URL as GET parameter
                    window.location.href = window.location.pathname + "?book_url=" + encodeURIComponent(book_url);
                }
            }
        });
    </script>
</body>
</html>';

        return $html;
    }
}

// Initialize the application
$app = new App();
$app->init();
?>

