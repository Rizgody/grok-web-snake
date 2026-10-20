const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('grokSnakeHigh') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

highScoreEl.textContent = highScore;

function drawGame() {
  // Clear
  ctx.fillStyle = '#1a1a22';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#00ff9d' : '#00cc7a';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });

  // Draw food
  ctx.fillStyle = '#ff4757';
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  // Self collision
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
      localStorage.setItem('grokSnakeHigh', highScore);
    }
    placeFood();
  } else {
    snake.pop();
  }
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  // Make sure food isn't on snake
  for (let segment of snake) {
    if (food.x === segment.x && food.y === segment.y) {
      placeFood();
      return;
    }
  }
}

function gameOver() {
  gameRunning = false;
  clearInterval(gameLoop);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = 'Pause';
  alert(`Game Over! Score: ${score}`);
}

function startGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreEl.textContent = score;
  placeFood();
  gameRunning = true;
  gamePaused = false;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  pauseBtn.textContent = 'Pause';

  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(() => {
    if (!gamePaused) {
      moveSnake();
      drawGame();
    }
  }, 100);
}

function togglePause() {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
}

document.addEventListener('keydown', (e) => {
  if (!gameRunning || gamePaused) return;

  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (dx === 0) { dx = 1; dy = 0; }
      break;
  }
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

// Initial draw
drawGame();