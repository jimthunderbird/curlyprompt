<?php

class App
{
    public function init()
    {
        // Act as HTML/CSS/Javascript Expert
        // Print the view
        echo $this->view();
    }

    public function view()
    {
        $html = '<html>';
        $html .= '<head><title>Book Reader</title></head>';
        $html .= '<body>';
        $html .= '<form method="post" action="">';
        $html .= '<label for="book_url">Book URL:</label>';
        $html .= '<input type="text" id="book_url" name="book_url" required>';
        $html .= '<input type="submit" value="Load Book">';
        $html .= '</form>';
        $html .= '</body>';
        $html .= '</html>';
        
        return $html;
    }
}

// Initialize the application
$app = new App();
$app->init();

?>
