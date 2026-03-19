// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cube = document.getElementById("cube");

// Game constants
const gravity = 0.8;
const jumpForce = -21;
const worldSpeed = 14;

let gameOver = false;
let win = false;
let distance = 0;

// Player
const player = {
  width: 120,
  height: 120,
  x: 400,
  y: 700,
  vy: 0,
  isOnGround: false,
  angle: 0
};

// Game hitboxes
const player_hitbox = {
  x: 0, y: 0,
  width: player.width - 20,
  height: player.height - 20,
};

const spike_hitbox = {
  x: 0, y: 0,
  width: 25,
  height: 80,
};

const block_hitbox = {
  x: 0, y: 0,
  width: 120,
  height: 120,
};

const ground = { y: 750 };

// Level
const obstacles = [
  { x: 1400, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 2000, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 2120, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 2600, y: ground.y - 120, width: 120, height: 120, type: "block" },
  { x: 2600, y: ground.y - 240, width: 120, height: 120, type: "spike" },

  { x: 3200, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 3320, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 3440, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 4200, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 4320, y: ground.y - 120, width: 120, height: 120, type: "block" },
  { x: 4320, y: ground.y - 240, width: 120, height: 120, type: "spike" },
  { x: 4440, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 5000, y: ground.y - 120, width: 120, height: 120, type: "block" },
  { x: 5000, y: ground.y - 240, width: 120, height: 120, type: "spike" },


  { x: 5600, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 5600, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 6240, y: ground.y - 120, width: 120, height: 120, type: "block" },
  { x: 6240, y: ground.y - 240, width: 120, height: 120, type: "spike" },
  { x: 6360, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 6240, y: ground.y - 600, width: 120, height: 120, type: "block" },
  { x: 6240, y: ground.y - 720, width: 120, height: 120, type: "block" },
  { x: 6240, y: ground.y - 840, width: 120, height: 120, type: "block" },
  { x: 6240, y: ground.y - 960, width: 120, height: 120, type: "block" },

  { x: 7000, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 7120, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 7240, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 7560, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 7680, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 8340, y: ground.y - 120, width: 120, height: 120, type: "block" },
  { x: 8460, y: ground.y - 120, width: 120, height: 120, type: "block" },
  { x: 8340, y: ground.y - 240, width: 120, height: 120, type: "spike" },
  { x: 8460, y: ground.y - 240, width: 120, height: 120, type: "spike" }
];

// Jump mechanic
document.addEventListener("keydown", (e) => {
  if ((e.key === " " || e.code === "Space" || e.code === "ArrowUp") && player.isOnGround) {
    jump();
  }
});

canvas.addEventListener("click", () => {
  if (player.isOnGround) jump();
});

function jump() {
  player.vy = jumpForce;
  player.isOnGround = false;
}


function update() {
  if (gameOver || win) return;

  if (distance >= 10000) {
    win = true;
  }

  distance += worldSpeed;

  // Gravity
  player.vy += player.vy < 0 ? gravity : gravity * 2.5;
  player.y += player.vy;

  // Update player hitbox
  player_hitbox.x = player.x + 10;
  player_hitbox.y = player.y + 10;

  // Ground collision
  if (player.y + player.height >= ground.y) {
    player.y = ground.y - player.height;
    player.vy = 0;
    player.isOnGround = true;
  } else {
    player.isOnGround = false;
  }

  // Obstacle collision
  for (const obs of obstacles) {
    obs.x -= worldSpeed;

    // Update obstacle hitbox
    if (obs.type === "spike") {
      spike_hitbox.x = obs.x + obs.width / 2 - spike_hitbox.width / 2;
      spike_hitbox.y = obs.y + (obs.height - spike_hitbox.height);
    } else {
      block_hitbox.x = obs.x;
      block_hitbox.y = obs.y;
      block_hitbox.width = obs.width;
      block_hitbox.height = obs.height;
    }

    const hitbox = obs.type === "spike" ? spike_hitbox : block_hitbox;

    // Obstacle collision
    const collidingX = player_hitbox.x + player_hitbox.width > hitbox.x && player_hitbox.x < hitbox.x + hitbox.width;
    const collidingY = player_hitbox.y + player_hitbox.height > hitbox.y && player_hitbox.y < hitbox.y + hitbox.height;


    if (collidingX && collidingY) {
      if (obs.type === "spike") {
        gameOver = true;
      } else {
        const playerPrevBottom = (player_hitbox.y + player_hitbox.height) - player.vy;

        if (playerPrevBottom <= hitbox.y + 10) {
          // Block landing collision
          player.y = hitbox.y - player.height;
          player_hitbox.y = player.y + 10;
          player.vy = 0;
          player.isOnGround = true;
        } else {
          // Block collision from bottom or side
          gameOver = true;
        }
      }
    }

  }

  // Player rotation
  if (!player.isOnGround) {
    player.angle += 0.07;
  } else {
    player.angle = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, ground.y, canvas.width, canvas.height - ground.y);

  // Player
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate(player.angle);
  ctx.drawImage(cube, -player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();

  // Score
  ctx.fillStyle = "black";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${Math.floor(distance / 100)}`, 20, 30);

  // Obstacles
  for (const obs of obstacles) {
    if (obs.type === "spike") {
      ctx.beginPath();
      ctx.moveTo(obs.x, obs.y + obs.height);
      ctx.lineTo(obs.x + obs.width / 2, obs.y);
      ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
      ctx.closePath();
      ctx.fillStyle = "#000000";
      ctx.fill();
    } else {
      ctx.fillStyle = "#000000";
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
  }

  // Game over screen
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 72px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Your score: ${Math.floor(distance / 100)}`, canvas.width / 2, canvas.height / 2 + 100);
  }

  // Win screen
  if (win) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 72px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
