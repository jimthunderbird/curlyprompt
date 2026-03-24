<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel App</title>
</head>
<body>
    @if($loggedIn)
        <p>You are logged in</p>
    @else
        <p>You are not logged in</p>
    @endif
</body>
</html>
