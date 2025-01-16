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

function checkCollision(projectile, obstacle) {
    projectile = projectile.getBoundingClientRect();
    obstacle = obstacle.getBoundingClientRect();
    return !(
        projectile.bottom < obstacle.top ||
        projectile.top > obstacle.bottom ||
        projectile.right < obstacle.left ||
        projectile.left > obstacle.right
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
        }
        if (checkCollision(airplane, obstacle)) {
            endGame();
            clearInterval(interval);
            obstacle.remove();
        }
    }, 50);
}

function shootProjectile() {
    const projectile = document.createElement('div');
    projectile.classList.add('projectile');
    projectile.style.left = `${airplanePosition + airplaneWidth / 2 - 5}px`;
    projectile.style.top = `${gameContainer.offsetHeight - airplane.offsetHeight - 10}px`;
    gameContainer.appendChild(projectile);
    moveProjectile(projectile);
}

function moveProjectile(projectile) {
    let projectilePosition = parseInt(projectile.style.top, 10);
    const interval = setInterval(() => {
        if (isGameOver) {
            clearInterval(interval);
            projectile.remove();
            return;
        }
        projectilePosition -= 10;
        projectile.style.top = `${projectilePosition}px`;
        if (projectilePosition < 0) {
            clearInterval(interval);
            projectile.remove();
            return;
        }
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach((obstacle) => {
            if (checkCollision(projectile, obstacle)) {
                clearInterval(interval);
                projectile.remove();
                obstacle.remove();
                ++score;
                document.getElementById('score').textContent = score;
            }
        });
    }, 30);
}

function endGame() {
    isGameOver = true;
    const message = document.getElementById('game-over-message');
    message.style.display = 'block';
    message.textContent = `Game over. Obstacles destroyed: ${score}`;
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isGameOver) {
        event.preventDefault();
        shootProjectile();
    }
});

setInterval(() => {
    if (!isGameOver) {
        createObstacle();
    }
}, 2000);