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
        // Get content from URL
        $book_content = file_get_contents($book_url);
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
                <input type="text" id="book_url" placeholder="Enter book URL">
                <button onclick="loadBook()">Load Book</button>
                <div id="book_content"></div>

                <script>
                    function loadBook() {
                        var bookUrl = document.getElementById("book_url").value;
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "main.php?book_url=" + bookUrl, true);
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                document.getElementById("book_content").innerHTML = xhr.responseText;
                            }
                        };
                        xhr.send();
                    }
                </script>
            </body>
        </html>';
        
        return $html;
    }
}

// Initialize the application
$app = new App();
$app->init();

// Handle AJAX request for book content
if (isset($_GET['book_url'])) {
    $app = new App();
    echo $app->getBookContent($_GET['book_url']);
}

?>
