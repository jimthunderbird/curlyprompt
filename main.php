<?php

class App
{
    public function init()
    {
        // act as HTML/CSS/Javascript Expert
        // all php code should be on top, before html
        // this.getBookContent()
        // print this.view()
        
        if (isset($_GET['book_url'])) {
            $this->getBookContent();
        } else {
            $this->view();
        }
    }

    public function getBookContent()
    {
        // apply defensive coding
        $book_url = $_GET['book_url'] ?? '';
        
        // Validate URL
        if (!filter_var($book_url, FILTER_VALIDATE_URL)) {
            echo "Invalid URL";
            exit;
        }
        
        // Fetch content from URL
        $book_content = file_get_contents($book_url);
        
        if ($book_content === false) {
            echo "Failed to fetch content from URL";
            exit;
        }
        
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
            <div>
                <input type="text" id="book_url" placeholder="Enter book URL">
                <button onclick="loadBook()">Load Book</button>
            </div>
            
            <div id="book_content">
                <!-- Book content will be loaded here -->
            </div>

            <script>
                function loadBook() {
                    let book_url = document.getElementById("book_url").value;
                    
                    if (book_url) {
                        // Send GET request to self with book_url parameter
                        window.location.href = "?book_url=" + encodeURIComponent(book_url);
                    }
                }
                
                // Handle Enter key press
                document.getElementById("book_url").addEventListener("keypress", function(event) {
                    if (event.key === "Enter") {
                        loadBook();
                    }
                });
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
