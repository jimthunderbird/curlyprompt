<?php

class App
{
    public function init()
    {
        // act as HTML/CSS/Javascript Expert
        // all php code should be on top, before html
        // print this.view()
        
        echo $this->view();
    }

    public function getBookContent()
    {
        // apply defensive coding
        if (!isset($_GET['book_url']) || empty($_GET['book_url'])) {
            echo "No book URL provided";
            exit;
        }
        
        $book_url = filter_var($_GET['book_url'], FILTER_SANITIZE_URL);
        
        if (!filter_var($book_url, FILTER_VALIDATE_URL)) {
            echo "Invalid URL provided";
            exit;
        }
        
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
        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <title>Book Reader</title>
        </head>
        <body>
            <h1>Book Reader</h1>
            <input type="text" id="book_url" placeholder="Enter book URL">
            <button onclick="loadBook()">Load Book</button>
            
            <div id="book_content"></div>

            <script>
                function loadBook() {
                    let book_url = document.getElementById("book_url").value;
                    if (book_url) {
                        fetch("?book_url=" + encodeURIComponent(book_url))
                            .then(response => response.text())
                            .then(data => {
                                document.getElementById("book_content").innerHTML = data;
                            })
                            .catch(error => {
                                document.getElementById("book_content").innerHTML = "Error loading book: " + error;
                            });
                    }
                }
                
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

?>
