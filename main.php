<?php

class App
{
    public function init() {
        // act as HTML/CSS/Javascript Expert
        // all php code should be on top, before html
        // this.getBookContent()
        // print this.view()    
        
        if (isset($_GET['book_url'])) {
            $this->getBookContent();
        } else {
            echo $this->view();
        }
    }

    public function getBookContent() {
        // apply defensive coding
        $book_url = isset($_GET['book_url']) ? $_GET['book_url'] : '';
        
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

    public function view() {
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
                    var bookUrl = document.getElementById("book_url").value;
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", window.location.href.split("?")[0] + "?book_url=" + encodeURIComponent(bookUrl), true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            document.getElementById("book_content").innerHTML = xhr.responseText;
                        }
                    };
                    xhr.send();
                }
                
                // Handle Enter key press
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
