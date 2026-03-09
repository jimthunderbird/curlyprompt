<?php
// PHP logic at the top
$book_content = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['action']) && $input['action'] === 'read_book_url') {
        $url = $input['url'];
        
        // In a real application, you would fetch the book content from the URL
        // For this example, we'll simulate fetching content
        $book_content = "<h2>Book Content from: $url</h2><p>This is where the book content would appear. In a real application, this would fetch and display the actual book content from the provided URL.</p>";
        
        // Return the content as JSON
        echo json_encode(['content' => $book_content]);
        exit;
    }
}

// Function to fetch book content (placeholder)
function fetch_book_content($url) {
    // This would normally make an HTTP request to fetch the book
    // For now, we'll return a placeholder
    return "Content from $url";
}
?>
<html>
<head>
    <title>Book Reader</title>
    <style>
        body {
            background: wheat;
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        #book-controls {
            margin-bottom: 20px;
        }
        #book-url {
            padding: 10px;
            width: 70%;
            font-size: 16px;
        }
        #book-content {
            background: white;
            padding: 20px;
            border-radius: 5px;
            min-height: 200px;
        }
        button {
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #45a049;
        }
    </style>
</head>
<body>
    <h1>Book Reader</h1>
    
    <div id="book-controls">
        <input type="text" id="book-url" placeholder="Enter book URL">
        <button onclick="loadBook()">Load Book</button>
    </div>
    
    <div id="book-content">
        <!-- Book content will appear here -->
    </div>

    <script>
        function loadBook() {
            const url = document.getElementById('book-url').value;
            if (!url) {
                alert('Please enter a URL');
                return;
            }
            
            // Send POST request to PHP endpoint
            fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'read_book_url',
                    url: url
                })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('book-content').innerHTML = data.content;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('book-content').innerHTML = '<p>Error loading book content.</p>';
            });
        }

        // Handle Enter key press in the URL textbox
        document.getElementById('book-url').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                loadBook();
            }
        });
    </script>
</body>
</html>
