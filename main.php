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

    public function getBookContent($book_url)
    {
        // apply defensive coding
        if (empty($book_url)) {
            return "Error: No URL provided";
        }

        // Validate URL
        if (!filter_var($book_url, FILTER_VALIDATE_URL)) {
            return "Error: Invalid URL format";
        }

        // Use cURL to fetch content
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $book_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Book Reader Application');
        
        $book_content = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_error($ch)) {
            return "Error: " . curl_error($ch);
        }
        
        if ($http_code !== 200) {
            return "Error: HTTP " . $http_code;
        }
        
        curl_close($ch);
        
        return $book_content;
    }

    public function view()
    {
        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <title>Book Reader</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                #book_url { width: 500px; padding: 10px; margin-bottom: 10px; }
                #book_content { 
                    border: 1px solid #ccc; 
                    padding: 15px; 
                    min-height: 200px; 
                    background-color: #f9f9f9;
                }
                button { padding: 10px 15px; background-color: #007cba; color: white; border: none; cursor: pointer; }
                button:hover { background-color: #005a87; }
            </style>
        </head>
        <body>
            <h1>Book Reader</h1>
            <input type="text" id="book_url" placeholder="Enter book URL">
            <button onclick="loadBook()">Load Book</button>
            <div id="book_content"></div>

            <script>
                function loadBook() {
                    const bookUrl = document.getElementById("book_url").value;
                    if (!bookUrl) {
                        alert("Please enter a URL");
                        return;
                    }
                    
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", "?book_url=" + encodeURIComponent(bookUrl), true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            document.getElementById("book_content").innerHTML = xhr.responseText;
                        }
                    };
                    xhr.send();
                }
                
                // Load book when Enter key is pressed
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
    exit;
}

?>
