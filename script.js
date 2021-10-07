let board = null;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getEmptyArr() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function getTurnedBoard(arr2D) {
  const copy = getEmptyArr();
  for (let i = 0; i < arr2D.length; i++) {
    for (let j = 0; j < arr2D[i].length; j++) {
      copy[i][j] = arr2D[j][i];
    }
  }

  return copy;
}

function checkWin(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 2048) {
        console.warn("YOU WON!!!");
        console.log("but you can keep playing");
        return;
      }
    }
  }
}

function getEmptyCell(arr2D) {
  const options = [];
  for (let i = 0; i < arr2D.length; i++) {
    for (let j = 0; j < arr2D[i].length; j++) {
      if (!arr2D[i][j]) options.push({ i, j });
    }
  }

  if (options.length === 0) return;

  const index = getRandomInt(0, options.length - 1);

  return options[index];
}

function addNumber(board) {
  const cell = getEmptyCell(board);

  if (!cell) {
    document.onkeydown = null;
    console.warn("YOU LOST :(");
    return;
  }

  const { i, j } = cell;
  board[i][j] = Math.random() > 0.7 ? 4 : 2;
}

function initializeBoard() {
  for (let k = 0; k < 2; k++) {
    addNumber(board);
  }
  console.table(board);
}

function combine(arr) {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i >= 0; i--) {
    if (newArr[i] === newArr[i - 1]) {
      newArr[i] += newArr[i - 1];
      newArr[i - 1] = 0;
    }
  }

  if (checkSlide(newArr, arr)) {
    return slideRow(newArr);
  }

  return arr;
}

function checkSlide(newArr, oldArr) {
  for (let i = 0; i < newArr.length; i++) {
    if (newArr[i] !== oldArr[i]) return true;
  }

  return false;
}

function slideRow(row) {
  const arr = row.filter((el) => el);
  const zeros = new Array(4 - arr.length).fill(0);
  const newArr = [...zeros, ...arr];

  return newArr;
}

function slideRight(board) {
  for (let i = 0; i < board.length; i++) {
    const slide = slideRow(board[i]);
    const combined = combine(slide);
    board[i] = combined;
  }
  addNumber(board);

  return board;
}

function slideLeft(board) {
  for (let i = 0; i < board.length; i++) {
    const reversedOriginal = board[i].reverse();
    const slide = slideRow(reversedOriginal);
    const combined = combine(slide);
    const reversedNew = combined.reverse();
    board[i] = reversedNew;
  }
  addNumber(board);

  return board;
}

board = getEmptyArr();
initializeBoard();

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == "38") {
    const side = getTurnedBoard(board);
    const sideSlide = slideLeft(side);
    board = getTurnedBoard(sideSlide);
  } else if (e.keyCode == "40") {
    const side = getTurnedBoard(board);
    const sideSlide = slideRight(side);
    board = getTurnedBoard(sideSlide);
  } else if (e.keyCode == "37") {
    board = slideLeft(board);
  } else if (e.keyCode == "39") {
    board = slideRight(board);
  }

  console.table(board);
  checkWin(board);
}

document.onkeydown = checkKey;
