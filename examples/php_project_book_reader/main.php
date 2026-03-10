<?php

class Math
{
    public static function getPI()
    {
        return 3.14159;
    }
}

class App
{
    private $pi;

    public function __construct()
    {
        $this->pi = Math::getPI();
    }

    public function init()
    {
        echo $this->view();
    }

    public function getBookContent($book_url)
    {
        // Apply defensive coding
        if (empty($book_url) || !filter_var($book_url, FILTER_VALIDATE_URL)) {
            return "<p>Invalid URL provided.</p>";
        }

        // Get content from URL
        $book_content = @file_get_contents($book_url);
        
        if ($book_content === false) {
            return "<p>Failed to retrieve content from the provided URL.</p>";
        }

        // Convert special characters to HTML entities
        $book_content = htmlspecialchars($book_content, ENT_QUOTES, 'UTF-8');
        
        // Convert newlines to <br> tags
        $book_content = nl2br($book_content);
        
        return $book_content;
    }

    public function view()
    {
        ob_start();
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <title>Book Content Viewer</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                #book_url {
                    width: 500px;
                    padding: 10px;
                    margin-bottom: 20px;
                }
                #book_content {
                    background: wheat;
                    padding: 15px;
                    border: 1px solid #ccc;
                    min-height: 100px;
                }
                h1 {
                    color: #333;
                }
            </style>
        </head>
        <body>
            <h1><?php echo $this->pi; ?></h1>
            
            <input type="text" id="book_url" placeholder="Enter book URL">
            
            <div id="book_content">
                <?php 
                if (isset($_GET['book_url'])) {
                    echo $this->getBookContent($_GET['book_url']);
                }
                ?>
            </div>

            <script>
                document.getElementById('book_url').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        var book_url = this.value;
                        if (book_url) {
                            // Create a new URL with the book_url parameter
                            var newUrl = window.location.href.split('?')[0] + '?book_url=' + encodeURIComponent(book_url);
                            window.location.href = newUrl;
                        }
                    }
                });
            </script>
        </body>
        </html>
        <?php
        return ob_get_clean();
    }
}

// Initialize the application
$APP = new App();
$APP->init();

?>

