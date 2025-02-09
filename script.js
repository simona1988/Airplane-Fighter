const PROJECTILE_SPEED = 10;
const PROJECTILE_UPDATE_INTERVAL = 30;
const MIN_PROJECTILE_POSITION = 0;
const PROJECTILE_WIDTH = 5;
const PROJECTILE_HEIGHT = 10;
const OBSTACLE_SPEED = 5;
const OBSTACLE_POSITION_UPDATE_INTERVAL = 50;
const OBSTACLE_SIZE = 50;
const MOVE_AMOUNT = 20;
const OBSTACLE_SPAWN_INTERVAL = 2000;

const airplane = document.getElementById('airplane');
const moveLeftAirplane = document.getElementById('move-left');
const moveRightAirplane = document.getElementById('move-right');
const gameContainer = document.getElementById('game-container');
const containerWidth = gameContainer.offsetWidth;
const airplaneWidth = airplane.offsetWidth;

let airplanePosition = (containerWidth - airplaneWidth) / 2;
airplane.style.left = `${airplanePosition}px`;

let isGameOver = false;
let score = 0;
const obstacleIntervals = new Map();
const projectileIntervals = new Map();

function moveAirplane(direction) {
    if (isGameOver) {
        return;
    }   
    if (direction === 'left' && airplanePosition - MOVE_AMOUNT >= 0) {
        airplanePosition -= MOVE_AMOUNT;
    } else if (
        direction === 'right' && 
        airplanePosition + MOVE_AMOUNT <= containerWidth - airplaneWidth
    ) {
        airplanePosition += MOVE_AMOUNT;
    }   
    airplane.style.left = `${airplanePosition}px`;
}

moveLeftAirplane.addEventListener('click', () => moveAirplane('left'));
moveRightAirplane.addEventListener('click', () => moveAirplane('right'));

function checkCollision(element1, element2) {
    element1 = element1.getBoundingClientRect();
    element2 = element2.getBoundingClientRect();
    return !(element1.bottom < element2.top ||
        element1.top > element2.bottom ||
        element1.right < element2.left ||
        element1.left > element2.right);
}

function createObstacle() {
    if (isGameOver) {
        return;
    }  
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${Math.random() * (containerWidth - OBSTACLE_SIZE)}px`;
    gameContainer.appendChild(obstacle);
    moveObstacle(obstacle);
}

function moveObstacle(obstacle) {
    let obstaclePosition = 0;
    const interval = setInterval(() => {
        if (isGameOver) {
            clearInterval(interval);
            obstacle.remove();
            obstacleIntervals.delete(obstacle);
            return;
        }
        obstaclePosition += OBSTACLE_SPEED;
        obstacle.style.top = `${obstaclePosition}px`;      
        if (obstaclePosition > gameContainer.offsetHeight) {
            clearInterval(interval);
            obstacle.remove();
            obstacleIntervals.delete(obstacle);
        }       
        if (checkCollision(airplane, obstacle)) {
            endGame();
            clearInterval(interval);
            obstacle.remove();
            obstacleIntervals.delete(obstacle);
        }
    }, OBSTACLE_POSITION_UPDATE_INTERVAL);   
    obstacleIntervals.set(obstacle, interval);
}

function shootProjectile() {
    const projectile = document.createElement('div');
    projectile.classList.add('projectile');
    projectile.style.left = `${airplanePosition + airplaneWidth / 2 
        - PROJECTILE_WIDTH / 2}px`;
    projectile.style.top = `${gameContainer.offsetHeight - airplane.offsetHeight 
        - PROJECTILE_HEIGHT}px`;
    gameContainer.appendChild(projectile);
    moveProjectile(projectile);
}

function moveProjectile(projectile) {
    let projectilePosition = parseInt(projectile.style.top, 10);
    const interval = setInterval(() => {
        if (isGameOver) {
            clearInterval(interval);
            projectile.remove();
            projectileIntervals.delete(projectile);
            return;
        }
        projectilePosition -= PROJECTILE_SPEED;
        projectile.style.top = `${projectilePosition}px`;       
        if (projectilePosition < MIN_PROJECTILE_POSITION) {
            clearInterval(interval);
            projectile.remove();
            projectileIntervals.delete(projectile);
            return;
        }       
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach((obstacle) => {
            if (checkCollision(projectile, obstacle)) {
                clearInterval(interval);
                projectile.remove();
                projectileIntervals.delete(projectile);
                clearInterval(obstacleIntervals.get(obstacle));
                obstacleIntervals.delete(obstacle);
                obstacle.remove();
                ++score;
                document.getElementById('score').textContent = score;
            }
        });
    }, PROJECTILE_UPDATE_INTERVAL);  
    projectileIntervals.set(projectile, interval);
}

function endGame() {
    isGameOver = true;
    const message = document.getElementById('game-over-message');
    message.style.display = 'block';
    message.textContent = `Game over. Obstacles destroyed: ${score}`;
    obstacleIntervals.forEach((interval, obstacle) => {
        clearInterval(interval);
        obstacle.remove();
    });
    projectileIntervals.forEach((interval, projectile) => {
        clearInterval(interval);
        projectile.remove();
    });   
    obstacleIntervals.clear();
    projectileIntervals.clear();
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
}, OBSTACLE_SPAWN_INTERVAL);