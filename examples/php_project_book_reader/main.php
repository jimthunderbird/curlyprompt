<?php

class App
{
    public function init()
    {
        // act as HTML/CSS/Javascript Expert
        $this->view();
    }

    public function getBookContent($book_url)
    {
        // Apply defensive coding
        if (empty($book_url)) {
            return "Error: No book URL provided";
        }

        // Validate URL
        if (!filter_var($book_url, FILTER_VALIDATE_URL)) {
            return "Error: Invalid URL format";
        }

        // Get content from URL
        $book_content = @file_get_contents($book_url);
        
        if ($book_content === false) {
            return "Error: Could not retrieve content from the provided URL";
        }
        
        return $book_content;
    }

    public function view()
    {
        // Check if book_url is provided via GET request
        $book_url = isset($_GET['book_url']) ? $_GET['book_url'] : '';
        
        if (!empty($book_url)) {
            $book_content = $this->getBookContent($book_url);
        } else {
            $book_content = '';
        }
        
        // HTML output
        echo '
        <!DOCTYPE html>
        <html>
        <head>
            <title>Book Reader</title>
        </head>
        <body>
            <h1>Book Reader</h1>
            <form method="GET">
                <label for="book_url">Enter Book URL:</label><br>
                <input type="text" id="book_url" name="book_url" value="' . htmlspecialchars($book_url) . '" style="width: 500px;"><br><br>
                <input type="submit" value="Load Book">
            </form>
            
            <div id="book_content">
                ' . htmlspecialchars($book_content) . '
            </div>
        </body>
        </html>';
    }
}

// Initialize the application
$app = new App();
$app->init();

?>
