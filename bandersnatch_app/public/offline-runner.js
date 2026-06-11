(() => {
  const canvas = document.getElementById("runner");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const messageEl = document.getElementById("message");
  const jumpButton = document.getElementById("jump");
  const duckButton = document.getElementById("duck");
  const restartButton = document.getElementById("restart");
  const showEstimatesButton = document.getElementById("show-estimates");
  const returnToAppButton = document.getElementById("return-to-app");
  const playRunnerButton = document.getElementById("play-runner");
  const gameScreen = document.getElementById("game-screen");
  const gameSuggestion = document.getElementById("game-suggestion");
  const estimatesScreen = document.getElementById("estimates-screen");
  const screenTitle = document.getElementById("screen-title");
  const estimateGrid = document.getElementById("estimate-grid");
  const estimateUpdated = document.getElementById("estimate-updated");

  const storageKey = "bandersnatch_offline_runner_best";
  const urlParams = new URLSearchParams(window.location.search);
  const shouldOpenGame = urlParams.get("play") === "1";
  const returnTo = urlParams.get("returnTo");
  const jumpSounds = [
    "/sound_effects/jump1.mp3",
    "/sound_effects/jump2.mp3",
    "/sound_effects/jump3.mp3",
  ].map((src) => new Audio(src));
  const duckSound = new Audio("/sound_effects/ducking.mp3");
  const drivingSound = new Audio("/sound_effects/driving.mp3");
  const base = { width: 900, height: 360, groundY: 285 };
  const mobileQuery = window.matchMedia("(max-width: 520px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let audioReady = false;
  let frame = 0;

  const assetSources = {
    bagrati: "/game_assets/bagrati.png",
    bird: "/game_assets/bird.png",
    building: "/game_assets/building.png",
    busDuck: "/game_assets/bus-duck.png",
    busNormal: "/game_assets/bus-normal.png",
    cone: "/game_assets/cone.png",
    lamp: "/game_assets/lamp.png",
    plane: "/game_assets/plane.png",
    road: "/game_assets/road.png",
    station: "/game_assets/station.png",
    sky: "/game_assets/sky.png",
    cloud: "/game_assets/cloud.png",
    tree: "/game_assets/tree.png",
  };

  const spriteCrop = {
    bagrati: { x: 0.03, y: 0.09, width: 0.94, height: 0.76 },
    bird: { x: 0.18, y: 0.2, width: 0.64, height: 0.58 },
    building: { x: 0.2, y: 0.13, width: 0.6, height: 0.74 },
    busDuck: { x: 0.04, y: 0.43, width: 0.93, height: 0.37 },
    busNormal: { x: 0.04, y: 0.28, width: 0.93, height: 0.44 },
    cone: { x: 0.26, y: 0.14, width: 0.48, height: 0.72 },
    lamp: { x: 0.34, y: 0.08, width: 0.32, height: 0.84 },
    plane: { x: 0.16, y: 0.35, width: 0.68, height: 0.3 },
    road: { x: 0.02, y: 0.46, width: 0.96, height: 0.18 },
    station: { x: 0.15, y: 0.14, width: 0.7, height: 0.74 },
    sky: { x: 0, y: 0, width: 1, height: 1 },
    cloud: { x: 0.13, y: 0.26, width: 0.74, height: 0.38 },
    tree: { x: 0.18, y: 0.08, width: 0.64, height: 0.84 },
  };

  const sprites = Object.fromEntries(
    Object.entries(assetSources).map(([name, src]) => {
      const image = new Image();
      image.src = src;
      return [name, image];
    })
  );

  const schedule = {
    start: "07:30",
    end: "22:00",
    frequencyMin: 30,
    stopTravelMinutes: 7,
  };
  const estimateStops = [
    { name: "Colchis Fountain", direction: "To Station", stopOffset: 0 },
    { name: "Bazaar", direction: "To Station", stopOffset: 1 },
    { name: "Family Super Market", direction: "To Station", stopOffset: 2 },
    { name: "Music School", direction: "To Station", stopOffset: 3 },
    { name: "Balakhvani", direction: "To Station", stopOffset: 4 },
    { name: "Judo School", direction: "To Station", stopOffset: 5 },
    { name: "Former Beeline Office", direction: "To Station", stopOffset: 6 },
    { name: "Police Station", direction: "To Station", stopOffset: 7 },
    { name: "Tsereteli Uni (Former GPI)", direction: "To Station", stopOffset: 8 },
    { name: "KIU (K Building)", direction: "To Station", stopOffset: 9 },
    { name: "KIU Campus", direction: "To Station", stopOffset: 10 },
    { name: "Riongesi", direction: "To Station", stopOffset: 11 },
    { name: "KIU Campus (Back)", direction: "To Station", stopOffset: 12 },
    { name: "Rioni Railway Station", direction: "To Station", stopOffset: 13 },
    { name: "Railway Station", direction: "To City Centre", stopOffset: 0 },
    { name: "Campus Station (Mushroom)", direction: "To City Centre", stopOffset: 1 },
    { name: "KIU (K Building)", direction: "To City Centre", stopOffset: 2 },
    { name: "Tsereteli Uni (Former GPI)", direction: "To City Centre", stopOffset: 3 },
    { name: "Stop", direction: "To City Centre", stopOffset: 4 },
    { name: "Kvirikashvilta Sakhlmuzeumi", direction: "To City Centre", stopOffset: 5 },
    { name: "Gurmani", direction: "To City Centre", stopOffset: 6 },
    { name: "Kutaisi 12th public school", direction: "To City Centre", stopOffset: 7 },
    { name: "Galileo and Kutaisi Railway Station", direction: "To City Centre", stopOffset: 8 },
    { name: "Tsereteli Uni (OG Buildings)", direction: "To City Centre", stopOffset: 9 },
    { name: "Bublikebi", direction: "To City Centre", stopOffset: 10 },
    { name: "Colchis Fountain", direction: "To City Centre", stopOffset: 11 },
  ];

  drivingSound.loop = true;
  drivingSound.volume = 0.32;
  duckSound.loop = true;
  duckSound.volume = 0.5;
  jumpSounds.forEach((sound) => {
    sound.volume = 0.55;
    sound.preload = "auto";
  });

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
    y: base.groundY - 64,
    width: 112,
    height: 64,
    fullHeight: 64,
    duckHeight: 48,
    vy: 0,
    ducking: false,
    squash: 0,
    wasGrounded: true,
  };

  const game = {
    running: false,
    over: false,
    score: 0,
    best: Number(localStorage.getItem(storageKey) || 0),
    speed: 6.3,
    nextObstacleIn: 80,
    obstacles: [],
    roadSegments: [],
    landmarks: [],
    clouds: [],
    nextBagratiScore: 1000,
    particles: [],
    scorePulse: 0,
    lastMilestone: 0,
    flash: 0,
    shake: 0,
  };

  bestEl.textContent = String(game.best);

  function unlockAudio() {
    if (audioReady) return;
    audioReady = true;
    [...jumpSounds, duckSound, drivingSound].forEach((sound) => {
      sound.load();
    });
  }

  function playSound(sound) {
    if (!audioReady) return;
    try {
      sound.currentTime = 0;
      void sound.play();
    } catch {
      // Audio is best-effort because browsers may still block playback.
    }
  }

  function startDrivingSound() {
    if (!audioReady || game.over) return;
    try {
      void drivingSound.play();
    } catch {
      // Audio is best-effort because browsers may still block playback.
    }
  }

  function stopDrivingSound() {
    drivingSound.pause();
    drivingSound.currentTime = 0;
  }

  function startDuckSound() {
    if (!audioReady || game.over) return;
    try {
      duckSound.currentTime = 0;
      void duckSound.play();
    } catch {
      // Audio is best-effort because browsers may still block playback.
    }
  }

  function stopDuckSound() {
    duckSound.pause();
    duckSound.currentTime = 0;
  }

  function playRandomJumpSound() {
    const sound = jumpSounds[Math.floor(Math.random() * jumpSounds.length)];
    playSound(sound);
  }

  function mobileTuning() {
    return world.mobile
      ? {
          playerX: 64,
          speed: 5.25,
          jumpVelocity: -12.1,
          gravity: 0.68,
          minObstacle: 96,
          obstacleSpread: 112,
          spacingSpeedPenalty: 12,
        }
      : {
          playerX: 96,
          speed: 6.3,
          jumpVelocity: -13.1,
          gravity: 0.72,
          minObstacle: 76,
          obstacleSpread: 98,
          spacingSpeedPenalty: 24,
        };
  }

  function roadTileWidth() {
    return world.mobile ? 260 : 330;
  }

  function roadHeight() {
    return world.mobile ? 118 : 132;
  }

  function roadY() {
    return world.groundY - 24;
  }

  function coneBaseY() {
    return world.groundY + 20;
  }

  function createRoadSegment(x, index) {
    return { x, index, type: "road" };
  }

  function createInitialRoadSegments() {
    const width = roadTileWidth();
    const segments = [];
    for (let x = -width; x < world.width + width; x += width) {
      segments.push(createRoadSegment(x, segments.length));
    }
    return segments;
  }

  function extendRoadSegments() {
    const width = roadTileWidth();
    game.roadSegments = game.roadSegments.filter((segment) => segment.x > -width * 1.4);
    let last = game.roadSegments[game.roadSegments.length - 1];
    if (!last) {
      game.roadSegments = createInitialRoadSegments();
      return;
    }
    while (last.x < world.width + width) {
      const next = createRoadSegment(last.x + width, last.index + 1);
      game.roadSegments.push(next);
      last = next;
    }
  }

  function createClouds() {
    return Array.from({ length: world.mobile ? 5 : 7 }, (_, index) => ({
      x: Math.random() * world.width,
      y: 18 + Math.random() * Math.max(44, world.groundY - 180),
      width: (world.mobile ? 78 : 96) + Math.random() * (world.mobile ? 48 : 72),
      speed: 0.08 + Math.random() * 0.1,
      phase: index * 1.7 + Math.random() * Math.PI,
    }));
  }

  function resizeCanvas() {
    if (estimatesScreen && !estimatesScreen.hidden) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    world.dpr = dpr;
    world.scale = rect.width / base.width;
    world.width = base.width;
    world.height = Math.max(280, Math.round(rect.height / world.scale));
    world.groundY = Math.min(base.groundY, world.height - 72);
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
      obstacle.y = obstacleY(obstacle);
    });
    if (!game.running) {
      game.roadSegments = createInitialRoadSegments();
    }
  }

  function reset() {
    const tuning = mobileTuning();
    game.running = false;
    game.over = false;
    game.score = 0;
    game.speed = tuning.speed;
    game.nextObstacleIn = tuning.minObstacle;
    game.obstacles = [];
    game.roadSegments = createInitialRoadSegments();
    game.landmarks = [];
    game.clouds = createClouds();
    game.nextBagratiScore = 1000;
    game.particles = [];
    game.scorePulse = 0;
    game.lastMilestone = 0;
    game.flash = 0;
    game.shake = 0;
    player.x = tuning.playerX;
    player.height = player.fullHeight;
    player.y = world.groundY - player.height;
    player.vy = 0;
    player.ducking = false;
    player.squash = 0;
    player.wasGrounded = true;
    stopDrivingSound();
    stopDuckSound();
    scoreEl.textContent = "0";
    scoreEl.parentElement?.classList.remove("score-pop");
    messageEl.classList.remove("hidden", "danger");
    messageEl.innerHTML = "<strong>Tap Jump to start</strong><span>Jump road hazards. Hold Duck for birds and planes.</span>";
  }

  function minutesUntilNextDeparture(now) {
    const [startH, startM] = schedule.start.split(":").map(Number);
    const [endH, endM] = schedule.end.split(":").map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    const currentMin = now.getHours() * 60 + now.getMinutes();

    if (currentMin >= endMin) {
      const tomorrowDeparture = new Date(now);
      tomorrowDeparture.setDate(tomorrowDeparture.getDate() + 1);
      tomorrowDeparture.setHours(startH, startM, 0, 0);
      return Math.round((tomorrowDeparture.getTime() - now.getTime()) / 60000);
    }

    let nextDepartureMin = startMin;
    while (nextDepartureMin <= currentMin) {
      nextDepartureMin += schedule.frequencyMin;
    }

    if (nextDepartureMin > endMin) {
      const tomorrowDeparture = new Date(now);
      tomorrowDeparture.setDate(tomorrowDeparture.getDate() + 1);
      tomorrowDeparture.setHours(startH, startM, 0, 0);
      return Math.round((tomorrowDeparture.getTime() - now.getTime()) / 60000);
    }

    return nextDepartureMin - currentMin;
  }

  function renderEstimates() {
    const now = new Date();
    const baseEta = minutesUntilNextDeparture(now);
    estimateGrid.innerHTML = estimateStops
      .map((stop) => {
        const eta = baseEta + stop.stopOffset * schedule.stopTravelMinutes;
        return `<article class="estimate-card">
          <div>
            <strong>${stop.name}</strong>
            <span>${stop.direction}</span>
          </div>
          <div class="estimate-minutes">${eta} min</div>
        </article>`;
      })
      .join("");
    estimateUpdated.textContent = `Updated ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  function showEstimates(event) {
    event?.preventDefault?.();
    game.running = false;
    player.ducking = false;
    stopDrivingSound();
    stopDuckSound();
    renderEstimates();
    gameScreen.hidden = true;
    estimatesScreen.hidden = false;
    gameSuggestion.hidden = false;
    screenTitle.textContent = "Offline Estimates";
  }

  function showGame(event) {
    event?.preventDefault?.();
    gameSuggestion.hidden = true;
    estimatesScreen.hidden = true;
    gameScreen.hidden = false;
    screenTitle.textContent = "Bus Runner";
    resizeCanvas();
  }

  function start() {
    if (game.over) {
      reset();
    }
    game.running = true;
    messageEl.classList.add("hidden");
    messageEl.classList.remove("danger");
    startDrivingSound();
  }

  function jump(event) {
    unlockAudio();
    event?.preventDefault?.();
    if (!game.running) start();
    if (game.over) return;
    const playerBottom = player.y + player.height;
    if (playerBottom >= world.groundY - 2) {
      player.vy = mobileTuning().jumpVelocity;
      player.squash = 1;
      addDust(player.x + 20, world.groundY - 3, 6, -1);
      playRandomJumpSound();
    }
  }

  function setDuck(value, event) {
    unlockAudio();
    event?.preventDefault?.();
    if (!game.running || game.over) return;
    if (value && !player.ducking) {
      startDuckSound();
    }
    if (!value && player.ducking) {
      stopDuckSound();
    }
    player.ducking = value;
  }

  function obstacleY(obstacle) {
    if (obstacle.kind === "flyer") return obstacle.laneY;
    return coneBaseY() - obstacle.height;
  }

  function chooseObstacleType() {
    const roll = Math.random();
    if (game.score >= 1000 && roll < 0.28) return "plane";
    if (roll < 0.42) return "bird";
    return "cone";
  }

  function createObstacle(type) {
    if (type === "plane") {
      const lanes = [
        world.groundY - 128,
        world.groundY - 106,
        world.groundY - 88,
      ];
      return {
        type,
        kind: "flyer",
        width: world.mobile ? 94 : 118,
        height: world.mobile ? 42 : 52,
        laneY: lanes[Math.floor(Math.random() * lanes.length)],
      };
    }

    if (type === "bird") {
      const lanes = world.mobile
        ? [world.groundY - 102, world.groundY - 98]
        : [world.groundY - 112, world.groundY - 106];
      return {
        type,
        kind: "flyer",
        width: world.mobile ? 64 : 78,
        height: world.mobile ? 58 : 71,
        laneY: lanes[Math.floor(Math.random() * lanes.length)],
      };
    }

    return {
      type,
      kind: "ground",
      width: world.mobile ? 38 : 48,
      height: world.mobile ? 46 : 58,
    };
  }

  function spawnObstacle() {
    const tuning = mobileTuning();
    const obstacle = createObstacle(chooseObstacleType());
    obstacle.x = world.width + 44;
    obstacle.y = obstacleY(obstacle);
    obstacle.phase = Math.random() * Math.PI * 2;
    game.obstacles.push(obstacle);
    game.nextObstacleIn =
      tuning.minObstacle +
      Math.random() * tuning.obstacleSpread -
      Math.min(game.speed * 3, tuning.spacingSpeedPenalty);
  }

  function playerBounds() {
    if (player.ducking) {
      return {
        x: player.x + 12,
        y: player.y + 22,
        width: player.width - 22,
        height: player.height - 20,
      };
    }
    return {
      x: player.x + 12,
      y: player.y + 8,
      width: player.width - 22,
      height: player.height - 10,
    };
  }

  function collides(a, b) {
    const inset = b.kind === "flyer" ? 8 : 6;
    return (
      a.x < b.x + b.width - inset &&
      a.x + a.width > b.x + inset &&
      a.y < b.y + b.height - inset &&
      a.y + a.height > b.y + inset
    );
  }

  function endGame() {
    game.running = false;
    game.over = true;
    game.flash = reducedMotionQuery.matches ? 0.35 : 0.75;
    game.shake = reducedMotionQuery.matches ? 0 : 10;
    stopDrivingSound();
    stopDuckSound();
    game.best = Math.max(game.best, Math.floor(game.score));
    localStorage.setItem(storageKey, String(game.best));
    bestEl.textContent = String(game.best);
    messageEl.classList.remove("hidden");
    messageEl.classList.add("danger");
    messageEl.innerHTML = "<strong>Route blocked</strong><span>Tap Jump or Restart to try again.</span>";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSprite(name, x, y, width, height, options = {}) {
    const image = sprites[name];
    if (!image || !image.complete || image.naturalWidth === 0) {
      ctx.fillStyle = options.fallback || "#2563eb";
      ctx.fillRect(x, y, width, height);
      return;
    }

    const crop = spriteCrop[name] || { x: 0, y: 0, width: 1, height: 1 };
    const sx = crop.x * image.naturalWidth;
    const sy = crop.y * image.naturalHeight;
    const sw = crop.width * image.naturalWidth;
    const sh = crop.height * image.naturalHeight;

    ctx.save();
    if (options.alpha !== undefined) ctx.globalAlpha = options.alpha;
    if (options.flipX) {
      ctx.translate(x + width, y);
      ctx.scale(-1, 1);
      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
    } else {
      ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
    }
    ctx.restore();
  }

  function addDust(x, y, count, direction = 1) {
    if (reducedMotionQuery.matches) return;
    for (let i = 0; i < count; i += 1) {
      game.particles.push({
        x,
        y,
        vx: direction * (Math.random() * -2.1 - 0.45),
        vy: -Math.random() * 1.9 - 0.35,
        life: 22 + Math.random() * 10,
        maxLife: 32,
        size: 2 + Math.random() * 3.5,
      });
    }
  }

  function updateParticles() {
    game.particles.forEach((particle) => {
      particle.x += particle.vx - (game.running ? game.speed * 0.28 : 0);
      particle.y += particle.vy;
      particle.vy += 0.08;
      particle.life -= 1;
    });
    game.particles = game.particles.filter((particle) => particle.life > 0);
  }

  function drawParticles() {
    game.particles.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1) * 0.72;
      ctx.fillStyle = "#c7a577";
      circle(particle.x, particle.y, particle.size);
      ctx.restore();
    });
  }

  function drawRoad(offset) {
    ctx.fillStyle = "#393A42";
    ctx.fillRect(0, world.groundY - 42, world.width, world.height - world.groundY + 42);
    extendRoadSegments();
    for (const segment of game.roadSegments) {
      drawSprite("road", segment.x, roadY(), roadTileWidth() + 2, roadHeight(), { fallback: "#3f4650" });
    }
  }

  function drawBackdropSprite(name, x, groundOffset, width, height, speedFactor, offset) {
    const wrapped = x - ((offset * speedFactor) % (world.width + 260));
    const drawX = wrapped < -180 ? wrapped + world.width + 260 : wrapped;
    drawSprite(name, drawX, world.groundY - groundOffset - height, width, height);
  }

  function drawLandmarks() {
    for (const landmark of game.landmarks) {
      const width = world.mobile ? 178 : 230;
      const height = world.mobile ? 146 : 188;
      drawSprite("bagrati", landmark.x, world.groundY - 64 - height, width, height, {
        fallback: "#d7c095",
      });
    }
  }

  function drawSky() {
    ctx.fillStyle = "#dff1ff";
    ctx.fillRect(-28, -28, world.width + 56, world.height + 56);
    drawSprite("sky", -8, -8, world.width + 16, world.groundY - 72, {
      fallback: "#dff1ff",
    });
  }

  function drawClouds() {
    for (const cloud of game.clouds) {
      const cloudHeight = cloud.width * 0.42;
      const bob = reducedMotionQuery.matches ? 0 : Math.sin(frame * 0.018 + cloud.phase) * 2;
      drawSprite("cloud", cloud.x, cloud.y + bob, cloud.width, cloudHeight, {
        fallback: "#ffffff",
      });
    }
  }

  function drawBackground() {
    const distance = game.score * 7 + (game.running ? frame * game.speed * 0.18 : 0);
    drawSky();
    drawClouds();
    ctx.fillStyle = "#393A42";
    ctx.fillRect(0, world.groundY - 118, world.width, 86);

    drawLandmarks();
    drawBackdropSprite("building", 70, 56, 96, 116, 0.18, distance);
    drawBackdropSprite("building", 820, 56, 106, 126, 0.18, distance);
    drawBackdropSprite("station", 290, 48, 116, 92, 0.24, distance);
    drawBackdropSprite("tree", 470, 42, 74, 96, 0.28, distance);
    drawBackdropSprite("lamp", 660, 38, 46, 104, 0.34, distance);

    drawRoad(distance);
  }

  function drawBus(x, y) {
    const grounded = player.y + player.height >= world.groundY - 2;
    const bob = game.running && grounded && !reducedMotionQuery.matches ? Math.sin(frame * 0.32) * 1.4 : 0;
    const squashY = player.squash * 3;
    const duckVisualOffset = player.ducking ? 16 : 0;

    ctx.save();
    ctx.fillStyle = "rgba(19, 27, 46, 0.18)";
    ctx.beginPath();
    ctx.ellipse(x + player.width * 0.5, world.groundY + 5, player.width * 0.45, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    drawSprite(
      player.ducking ? "busDuck" : "busNormal",
      x,
      y + bob + squashY + duckVisualOffset,
      player.width,
      player.fullHeight,
      { fallback: "#2563eb" }
    );
    ctx.restore();
  }

  function drawObstacle(obstacle) {
    const float = obstacle.kind === "flyer" && !reducedMotionQuery.matches
      ? Math.sin(frame * 0.16 + obstacle.phase) * 2
      : 0;

    ctx.save();
    ctx.fillStyle = "rgba(19, 27, 46, 0.15)";
    ctx.beginPath();
    const shadowY = obstacle.kind === "flyer" ? world.groundY + 2 : obstacle.y + obstacle.height + 4;
    ctx.ellipse(obstacle.x + obstacle.width / 2, shadowY, obstacle.width * 0.36, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    drawSprite(obstacle.type, obstacle.x, obstacle.y + float, obstacle.width, obstacle.height, {
      fallback: obstacle.kind === "flyer" ? "#475569" : "#d97706",
    });
    ctx.restore();
  }

  function drawScorePulse() {
    if (game.scorePulse <= 0) return;
    ctx.save();
    ctx.globalAlpha = game.scorePulse;
    ctx.fillStyle = "#1d4ed8";
    ctx.font = "900 18px system-ui";
    ctx.fillText(`+${game.lastMilestone}`, world.width - 84, 34);
    ctx.restore();
  }

  function drawFlash() {
    if (game.flash <= 0) return;
    ctx.save();
    ctx.globalAlpha = game.flash * 0.18;
    ctx.fillStyle = "#f97316";
    ctx.fillRect(0, 0, world.width, world.height);
    ctx.restore();
  }

  function pulseScoreDisplay(milestone) {
    const scoreChip = scoreEl.parentElement;
    if (!scoreChip) return;
    scoreChip.classList.remove("score-pop");
    void scoreChip.offsetWidth;
    scoreChip.classList.add("score-pop");
    game.lastMilestone = milestone;
    game.scorePulse = reducedMotionQuery.matches ? 0 : 1;
  }

  function update() {
    frame += 1;
    ctx.save();
    if (game.shake > 0) {
      const shake = reducedMotionQuery.matches ? 0 : game.shake;
      ctx.translate(Math.sin(frame * 1.9) * shake * 0.45, Math.cos(frame * 1.3) * shake * 0.2);
      game.shake *= 0.84;
      if (game.shake < 0.2) game.shake = 0;
    }

    if (game.running && !game.over) {
      const tuning = mobileTuning();
      const wasGrounded = player.y + player.height >= world.groundY - 2;
      player.height = player.fullHeight;
      player.vy += tuning.gravity;
      player.y += player.vy;
      if (player.y + player.height > world.groundY) {
        player.y = world.groundY - player.height;
        player.vy = 0;
      }

      const isGrounded = player.y + player.height >= world.groundY - 2;
      if (!wasGrounded && isGrounded) {
        player.squash = 1;
        addDust(player.x + player.width - 10, world.groundY - 3, 8, 1);
      }
      player.wasGrounded = isGrounded;
      player.squash *= 0.74;

      game.speed += world.mobile ? 0.0034 : 0.0042;
      game.score += world.mobile ? 0.16 : 0.18;
      game.nextObstacleIn -= 1;
      if (game.nextObstacleIn <= 0) spawnObstacle();

      game.obstacles.forEach((obstacle) => {
        obstacle.x -= game.speed;
      });
      game.obstacles = game.obstacles.filter((obstacle) => obstacle.x > -140);
      game.roadSegments.forEach((segment) => {
        segment.x -= game.speed;
      });
      extendRoadSegments();
      if (game.score >= game.nextBagratiScore) {
        game.landmarks.push({ x: world.width + 70 });
        game.nextBagratiScore += 1000;
      }
      game.landmarks.forEach((landmark) => {
        landmark.x -= game.speed * 0.34;
      });
      game.landmarks = game.landmarks.filter((landmark) => landmark.x > -220);
      game.clouds.forEach((cloud) => {
        cloud.x -= game.speed * cloud.speed;
        if (cloud.x + cloud.width < -30) {
          cloud.x = world.width + 30 + Math.random() * 140;
          cloud.y = 18 + Math.random() * Math.max(44, world.groundY - 180);
        }
      });

      const bounds = playerBounds();
      for (const obstacle of game.obstacles) {
        if (collides(bounds, obstacle)) {
          endGame();
          break;
        }
      }
      const visibleScore = Math.floor(game.score);
      const milestone = Math.floor(visibleScore / 50) * 50;
      if (milestone > 0 && milestone > game.lastMilestone) {
        pulseScoreDisplay(milestone);
      }
      scoreEl.textContent = String(visibleScore);
    } else {
      player.squash *= 0.74;
    }

    updateParticles();
    game.scorePulse *= 0.9;
    game.flash *= 0.86;

    drawBackground();
    game.obstacles.forEach(drawObstacle);
    drawParticles();
    drawBus(player.x, player.y);
    drawScorePulse();
    drawFlash();
    ctx.restore();
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
    unlockAudio();
    event.preventDefault();
    reset();
  });
  showEstimatesButton.addEventListener("pointerdown", showEstimates);
  playRunnerButton.addEventListener("pointerdown", showGame);
  returnToAppButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    window.location.href = returnTo?.startsWith("/") ? returnTo : "/";
  });
  bindPressHoldDuck(duckButton);

  window.addEventListener("resize", () => {
    resizeCanvas();
  });
  window.addEventListener("orientationchange", () => {
    window.setTimeout(resizeCanvas, 120);
  });

  resizeCanvas();
  returnToAppButton.hidden = !returnTo;
  gameSuggestion.hidden = shouldOpenGame;
  estimatesScreen.hidden = shouldOpenGame;
  gameScreen.hidden = !shouldOpenGame;
  screenTitle.textContent = shouldOpenGame ? "Bus Runner" : "Offline Estimates";
  if (shouldOpenGame) {
    resizeCanvas();
  }
  reset();
  renderEstimates();
  update();
})();
