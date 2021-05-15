let columns = document.getElementsByClassName(`column`)
let squares = document.getElementsByClassName(`square`)
let turnParagraph = document.getElementById(`turnParagraph`)

let turn = `Red`
let moving = false
let gameOver = false
let intervalId

for (let column of columns) {
  column.addEventListener(`click`, clickColumn)
}

function clickColumn() {
  if (!moving && !gameOver) {
    let numPieces = getNumPieces(this)

    if (numPieces < 6) {
      moving = true

      let piece = document.createElement(`div`)
      piece.classList.add(`piece`, turn.toLowerCase())
      piece.style.left = `0`
      piece.style.top = `0`

      this.appendChild(piece)
      setInterval(move, 10, piece, numPieces)
    }
  }
}

function getNumPieces(column) {
  let numPieces = 0

  for (let square of column.children) {
    if (square.classList.contains(`red`) || square.classList.contains(`black`)) {
      numPieces++
    }
  }

  return numPieces
}

function move(piece, numPieces) {
  piece.style.top = `${piece.offsetTop + 5}px`

  if (piece.offsetTop == (5 - numPieces) * 60 + 10) {
    clearInterval(intervalId)

    let column = piece.parentElement

    piece.remove()
    column.children[5 - numPieces].classList.add(turn.toLowerCase())
    moving = false

    if (fourInRow()) {
      turnParagraph.classList.add(`win`)
      turnParagraph.innerHTML = `${turn} wins`
      gameOver = true
    } else if (boardIsFull()) {
      turnParagraph.classList.add(`win`)
      turnParagraph.innerHTML = `Tie game`
      gameOver = true
    } else {
      turn = turn == `Red` ? `Black` : `Red`
      turnParagraph.innerHTML = `${turn}'s turn`
    }
  }
}

function fourInRow() {
  for (let square of squares) {
    if (square.classList.contains(turn.toLowerCase())) {
      for (let yDirection = -1; yDirection <= 1; yDirection++) {
        for (let xDirection = -1; xDirection <= 1; xDirection++) {
          if (xDirection != 0 || yDirection != 0) {
            if (checkFourInRow(square, xDirection, yDirection)) {
              return true
            }
          }
        }
      }
    }
  }

  return false
}

function checkFourInRow(square, xDirection, yDirection) {
  let neighbors = []

  for (let i = 1; i <= 3; i++) {
    let neighbor = getNeighbor(square, i * xDirection, i * yDirection)

    if (neighbor == null || !neighbor.classList.contains(turn.toLowerCase())) {
      return false
    }

    neighbors.push(neighbor)
  }

  square.classList.add(`highlighted`)

  for (let neighbor of neighbors) {
    neighbor.classList.add(`highlighted`)
  }

  return true
}

function getNeighbor(square, xDiff, yDiff) {
  let column = square.parentElement // column of square
  let x // x coordinate of square, set below
  let y // y coordinate of square, set below

  // loop through columns to determine x
  for (let i = 0; i < columns.length; i++) {
    if (columns[i] == column) {
      x = i // found matching column, so set x
    }
  }

  // loop through squares in column to determine y
  for (let i = 0; i < column.children.length; i++) {
    if (column.children[i] == square) {
      y = i // found matching square, so set y
    }
  }

  // column of neighbor square
  let neighborColumn = columns[x + xDiff]

  if (neighborColumn == null) {
    // column is beyond edge, so no neighbor square
    return null
  } else {
    // if y + yDiff is beyond edge, will be null
    return neighborColumn.children[y + yDiff]
  }
}

function boardIsFull() {
  for (let square of squares) {
    if (!square.classList.contains(`red`) && !square.classList.contains(`black`)) {
      return false
    }
  }

  return true
}
