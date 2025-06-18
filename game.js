const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 18;
const PLAYER_X = 20;
const AI_X = WIDTH - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Game state
let playerY = (HEIGHT - PADDLE_HEIGHT) / 2;
let aiY = (HEIGHT - PADDLE_HEIGHT) / 2;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);

function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = clamp(mouseY - PADDLE_HEIGHT / 2, 0, HEIGHT - PADDLE_HEIGHT);
});

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update game objects
function update() {
  // Move ball
  ballX += ballVelX;
  ballY += ballVelY;

  // Ball collision with top/bottom
  if (ballY < 0) {
    ballY = 0;
    ballVelY *= -1;
  }
  if (ballY + BALL_SIZE > HEIGHT) {
    ballY = HEIGHT - BALL_SIZE;
    ballVelY *= -1;
  }

  // Ball collision with player paddle
  if (
    ballX < PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH;
    ballVelX *= -1;
    // Add a little "english" based on hit position
    let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    collidePoint /= PADDLE_HEIGHT / 2;
    ballVelY = BALL_SPEED * collidePoint;
  }

  // Ball collision with AI paddle
  if (
    ballX + BALL_SIZE > AI_X &&
    ballY + BALL_SIZE > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_SIZE;
    ballVelX *= -1;
    let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    collidePoint /= PADDLE_HEIGHT / 2;
    ballVelY = BALL_SPEED * collidePoint;
  }

  // Ball out of bounds (left or right)
  if (ballX < 0 || ballX > WIDTH) {
    resetBall();
  }

  // AI paddle movement (simple follow)
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
    aiY += PADDLE_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
    aiY -= PADDLE_SPEED;
  }
  aiY = clamp(aiY, 0, HEIGHT - PADDLE_HEIGHT);
}

function resetBall() {
  ballX = WIDTH / 2 - BALL_SIZE / 2;
  ballY = HEIGHT / 2 - BALL_SIZE / 2;
  // Random direction
  ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Draw everything
function draw() {
  // Clear
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Draw middle line
  ctx.strokeStyle = "#fff";
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = "#0ff";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillStyle = "#f00";
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillStyle = "#fff";
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Start the game
gameLoop();