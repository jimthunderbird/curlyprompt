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
        // Defensive coding
        if (empty($book_url)) {
            return "Error: No URL provided";
        }
        
        // Validate URL format
        if (!filter_var($book_url, FILTER_VALIDATE_URL)) {
            return "Error: Invalid URL format";
        }
        
        // Prevent URL traversal attacks
        if (strpos($book_url, '..') !== false) {
            return "Error: Invalid URL";
        }
        
        // Get content from URL
        $book_content = @file_get_contents($book_url);
        
        if ($book_content === false) {
            return "Error: Could not fetch content from URL";
        }
        
        // Convert special characters to HTML entities
        $book_content = htmlspecialchars($book_content, ENT_QUOTES, 'UTF-8');
        
        return $book_content;
    }
    
    public function view()
    {
        $output = '';
        
        // Handle initial book content load if URL is provided
        if (isset($_GET['book_url'])) {
            $output .= $this->getBookContent($_GET['book_url']);
        }
        
        // Generate HTML
        $output .= '
        <!DOCTYPE html>
        <html>
        <head>
            <title>Book Content Viewer</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                #book_url { width: 500px; padding: 10px; margin: 10px 0; }
                #book_content { 
                    border: 1px solid #ccc; 
                    padding: 15px; 
                    min-height: 200px; 
                    background-color: #f9f9f9;
                    white-space: pre-wrap;
                }
                h1 { color: #333; }
            </style>
        </head>
        <body>
            <h1>' . $this->pi . '</h1>
            
            <input type="text" id="book_url" placeholder="Enter book URL" onkeypress="handleKeyPress(event)">
            
            <div id="book_content"></div>
            
            <script>
                function handleKeyPress(event) {
                    if (event.key === "Enter") {
                        const bookUrl = document.getElementById("book_url").value;
                        if (bookUrl) {
                            // Make AJAX request to PHP script with URL parameter
                            fetch("?book_url=" + encodeURIComponent(bookUrl), {
                                method: "GET"
                            })
                            .then(response => response.text())
                            .then(data => {
                                document.getElementById("book_content").innerHTML = data;
                            })
                            .catch(error => {
                                document.getElementById("book_content").innerHTML = "Error loading content";
                            });
                        }
                    }
                }
            </script>
        </body>
        </html>';
        
        return $output;
    }
}

// Initialize the application
$app = new App();
$app->init();

?>

