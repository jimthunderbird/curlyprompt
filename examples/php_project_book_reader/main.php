<?php

class App
{
    public function init()
    {
        // act as HTML/CSS/Javascript Expert
        echo $this->view();
    }

    public function getBookContent($book_url)
    {
        // apply defensive coding
        if (empty($book_url)) {
            return "Error: No book URL provided";
        }

        // Validate URL
        if (!filter_var($book_url, FILTER_VALIDATE_URL)) {
            return "Error: Invalid URL format";
        }

        // Get content from URL
        $book_content = file_get_contents($book_url);
        
        if ($book_content === false) {
            return "Error: Could not fetch content from URL";
        }
        
        return $book_content;
    }

    public function view()
    {
        $html = '
        <html>
        <head>
            <title>Book Reader</title>
        </head>
        <body>
            <div>
                <input type="text" id="book_url" placeholder="Enter book URL">
                <button onclick="loadBook()">Load Book</button>
            </div>
            <div id="book_content"></div>

            <script>
                function loadBook() {
                    const bookUrl = document.getElementById("book_url").value;
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", "?book_url=" + encodeURIComponent(bookUrl), true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            document.getElementById("book_content").innerHTML = xhr.responseText;
                        }
                    };
                    xhr.send();
                }
                
                // Load book on Enter key press
                document.getElementById("book_url").addEventListener("keypress", function(event) {
                    if (event.key === "Enter") {
                        loadBook();
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

// Handle book content request
if (isset($_GET['book_url'])) {
    $app = new App();
    echo $app->getBookContent($_GET['book_url']);
}

?>
