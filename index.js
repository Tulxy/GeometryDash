const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Physics
const gravity = 0.75;
const jumpForce = -21;
const worldSpeed = 12;

const player = {
  width: 120,
  height: 120,
  x: 400,
  y: 700,
  vy: 0,
  vx: 0,
  isOnGround: false,
  angle: 0
};

const player_hitbox = {
  x: player.x + 10,
  y: player.y + 10,
  width: player.width - 20,
  height: player.height - 20,
};

const ground = {
  y: 750,
};

const obstacles = [
  { x: 1400, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 2000, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 2120, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 2600, y: ground.y - 120, width: 120, height: 120, top: 120, type: "block" },
  { x: 2600, y: ground.y - 240, width: 120, height: 120, type: "spike" },

  { x: 3200, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 3320, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 3440, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 3900, y: ground.y - 120, width: 120, height: 120, type: "block" },
  { x: 3900, y: ground.y - 240, width: 120, height: 120, type: "block" },

  { x: 4080, y: ground.y - 120, width: 120, height: 120, type: "spike" },

  { x: 4600, y: ground.y - 120, width: 360, height: 120, type: "block" },
  { x: 4960, y: ground.y - 240, width: 120, height: 120, type: "spike" },

  { x: 5400, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 5640, y: ground.y - 120, width: 120, height: 120, type: "spike" },
  { x: 5640, y: ground.y - 240, width: 120, height: 120, type: "spike" },
];

let gameOver = false;

// Movement
document.addEventListener("keydown", (e) => {
  if ((e.key === " " || e.code === "Space" || e.code === "ArrowUp") && player.isOnGround) {
    jump();
  }
});

canvas.addEventListener("click", () => {
  if (player.isOnGround) jump();
});

// Jump
function jump() {
  player.vy = jumpForce;
  player.isOnGround = false;
}

function update() {
  if (gameOver) return;

  if (player.vy < 0) {
    player.vy += gravity;
  } else {
    player.vy += gravity * 2.5;
  }

  player.y += player.vy;

  // Ground collision
  if (player.y + player.height >= ground.y) {
    player.y = ground.y - player.height;
    player.vy = 0;
    player.isOnGround = true;
  } else {
    player.isOnGround = false;
  }

  player_hitbox.x = player.x + 10;
  player_hitbox.y = player.y + 10;

// Obstacle collision
  for (const obs of obstacles) {
    obs.x -= worldSpeed;

    const collidingX = player_hitbox.x + player_hitbox.width > obs.x && player_hitbox.x < obs.x + obs.width;
    const collidingY = player_hitbox.y + player_hitbox.height > obs.y && player_hitbox.y < obs.y + obs.height;

    if (collidingX && collidingY) {
      if (obs.type === "block") {
        const playerBottom = player_hitbox.y + player_hitbox.height;
        const playerPrevBottom = playerBottom - player.vy;

        if (playerPrevBottom <= obs.y && player.vy >= 0) {
          // přistání na vrchu bloku
          player.y = obs.y - player.height;
          player.vy = 0;
          player.isOnGround = true;
        } else {
          // náraz z boků
          gameOver = true;
        }
      }
      if (obs.type === "spike") {
        gameOver = true;
      } else {
        if (obsTop < player.y + player.height) {
          player.y = obs.y - player.height;
          player.vy = 0;
          player.isOnGround = true;
        } else if (obsTop > player.y + player.height) {
          gameOver = true;
        }
        else {
          player.isOnGround = false;
        }
      }
    }

    if (obs.x + obs.width < 0) {
      obs.x = canvas.width + Math.random() * 600;
    }
  }

  if (!player.isOnGround) {
    player.angle += 0.07;
  } else {
    player.angle = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Země
  ctx.beginPath();
  ctx.fillStyle = "#0d7700";
  ctx.fillRect(0, ground.y, canvas.width, canvas.height - ground.y);

  // Hráč
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2); // move origin to center
  ctx.rotate(player.angle);
  ctx.fillStyle = "#ffdf00";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  ctx.strokeRect(-player.width / 2, -player.height / 2, player.width, player.height);
  ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();

  ctx.fillStyle = "#000000";
  for (const obs of obstacles) {
    if (obs.type === "spike") {
      ctx.beginPath();
      ctx.moveTo(obs.x, obs.y + obs.height);
      ctx.lineTo(obs.x + obs.width / 2, obs.y);
      ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
      ctx.closePath();
      ctx.fillStyle = "#ff0000";
      ctx.fill();
    } else {
      ctx.fillStyle = "#000000";
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
