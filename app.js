// Get the canvas element and set the context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 400;
canvas.height = 400;

// Select score elements
const scoreBoard = document.getElementById('score-board');
const highestScoreBoard = document.getElementById('highest-score');

// Define constants for game
const snakeSize = 20;
let snake = [{ x: 100, y: 100 }];
let food = { x: 200, y: 200 };
let dx = snakeSize; 
let dy = 0; 
let score = 0;
let gameOver = false;

// Retrieve highest score from localStorage or set it to 0
let highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0;
highestScoreBoard.textContent = `Highest Score: ${highestScore}`;

// Draw the grid
function drawGrid() {
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.5;

    for (let x = 0; x < canvas.width; x += snakeSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += snakeSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Draw the snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });
}

// Draw the food
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

// Update the snake's position
function updateSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScores(); // Update the score display
        generateFood();
    } else {
        snake.pop();
    }
}

// Check for collisions with walls or self
function checkCollisions() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver = true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

// Generate food at a random position
function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    const y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
    food = { x, y };
}

// Update the score and highest score
function updateScores() {
    scoreBoard.textContent = `Score: ${score}`;
    
    if (score > highestScore) {
        highestScore = score;
        highestScoreBoard.textContent = `Highest Score: ${highestScore}`;
        localStorage.setItem('highestScore', highestScore); // Save to local storage
    }
}

// Handle keyboard input for snake movement
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -snakeSize;
    } else if (event.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = snakeSize;
    } else if (event.key === 'ArrowLeft' && dx === 0) {
        dx = -snakeSize;
        dy = 0;
    } else if (event.key === 'ArrowRight' && dx === 0) {
        dx = snakeSize;
        dy = 0;
    }
});

// Game loop
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', canvas.width / 4, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();  
    updateSnake();
    checkCollisions();
    drawSnake();
    drawFood();

    setTimeout(gameLoop, 100);
}

// Start the game loop
gameLoop();
