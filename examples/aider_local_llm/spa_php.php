<?php
// Create empty temp.log file
file_put_contents('temp.log', '');

function read_book_url($url) {
    $content = file_get_contents($url);
    if ($content !== false) {
        $lines = explode("\n", $content);
        $html = "";
        foreach ($lines as $line) {
            if (trim($line) !== "") {
                $html .= "<p>" . htmlspecialchars($line) . "</p>";
            }
        }
        return $html;
    } else {
        return "<p>Error loading book content</p>";
    }
}

if (isset($_GET['action']) && $_GET['action'] == "load_book") {
    $url = $_GET['url'];
    $content = file_get_contents($url);
    if ($content !== false) {
        $lines = explode("\n", $content);
        $html = "";
        foreach ($lines as $line) {
            if (trim($line) !== "") {
                $html .= "<p>" . htmlspecialchars($line) . "</p>";
            }
        }
        echo $html;
    } else {
        echo "<p>Error loading book content</p>";
    }
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Book Reader</title>
    <style>
        body {
            background: wheat;
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        #book-controls {
            margin-bottom: 20px;
        }
        #book-url {
            width: 80%;
            padding: 10px;
            font-size: 16px;
        }
        #book-content {
            background: white;
            padding: 20px;
            border-radius: 5px;
            min-height: 200px;
        }
        p {
            margin: 10px 0;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL">
    </div>
    <div id="book-content">
        <!-- Book content will appear here -->
    </div>

    <script>
        document.getElementById("book-url").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                let url = this.value;
                if (url) {
                    let xhr = new XMLHttpRequest();
                    xhr.open("GET", "?action=load_book&url=" + encodeURIComponent(url), true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            document.getElementById("book-content").innerHTML = xhr.responseText;
                        }
                    };
                    xhr.send();
                }
            }
        });
    </script>
</body>
</html>
