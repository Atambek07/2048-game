const SIZE = 6;
let board = [];
let score = 0;
let highscore = localStorage.getItem("2048-highscore") || 0;
let gameOver = false;

function initBoard() {
  board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  score = 0;
  gameOver = false;
  document.getElementById("status").textContent = "";
  addTile();
  addTile();
  updateScore();
  drawBoard();
}

function drawBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
  board.forEach(row => {
    row.forEach(val => {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = val === 0 ? "" : val;
      tile.style.backgroundColor = getColor(val);
      boardEl.appendChild(tile);
    });
  });
}

function getColor(val) {
  const colors = {
    0: "#cdc1b4",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e"
  };
  return colors[val] || "#3c3a32";
}

function updateScore() {
  document.getElementById("score").textContent = "Score: " + score;
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("2048-highscore", highscore);
  }
  document.getElementById("highscore").textContent = "Best: " + highscore;
}

function addTile() {
  const empty = [];
  board.forEach((row, r) =>
    row.forEach((val, c) => {
      if (val === 0) empty.push({ r, c });
    })
  );

  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function move(direction) {
    if (gameOver) return;
  
    let rotated = false;
    let flipped = false;
  
    let newBoard = copyBoard(board);
  
    // Преобразуем доску в "влево" для упрощённой логики
    if (direction === "up") {
      newBoard = rotateLeft(newBoard);
    } else if (direction === "right") {
      newBoard = flipRows(newBoard);
    } else if (direction === "down") {
      newBoard = rotateLeft(newBoard);
      newBoard = flipRows(newBoard);
    }
  
    let moved = false;
  
    for (let r = 0; r < SIZE; r++) {
      const original = newBoard[r];
      const merged = mergeLine(original);
      newBoard[r] = merged;
      if (!arraysEqual(original, merged)) moved = true;
    }
  
    // Обратно в нормальный вид
    if (direction === "up") {
      newBoard = rotateRight(newBoard);
    } else if (direction === "right") {
      newBoard = flipRows(newBoard);
    } else if (direction === "down") {
      newBoard = flipRows(newBoard);
      newBoard = rotateRight(newBoard);
    }
  
    if (moved) {
      board = newBoard;
      addTile();
      drawBoard();
      updateScore();
      if (isGameOver()) {
        document.getElementById("status").textContent = "💀 Game Over!";
        gameOver = true;
      }
    }
  }
  

function mergeLine(line) {
  const newLine = line.filter(n => n !== 0);
  for (let i = 0; i < newLine.length - 1; i++) {
    if (newLine[i] === newLine[i + 1]) {
      newLine[i] *= 2;
      score += newLine[i];
      newLine[i + 1] = 0;
    }
  }
  return newLine.filter(n => n !== 0).concat(Array(SIZE - newLine.filter(n => n !== 0).length).fill(0));
}

function arraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function isGameOver() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return false;
      if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return false;
      if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return false;
    }
  }
  return true;
}

// Клавиши
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move("up");
  else if (e.key === "ArrowDown") move("down");
  else if (e.key === "ArrowLeft") move("left");
  else if (e.key === "ArrowRight") move("right");
});

// Старт

initBoard();
function copyBoard(b) {
    return b.map(row => row.slice());
  }
  
  function rotateLeft(b) {
    return b[0].map((_, i) => b.map(row => row[i])).reverse();
  }
  
  function rotateRight(b) {
    return b[0].map((_, i) => b.map(row => row[i]).reverse());
  }
  
  function flipRows(b) {
    return b.map(row => row.reverse());
  }
  