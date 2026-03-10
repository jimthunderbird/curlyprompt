<?php

class App
{
    public function init()
    {
        // Check if book_url is provided via GET parameter
        if (isset($_GET['book_url']) && !empty($_GET['book_url'])) {
            $this->getBookContent();
        } else {
            $this->view();
        }
    }

    public function getBookContent()
    {
        // Apply defensive coding - validate and sanitize the URL
        $book_url = filter_var($_GET['book_url'], FILTER_SANITIZE_URL);
        
        // Check if URL is valid
        if (!filter_var($book_url, FILTER_VALIDATE_URL)) {
            echo "Invalid URL provided";
            exit;
        }
        
        // Fetch content from the URL
        $book_content = @file_get_contents($book_url);
        
        // Check if content was fetched successfully
        if ($book_content === false) {
            echo "Failed to fetch content from the provided URL";
            exit;
        }
        
        // Output the content
        echo $book_content;
        exit;
    }

    public function view()
    {
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <title>Book Reader</title>
        </head>
        <body>
            <h1>Book Reader</h1>
            <input type="text" id="book_url" placeholder="Enter book URL" onkeypress="handleKeyPress(event)">
            <div id="book_content"></div>

            <script>
                function handleKeyPress(event) {
                    if (event.key === 'Enter') {
                        let book_url = document.getElementById('book_url').value;
                        if (book_url) {
                            fetch(window.location.href + '?book_url=' + encodeURIComponent(book_url))
                                .then(response => response.text())
                                .then(data => {
                                    document.getElementById('book_content').innerHTML = data;
                                })
                                .catch(error => {
                                    document.getElementById('book_content').innerHTML = 'Error loading content';
                                });
                        }
                    }
                }
            </script>
        </body>
        </html>
        <?php
    }
}

// Initialize the application
$app = new App();
$app->init();

?>
