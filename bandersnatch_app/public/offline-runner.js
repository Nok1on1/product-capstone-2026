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
  const base = { width: 900, height: 360, groundY: 285 };
  const mobileQuery = window.matchMedia("(max-width: 520px)");

  const world = {
    width: base.width,
    height: base.height,
    scale: 1,
    dpr: 1,
    groundY: base.groundY,
    mobile: mobileQuery.matches,
  };

  const player = {
    x: 96,
    y: base.groundY - 58,
    width: 86,
    height: 58,
    fullHeight: 58,
    duckHeight: 42,
    vy: 0,
    ducking: false,
  };

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

  function mobileTuning() {
    return world.mobile
      ? {
          playerX: 70,
          speed: 4.35,
          jumpVelocity: -13.4,
          gravity: 0.68,
          minObstacle: 94,
          obstacleSpread: 108,
          spacingSpeedPenalty: 12,
        }
      : {
          playerX: 96,
          speed: 5.2,
          jumpVelocity: -14.5,
          gravity: 0.72,
          minObstacle: 72,
          obstacleSpread: 92,
          spacingSpeedPenalty: 24,
        };
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    world.dpr = dpr;
    world.scale = rect.width / base.width;
    world.width = base.width;
    world.height = Math.max(280, Math.round(rect.height / world.scale));
    world.groundY = Math.min(base.groundY, world.height - 74);
    world.mobile = mobileQuery.matches || rect.width <= 520;

    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr * world.scale, 0, 0, dpr * world.scale, 0, 0);

    const tuning = mobileTuning();
    player.x = tuning.playerX;
    if (player.y + player.height > world.groundY) {
      player.y = world.groundY - player.height;
      player.vy = 0;
    }

    game.obstacles.forEach((obstacle) => {
      obstacle.y = obstacle.type === "sign" ? world.groundY - 118 : world.groundY - 44;
    });
  }

  function reset() {
    const tuning = mobileTuning();
    game.running = false;
    game.over = false;
    game.score = 0;
    game.speed = tuning.speed;
    game.nextObstacleIn = tuning.minObstacle;
    game.obstacles = [];
    player.x = tuning.playerX;
    player.height = player.fullHeight;
    player.y = world.groundY - player.height;
    player.vy = 0;
    player.ducking = false;
    scoreEl.textContent = "0";
    messageEl.classList.remove("hidden");
    messageEl.innerHTML = "<strong>Tap Jump to start</strong><span>Hold Duck for signs. Tap the road to jump.</span>";
  }

  function start() {
    if (game.over) {
      reset();
    }
    game.running = true;
    messageEl.classList.add("hidden");
  }

  function jump(event) {
    event?.preventDefault?.();
    if (!game.running) start();
    if (game.over) return;
    const playerBottom = player.y + player.height;
    if (playerBottom >= world.groundY - 2) {
      player.vy = mobileTuning().jumpVelocity;
    }
  }

  function setDuck(value, event) {
    event?.preventDefault?.();
    if (!game.running || game.over) return;
    player.ducking = value;
  }

  function spawnObstacle() {
    const tuning = mobileTuning();
    const isSign = Math.random() > (world.mobile ? 0.68 : 0.62);
    game.obstacles.push({
      x: world.width + 40,
      y: isSign ? world.groundY - 118 : world.groundY - 44,
      width: isSign ? 42 : 34,
      height: isSign ? 54 : 44,
      type: isSign ? "sign" : "cone",
    });
    game.nextObstacleIn =
      tuning.minObstacle +
      Math.random() * tuning.obstacleSpread -
      Math.min(game.speed * 3, tuning.spacingSpeedPenalty);
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
    return {
      x: player.x + 8,
      y: player.y + 6,
      width: player.width - 16,
      height: player.height - 8,
    };
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
    messageEl.innerHTML = "<strong>Route blocked</strong><span>Tap Jump or Restart to try again.</span>";
  }

  function drawBus(x, y, ducking) {
    const h = ducking ? player.duckHeight : player.fullHeight;
    const top = y + (player.fullHeight - h);
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
    ctx.clearRect(0, 0, world.width, world.height);
    ctx.fillStyle =
      getComputedStyle(document.documentElement).getPropertyValue("--primary") || "#2563eb";
    ctx.globalAlpha = 0.12;
    game.clouds.forEach((cloud) => {
      cloud.x -= game.running ? game.speed * 0.16 : 0;
      if (cloud.x < -80) cloud.x = world.width + 80;
      circle(cloud.x, cloud.y, 22 * cloud.size);
      circle(cloud.x + 22 * cloud.size, cloud.y + 4, 16 * cloud.size);
      circle(cloud.x - 24 * cloud.size, cloud.y + 6, 14 * cloud.size);
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(0, world.groundY, world.width, 4);
    ctx.fillStyle = "#cbd5e1";
    for (let x = -((game.score * 7) % 80); x < world.width; x += 80) {
      ctx.fillRect(x, world.groundY + 28, 42, 5);
    }
  }

  function update() {
    if (game.running && !game.over) {
      const tuning = mobileTuning();
      player.height = player.ducking ? player.duckHeight : player.fullHeight;
      player.vy += tuning.gravity;
      player.y += player.vy;
      if (player.y + player.height > world.groundY) {
        player.y = world.groundY - player.height;
        player.vy = 0;
      }

      game.speed += world.mobile ? 0.0022 : 0.0028;
      game.score += world.mobile ? 0.16 : 0.18;
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
      jump(event);
    }
    if (event.code === "ArrowDown") {
      event.preventDefault();
      setDuck(true, event);
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowDown") setDuck(false, event);
  });

  function bindPressHoldDuck(element) {
    element.addEventListener("pointerdown", (event) => {
      element.setPointerCapture?.(event.pointerId);
      setDuck(true, event);
    });
    element.addEventListener("pointerup", (event) => setDuck(false, event));
    element.addEventListener("pointercancel", (event) => setDuck(false, event));
    element.addEventListener("pointerleave", (event) => setDuck(false, event));
  }

  canvas.addEventListener("pointerdown", jump);
  jumpButton.addEventListener("pointerdown", jump);
  restartButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    reset();
  });
  bindPressHoldDuck(duckButton);

  window.addEventListener("resize", () => {
    resizeCanvas();
  });
  window.addEventListener("orientationchange", () => {
    window.setTimeout(resizeCanvas, 120);
  });

  resizeCanvas();
  reset();
  update();
})();
