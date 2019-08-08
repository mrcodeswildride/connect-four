// initialize variables
var turn = 1;
var moving = false;
var gameEnded = false;

// two-dimensional array to represent where the pieces are
var boardData = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
];

// get game elements
var columns = document.getElementsByClassName('column');
var turnLabel = document.getElementById('turn');
var restartButton = document.getElementById('restart');

// activate each column
for (var i = 0; i < columns.length; i++) {
    columns[i].addEventListener('click', function(event) {
        if (!moving && !gameEnded) {
            // find the corresponding column number
            var index = parseInt(this.getAttribute('data-index'), 10);

            // find the corresponding column
            var column = columns.item(index);

            // count how many pieces are already in the column
            var numPieces = getNumPieces(column);

            if (numPieces < 6) { // drop a piece only if the column is not full
                // set variable to prevent user interaction until piece is done falling
                moving = true;

                // create a new piece of the correct color
                var piece = document.createElement('div');
                piece.classList.add('piece');
                piece.classList.add('player' + turn);

                // put the piece at the top of the column
                column.appendChild(piece);
                piece.style.left = '1px';
                piece.style.top = '0';

                // start the animation for having the piece fall down the column
                move(piece, index, numPieces);
            }
        }
    });
}

// activate the restart button
restartButton.addEventListener('click', function() {
    if (!moving) {
        // clear all pieces from the squares
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];

            for (var j = 0; j < column.children.length; j++) {
                var square = column.children[j];

                // check if the square contains a piece
                if (square.classList.contains("player1") || square.classList.contains("player2")) {
                    // clear piece from the square
                    square.classList.remove("player1");
                    square.classList.remove("player2");
                }
            }
        }

        // clear pieces from board data
        for (var x = 0; x < 7; x++) {
            for (var y = 0; y < 6; y++) {
                boardData[x][y] = 0;
            }
        }

        // restart the game
        turn = 1;
        turnLabel.innerHTML = "Red's turn";
        gameEnded = false;
    }
});

function getNumPieces(column) {
    var numPieces = 0;

    // loop through all the squares
    for (var i = 0; i < column.children.length; i++) {
        var square = column.children[i];

        // check if the square contains a piece
        if (square.classList.contains("player1") || square.classList.contains("player2")) {
            numPieces++;
        }
    }

    return numPieces;
}

function move(piece, index, numPieces) {
    // move the piece down five pixels within its column
    var top = parseInt(piece.style.top, 10);
    piece.style.top = top + 5 + 'px';

    // check if the piece has reached the last empty square within its column
    if (top < 318.5 - numPieces * 61.5) {
        // piece has not reached the last empty square, so move it down some more
        setTimeout(function() {
            move(piece, index, numPieces);
        }, 10);
    }
    else {
        // piece has reached the last empty square, so put piece in square
        var pieceClass = piece.classList.contains("player1") ? "player1" : "player2";
        piece.remove();
        columns[index].children[5 - numPieces].classList.add(pieceClass);

        // piece has reached the last empty square, so allow user interaction again
        moving = false;

        // update board data
        boardData[index][5 - numPieces] = turn;

        // check for four in a row
        var winner = checkForWinner();

        if (winner) {
            // end the game
            gameEnded = true;

            if (turn == 1) {
                turnLabel.innerHTML = "Red wins!";
            }
            else if (turn == 2) {
                turnLabel.innerHTML = "Black wins!";
            }
        }
        else {
            // switch to the other player's turn
            if (turn == 1) {
                turn = 2;
                turnLabel.innerHTML = "Black's turn";
            }
            else if (turn == 2) {
                turn = 1;
                turnLabel.innerHTML = "Red's turn";
            }
        }
    }
}

function checkForWinner() {
    // loop through all the squares
    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 6; y++) {
            var squareData = boardData[x][y];

            if (squareData != 0) { // check if there is a piece in the square
                // check all directions to see if four in a row
                var up = boardData[x][y - 1] == squareData && boardData[x][y - 2] == squareData && boardData[x][y - 3] == squareData;
                var upRight = x <= 3 && boardData[x + 1][y - 1] == squareData && boardData[x + 2][y - 2] == squareData && boardData[x + 3][y - 3] == squareData;
                var right = x <= 3 && boardData[x + 1][y] == squareData && boardData[x + 2][y] == squareData && boardData[x + 3][y] == squareData;
                var downRight = x <= 3 && boardData[x + 1][y + 1] == squareData && boardData[x + 2][y + 2] == squareData && boardData[x + 3][y + 3] == squareData;
                var down = boardData[x][y + 1] == squareData && boardData[x][y + 2] == squareData && boardData[x][y + 3] == squareData;
                var downLeft = x >= 3 && boardData[x - 1][y + 1] == squareData && boardData[x - 2][y + 2] == squareData && boardData[x - 3][y + 3] == squareData;
                var left = x >= 3 && boardData[x - 1][y] == squareData && boardData[x - 2][y] == squareData && boardData[x - 3][y] == squareData;
                var upLeft = x >= 3 && boardData[x - 1][y - 1] == squareData && boardData[x - 2][y - 2] == squareData && boardData[x - 3][y - 3] == squareData;

                if (up || upRight || right || downRight || down || downLeft || left || upLeft) {
                    // four in a row was found, so return the winner
                    return squareData;
                }
            }
        }
    }

    // four in a row was not found, so return 0
    return 0;
}
