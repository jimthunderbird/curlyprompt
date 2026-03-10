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
    public $pi;

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
        if (!filter_var($book_url, FILTER_VALIDATE_URL)) {
            return "Invalid URL";
        }

        $book_content = @file_get_contents($book_url);
        if ($book_content === false) {
            return "Failed to retrieve content";
        }

        $book_content = htmlspecialchars($book_content, ENT_QUOTES, 'UTF-8');
        $book_content = nl2br($book_content);

        echo $book_content;
        exit;
    }

    public function view()
    {
        ob_start();
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <title>Book Content Viewer</title>
            <script>
                function loadContent() {
                    const bookUrl = document.getElementById('book_url').value;
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', '', true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            document.getElementById('book_content').innerHTML = xhr.responseText;
                        }
                    };
                    xhr.send('book_url=' + encodeURIComponent(bookUrl));
                }
            </script>
        </head>
        <body>
            <h1><?php echo $this->pi; ?></h1>
            <input type="text" id="book_url" onkeypress="if(event.keyCode==13) loadContent();" placeholder="Enter book URL">
            <div id="book_content" style="background:wheat;"></div>
        </body>
        </html>
        <?php
        return ob_get_clean();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $app = new App();
    $app->getBookContent($_POST['book_url'] ?? '');
} else {
    $app = new App();
    $app->init();
}
?>

