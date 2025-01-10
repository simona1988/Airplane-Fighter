const airplane = document.getElementById('airplane');
const moveLeftAirplane = document.getElementById('move-left');
const moveRightAirplane = document.getElementById('move-right');
const gameContainer = document.getElementById('game-container');
const timerElement = document.getElementById('timer');
const containerWidth = gameContainer.offsetWidth;
const airplaneWidth = airplane.offsetWidth;

let airplanePosition = (containerWidth - airplaneWidth) / 2;
airplane.style.left = `${airplanePosition}px`;

let isGameOver = false;
let score = 0;

function moveAirplane(direction) {
    if (isGameOver) {
        return;
    }
    const moveAmount = 20;
    if (direction === 'left' && airplanePosition - moveAmount >= 0) {
        airplanePosition -= moveAmount;
    } else if (direction === 'right' && airplanePosition + moveAmount <= containerWidth - airplaneWidth) {
        airplanePosition += moveAmount;
    }
    airplane.style.left = `${airplanePosition}px`;
}

moveLeftAirplane.addEventListener('click', () => moveAirplane('left'));
moveRightAirplane.addEventListener('click', () => moveAirplane('right'));

function checkCollision(airplane, obstacle) {
    const airplaneTop = airplane.offsetTop;
    const airplaneLeft = airplane.offsetLeft;
    const airplaneRight = airplaneLeft + airplane.offsetWidth;
    const airplaneBottom = airplaneTop + airplane.offsetHeight;
    const obstacleTop = obstacle.offsetTop;
    const obstacleLeft = obstacle.offsetLeft;
    const obstacleRight = obstacleLeft + obstacle.offsetWidth;
    const obstacleBottom = obstacleTop + obstacle.offsetHeight;

    return !(
        airplaneBottom < obstacleTop ||
        airplaneTop > obstacleBottom ||
        airplaneRight < obstacleLeft ||
        airplaneLeft > obstacleRight
    );
}

function createObstacle() {
    if (isGameOver) {
        return;
    }
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${Math.random() * (containerWidth - 50)}px`;
    gameContainer.appendChild(obstacle);
    moveObstacle(obstacle);
}

function moveObstacle(obstacle) {
    let obstaclePosition = 0;
    const interval = setInterval(() => {
        if (isGameOver) {
            clearInterval(interval);
            obstacle.remove();
            return;
        }
        obstaclePosition += 5;
        obstacle.style.top = `${obstaclePosition}px`;
        if (obstaclePosition > gameContainer.offsetHeight) {
            clearInterval(interval);
            obstacle.remove();
            ++score;
            document.getElementById('score').textContent = score;
        }
        if (checkCollision(airplane, obstacle)) {
            endGame();
            clearInterval(interval);
            obstacle.remove();
            return;
        }
    }, 50);
}

function endGame() {
    isGameOver = true;
    const message = document.getElementById('game-over-message');
    message.style.display = 'block';
    message.textContent = `Game over. Obstacles avoided: ${score}`;
}

setInterval(() => {
    if (!isGameOver) {
        createObstacle();
    }
}, 2000);