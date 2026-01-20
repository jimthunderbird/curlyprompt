<?php
function generateSudoku() {
    $board = array();
    for ($i = 0; $i < 9; $i++) {
        $board[$i] = array_fill(0, 9, 0);
    }

    $numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle($numbers);
    $board[0] = $numbers;

    solveSudoku($board);
    
    $puzzle = [];
    for ($i = 0; $i < 9; $i++) {
        $puzzle[$i] = $board[$i];
    }
    
    $holes = 40;
    for ($i = 0; $i < $holes; $i++) {
        $row = rand(0, 8);
        $col = rand(0, 8);
        $puzzle[$row][$col] = 0;
    }
    
    return $puzzle;
}

function solveSudoku(&$board) {
    for ($row = 0; $row < 9; $row++) {
        for ($col = 0; $col < 9; $col++) {
            if ($board[$row][$col] == 0) {
                for ($num = 1; $num <= 9; $num++) {
                    if (isValid($board, $row, $col, $num)) {
                        $board[$row][$col] = $num;
                        if (solveSudoku($board)) {
                            return true;
                        }
                        $board[$row][$col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid($board, $row, $col, $num) {
    for ($i = 0; $i < 9; $i++) {
        if ($board[$row][$i] == $num || $board[$i][$col] == $num) {
            return false;
        }
    }

    $boxRow = floor($row / 3) * 3;
    $boxCol = floor($col / 3) * 3;
    for ($i = 0; $i < 3; $i++) {
        for ($j = 0; $j < 3; $j++) {
            if ($board[$boxRow + $i][$boxCol + $j] == $num) {
                return false;
            }
        }
    }
    return true;
}

$puzzle = generateSudoku();
?>

<html>
<head>
    <title>Simple Sudoku</title>
    <style>
        body {
            background: wheat;
            font-family: 'Indie Flower', cursive;
            font-size: 20px;
        }
        #sudokuboard {
            margin: 0 auto;
            text-align: center;
        }
        .box {
            border: 2px gold solid;
            background: dark sea green;
            padding: 0;
            margin: 0;
            display: inline-block;
        }
        .cell {
            width: 50px;
            height: 50px;
            color: black;
            font-weight: bold;
            background: white;
            margin: 0;
            padding: 0;
            display: inline-block;
            text-align: center;
            line-height: 50px;
        }
        .cell.fixed {
            background: light grey;
        }
    </style>
</head>
<body>
    <div id="sudokuboard">
        <?php
        for ($i = 0; $i < 9; $i++) {
            if ($i % 3 == 0 && $i != 0) {
                echo "<br>";
            }
            echo "<div class='box'>";
            for ($j = 0; $j < 9; $j++) {
                if ($j % 3 == 0 && $j != 0) {
                    echo "<span style='display:inline-block;width:0px;'>&nbsp;</span>";
                }
                $value = $puzzle[$i][$j];
                $class = ($value != 0) ? "cell fixed" : "cell";
                echo "<div class='$class'>" . ($value != 0 ? $value : "") . "</div>";
            }
            echo "</div><br>";
        }
        ?>
    </div>
</body>
</html>

