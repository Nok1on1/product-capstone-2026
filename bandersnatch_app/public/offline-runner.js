(() => {
  const canvas = document.getElementById("runner");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const messageEl = document.getElementById("message");
  const jumpButton = document.getElementById("jump");
  const duckButton = document.getElementById("duck");
  const restartButton = document.getElementById("restart");

  const storageKey = "bandersnatch_offline_runner_best";
  const groundY = 285;
  const player = { x: 96, y: groundY - 58, width: 86, height: 58, vy: 0, ducking: false };
  const game = {
    running: false,
    over: false,
    score: 0,
    best: Number(localStorage.getItem(storageKey) || 0),
    speed: 5.2,
    nextObstacleIn: 80,
    obstacles: [],
    clouds: [
      { x: 160, y: 68, size: 1 },
      { x: 520, y: 94, size: 0.78 },
      { x: 760, y: 52, size: 0.9 },
    ],
  };

  bestEl.textContent = String(game.best);

  function reset() {
    game.running = false;
    game.over = false;
    game.score = 0;
    game.speed = 5.2;
    game.nextObstacleIn = 80;
    game.obstacles = [];
    player.y = groundY - player.height;
    player.vy = 0;
    player.ducking = false;
    scoreEl.textContent = "0";
    messageEl.classList.remove("hidden");
    messageEl.innerHTML = "<strong>Tap or press Space to start</strong><span>Jump road cones, duck campus signs, and keep Bus #3 rolling.</span>";
  }

  function start() {
    if (game.over) {
      reset();
    }
    game.running = true;
    messageEl.classList.add("hidden");
  }

  function jump() {
    if (!game.running) start();
    if (game.over) return;
    const playerBottom = player.y + player.height;
    if (playerBottom >= groundY - 2) {
      player.vy = -14.5;
    }
  }

  function setDuck(value) {
    if (!game.running || game.over) return;
    player.ducking = value;
  }

  function spawnObstacle() {
    const isSign = Math.random() > 0.62;
    game.obstacles.push({
      x: canvas.width + 40,
      y: isSign ? groundY - 118 : groundY - 44,
      width: isSign ? 42 : 34,
      height: isSign ? 54 : 44,
      type: isSign ? "sign" : "cone",
    });
    game.nextObstacleIn = 72 + Math.random() * 92 - Math.min(game.speed * 3, 24);
  }

  function playerBounds() {
    if (player.ducking) {
      return {
        x: player.x + 6,
        y: player.y + 24,
        width: player.width - 8,
        height: player.height - 22,
      };
    }
    return { x: player.x + 8, y: player.y + 6, width: player.width - 16, height: player.height - 8 };
  }

  function collides(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  function endGame() {
    game.running = false;
    game.over = true;
    game.best = Math.max(game.best, Math.floor(game.score));
    localStorage.setItem(storageKey, String(game.best));
    bestEl.textContent = String(game.best);
    messageEl.classList.remove("hidden");
    messageEl.innerHTML = "<strong>Route blocked</strong><span>Press Restart, Space, or tap Jump to try again.</span>";
  }

  function drawBus(x, y, ducking) {
    const h = ducking ? 42 : 58;
    const top = y + (58 - h);
    ctx.fillStyle = "#2563eb";
    roundRect(x, top + 6, 86, h - 12, 8);
    ctx.fillStyle = "#eff6ff";
    for (let i = 0; i < 3; i += 1) {
      roundRect(x + 12 + i * 20, top + 13, 13, 12, 3);
    }
    ctx.fillStyle = "#dbeafe";
    roundRect(x + 10, top + 31, 50, 8, 3);
    ctx.fillStyle = "#111827";
    circle(x + 18, top + h - 5, 8);
    circle(x + 68, top + h - 5, 8);
    ctx.fillStyle = "#ffffff";
    circle(x + 18, top + h - 5, 3);
    circle(x + 68, top + h - 5, 3);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 13px system-ui";
    ctx.fillText("3", x + 70, top + 27);
  }

  function drawCone(obstacle) {
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
    ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
    ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fff7ed";
    ctx.fillRect(obstacle.x + 9, obstacle.y + 24, obstacle.width - 18, 6);
  }

  function drawSign(obstacle) {
    ctx.fillStyle = "#64748b";
    ctx.fillRect(obstacle.x + 18, obstacle.y + 42, 6, obstacle.height + 26);
    ctx.fillStyle = "#1e293b";
    roundRect(obstacle.x, obstacle.y, obstacle.width, 42, 6);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 12px system-ui";
    ctx.fillText("KIU", obstacle.x + 8, obstacle.y + 26);
  }

  function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
  }

  function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary") || "#2563eb";
    ctx.globalAlpha = 0.12;
    game.clouds.forEach((cloud) => {
      cloud.x -= game.running ? game.speed * 0.16 : 0;
      if (cloud.x < -80) cloud.x = canvas.width + 80;
      circle(cloud.x, cloud.y, 22 * cloud.size);
      circle(cloud.x + 22 * cloud.size, cloud.y + 4, 16 * cloud.size);
      circle(cloud.x - 24 * cloud.size, cloud.y + 6, 14 * cloud.size);
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(0, groundY, canvas.width, 4);
    ctx.fillStyle = "#cbd5e1";
    for (let x = -((game.score * 7) % 80); x < canvas.width; x += 80) {
      ctx.fillRect(x, groundY + 28, 42, 5);
    }
  }

  function update() {
    if (game.running && !game.over) {
      player.height = player.ducking ? 42 : 58;
      player.vy += 0.72;
      player.y += player.vy;
      if (player.y + player.height > groundY) {
        player.y = groundY - player.height;
        player.vy = 0;
      }

      game.speed += 0.0028;
      game.score += 0.18;
      game.nextObstacleIn -= 1;
      if (game.nextObstacleIn <= 0) spawnObstacle();

      game.obstacles.forEach((obstacle) => {
        obstacle.x -= game.speed;
      });
      game.obstacles = game.obstacles.filter((obstacle) => obstacle.x > -80);

      const bounds = playerBounds();
      for (const obstacle of game.obstacles) {
        if (collides(bounds, obstacle)) {
          endGame();
          break;
        }
      }

      scoreEl.textContent = String(Math.floor(game.score));
    }

    drawBackground();
    game.obstacles.forEach((obstacle) => {
      if (obstacle.type === "sign") drawSign(obstacle);
      else drawCone(obstacle);
    });
    drawBus(player.x, player.y, player.ducking);
    requestAnimationFrame(update);
  }

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "ArrowUp") {
      event.preventDefault();
      jump();
    }
    if (event.code === "ArrowDown") {
      event.preventDefault();
      setDuck(true);
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowDown") setDuck(false);
  });

  canvas.addEventListener("pointerdown", jump);
  jumpButton.addEventListener("click", jump);
  restartButton.addEventListener("click", reset);
  duckButton.addEventListener("pointerdown", () => setDuck(true));
  duckButton.addEventListener("pointerup", () => setDuck(false));
  duckButton.addEventListener("pointerleave", () => setDuck(false));

  reset();
  update();
})();
