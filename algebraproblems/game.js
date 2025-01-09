// Game Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pops = 0;
let lives = 1;
let balloons = [];
let poppers = [];
let cooldown = 0; // Cooldown timer (in seconds)
let lastPopperTime = 0; // To track the time of the last popper placement
let cooldownInterval = 5; // 5 seconds cooldown for placing poppers

// Balloon class
class Balloon {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.radius = 20;
    }

    move() {
        this.x += this.speed;
    }

    draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(1, "darkred");

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }
}

// Popper class (tower)
class Popper {
    constructor(x, y, createdTime) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.createdTime = createdTime;  // Track when the popper was created
    }

    draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, "blue");
        gradient.addColorStop(1, "darkblue");

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }

    checkCollision(balloon) {
        const dist = Math.sqrt(Math.pow(this.x - balloon.x, 2) + Math.pow(this.y - balloon.y, 2));
        return dist < this.radius + balloon.radius;
    }

    isExpired(currentTime) {
        return currentTime - this.createdTime >= 5000;  // Popper expires after 5000ms (5 seconds)
    }
}

// Function to create random balloons
function createBalloon() {
    let speed = Math.random() * 1 + 1;  // Balloon speed between 1 and 2
    let y = Math.random() * (canvas.height - 40) + 20;  // Random y position
    balloons.push(new Balloon(0, y, speed));
}

// Function to update the game state
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create new balloon every 2 seconds
    if (Math.random() < 0.02) {
        createBalloon();
    }

    // Draw balloons and move them
    for (let i = 0; i < balloons.length; i++) {
        balloons[i].move();
        balloons[i].draw();

        // Check if balloon reaches the end (loses life)
        if (balloons[i].x > canvas.width) {
            balloons.splice(i, 1);
            lives--;
            document.getElementById("lives").innerText = lives;

            if (lives <= 0) {
                alert("Game Over!");
                resetGame();
            }
        }
    }

    // Draw and check if poppers hit balloons
    for (let i = 0; i < poppers.length; i++) {
        // Check if the popper has expired
        if (poppers[i].isExpired(Date.now())) {
            poppers.splice(i, 1); // Remove expired popper
            i--;  // Adjust index after removal
            continue;
        }

        poppers[i].draw();

        for (let j = 0; j < balloons.length; j++) {
            if (poppers[i].checkCollision(balloons[j])) {
                pops++;
                document.getElementById("popCount").innerText = pops;
                balloons.splice(j, 1);  // Remove popped balloon
                break;
            }
        }
    }

    // Handle cooldown for placing poppers
    if (cooldown > 0) {
        cooldown -= 1;
    }

    // Update cooldown display
    document.getElementById("cooldown").innerText = cooldown;

    // Win condition
    if (pops >= 100) {
        alert("You Win!");
        window.location.href = "https://youwin.com";
    }

    requestAnimationFrame(update);
}

// Add popper when clicking on the canvas (only if cooldown is 0)
canvas.addEventListener('click', (e) => {
    if (cooldown === 0 && lives > 0) {
        const x = e.offsetX;
        const y = e.offsetY;
        const createdTime = Date.now();  // Get the current time in milliseconds
        poppers.push(new Popper(x, y, createdTime));
        cooldown = cooldownInterval; // Set cooldown to 5 seconds after placing a popper
    }
});

// Reset the game
function resetGame() {
    pops = 0;
    lives = 1;
    document.getElementById("popCount").innerText = pops;
    document.getElementById("lives").innerText = lives;
    balloons = [];
    poppers = [];
    cooldown = 0;
    document.getElementById("cooldown").innerText = cooldown;
    update();
}

update();  // Start the game loop
