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
            return "Error: Could not fetch content from URL";
        }

        return $book_content;
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
            <div>
                <input type="text" id="book_url" placeholder="Enter book URL">
                <button onclick="fetchBookContent()">Load Book</button>
            </div>
            
            <div id="book_content">
                <!-- Book content will be displayed here -->
            </div>

            <script>
                function fetchBookContent() {
                    const bookUrl = document.getElementById('book_url').value;
                    const contentDiv = document.getElementById('book_content');
                    
                    if (!bookUrl) {
                        contentDiv.innerHTML = "Please enter a book URL";
                        return;
                    }
                    
                    // Send GET request to fetch book content
                    fetch('main.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: 'book_url=' + encodeURIComponent(bookUrl)
                    })
                    .then(response => response.text())
                    .then(data => {
                        contentDiv.innerHTML = data;
                    })
                    .catch(error => {
                        contentDiv.innerHTML = "Error fetching book content: " + error.message;
                    });
                }
                
                // Handle Enter key press
                document.getElementById('book_url').addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        fetchBookContent();
                    }
                });
            </script>
        </body>
        </html>
        <?php
    }
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['book_url'])) {
    $app = new App();
    echo $app->getBookContent($_POST['book_url']);
} else {
    // Initialize the app
    $app = new App();
    $app->init();
}

?>
