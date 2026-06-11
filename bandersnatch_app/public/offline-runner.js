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
  const playRunnerButton = document.getElementById("play-runner");
  const gameScreen = document.getElementById("game-screen");
  const gameSuggestion = document.getElementById("game-suggestion");
  const estimatesScreen = document.getElementById("estimates-screen");
  const screenTitle = document.getElementById("screen-title");
  const estimateGrid = document.getElementById("estimate-grid");
  const estimateUpdated = document.getElementById("estimate-updated");

  const storageKey = "bandersnatch_offline_runner_best";
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
    duckProgress: 0,
    wheelSpin: 0,
    squash: 0,
    wasGrounded: true,
  };

  const palettes = {
    day: { skyTop: "#bfe2ff", skyMid: "#e9f4ff", skyBottom: "#fff4dc", cloud: "#ffffff", hillFar: "#cbdcbd", hillNear: "#98bb86", grass: "#96c476", building: "#e8eef9", building2: "#f5eddd", roof: "#d97706", station: "#1e3a8a", roadTop: "#647181", roadBottom: "#313948" },
    sunset: { skyTop: "#5c7cb9", skyMid: "#b891ab", skyBottom: "#f2aa85", cloud: "#ffdac7", hillFar: "#8a9a83", hillNear: "#688560", grass: "#658c53", building: "#bac3d4", building2: "#c4beaf", roof: "#a65800", station: "#122863", roadTop: "#4a5462", roadBottom: "#242a35" },
    night: { skyTop: "#12233d", skyMid: "#1e3a5f", skyBottom: "#263552", cloud: "#dbeafe", hillFar: "#263f36", hillNear: "#31533f", grass: "#42693e", building: "#334155", building2: "#3d4656", roof: "#f59e0b", station: "#1d4ed8", roadTop: "#475569", roadBottom: "#1f2937" },
    sunrise: { skyTop: "#678bba", skyMid: "#b7a9c7", skyBottom: "#ffd3b5", cloud: "#ffe9dd", hillFar: "#9ba992", hillNear: "#7d9e72", grass: "#7da564", building: "#cdd6e6", building2: "#dbd2be", roof: "#bd6c04", station: "#173278", roadTop: "#535e6e", roadBottom: "#282f3c" }
  };
  let currentColors = { ...palettes.day };

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16)
    };
  }

  function interpolateColor(c1, c2, factor) {
    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);
    const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
    const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
    const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
    return `rgb(${r}, ${g}, ${b})`;
  }

  const game = {
    running: false,
    over: false,
    score: 0,
    best: Number(localStorage.getItem(storageKey) || 0),
    speed: 5.2,
    nextObstacleIn: 80,
    obstacles: [],
    particles: [],
    scorePulse: 0,
    lastMilestone: 0,
    flash: 0,
    shake: 0,
    nightStrength: 0,
    stars: Array.from({ length: 45 }, () => ({
      x: Math.random() * base.width,
      y: Math.random() * (base.groundY - 120),
      size: 0.6 + Math.random() * 1.5,
      blinkPhase: Math.random() * Math.PI * 2,
      blinkSpeed: 0.02 + Math.random() * 0.05
    })),
    clouds: [
      { x: 160, y: 68, size: 1, speed: 0.14 },
      { x: 520, y: 94, size: 0.78, speed: 0.11 },
      { x: 760, y: 52, size: 0.9, speed: 0.18 },
      { x: 360, y: 42, size: 0.58, speed: 0.09 },
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
    if (estimatesScreen && !estimatesScreen.hidden) return;
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
      obstacle.y = obstacleY(obstacle.type);
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
    player.duckProgress = 0;
    player.wheelSpin = 0;
    player.squash = 0;
    player.wasGrounded = true;
    stopDrivingSound();
    stopDuckSound();
    scoreEl.textContent = "0";
    scoreEl.parentElement?.classList.remove("score-pop");
    messageEl.classList.remove("hidden", "danger");
    messageEl.innerHTML = "<strong>Tap Jump to start</strong><span>Jump cones. Hold Duck for touchdown planes.</span>";
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
      addDust(player.x + 18, world.groundY - 3, 6, -1);
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

  function obstacleY(type) {
    if (type === "plane") return world.groundY - 72;
    if (type === "sign") return world.groundY - 118;
    return world.groundY - 44;
  }

  function spawnObstacle() {
    const tuning = mobileTuning();
    const roll = Math.random();
    const planeChance = world.mobile ? 0.24 : 0.28;
    const type =
      game.score > 35 && roll < planeChance
        ? "plane"
        : roll > (world.mobile ? 0.68 : 0.62)
          ? "sign"
          : "cone";
    const dimensions =
      type === "plane"
        ? { width: 96, height: 38 }
        : type === "sign"
          ? { width: 42, height: 54 }
          : { width: 34, height: 44 };

    const stopAbbr = type === "sign" 
      ? estimateStops[Math.floor(Math.random() * estimateStops.length)].name.substring(0, 3).toUpperCase()
      : "";

    game.obstacles.push({
      x: world.width + 40,
      y: obstacleY(type),
      width: dimensions.width,
      height: dimensions.height,
      type,
      phase: Math.random() * Math.PI * 2,
      stopAbbr,
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
    game.flash = reducedMotionQuery.matches ? 0.35 : 0.75;
    game.shake = reducedMotionQuery.matches ? 0 : 14;
    stopDrivingSound();
    stopDuckSound();
    game.best = Math.max(game.best, Math.floor(game.score));
    localStorage.setItem(storageKey, String(game.best));
    bestEl.textContent = String(game.best);
    messageEl.classList.remove("hidden");
    messageEl.classList.add("danger");
    messageEl.innerHTML = "<strong>Route blocked</strong><span>Tap Jump or Restart to try again.</span>";
  }

  function cssVar(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function drawPath(points) {
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
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
        color: i % 3 === 0 ? "#f59e0b" : "#d6b980",
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
      ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1) * 0.75;
      ctx.fillStyle = particle.color;
      circle(particle.x, particle.y, particle.size);
      ctx.restore();
    });
  }

  function drawCloud(cloud) {
    ctx.save();
    ctx.globalAlpha = 0.76;
    ctx.fillStyle = currentColors.cloud;
    circle(cloud.x, cloud.y, 22 * cloud.size);
    circle(cloud.x + 22 * cloud.size, cloud.y + 4, 16 * cloud.size);
    circle(cloud.x - 24 * cloud.size, cloud.y + 6, 14 * cloud.size);
    roundRect(cloud.x - 30 * cloud.size, cloud.y + 7, 62 * cloud.size, 13 * cloud.size, 8);
    ctx.restore();
  }

  function drawBuilding(x, baseY, width, height, color, accent) {
    ctx.fillStyle = color;
    roundRect(x, baseY - height, width, height, 5);
    ctx.fillStyle = accent;
    for (let row = 0; row < Math.floor(height / 24); row += 1) {
      for (let col = 0; col < Math.floor(width / 24); col += 1) {
        roundRect(x + 9 + col * 23, baseY - height + 12 + row * 22, 8, 8, 2);
      }
    }
  }

  function drawCampusLayer(offset) {
    const horizon = world.groundY - 88;
    ctx.fillStyle = currentColors.hillFar;
    drawPath([
      [0, horizon + 34],
      [90, horizon + 10],
      [200, horizon + 22],
      [320, horizon - 2],
      [455, horizon + 24],
      [590, horizon + 6],
      [735, horizon + 28],
      [900, horizon + 2],
      [900, world.groundY],
      [0, world.groundY],
    ]);
    ctx.fill();

    ctx.fillStyle = currentColors.hillNear;
    drawPath([
      [0, horizon + 54],
      [120, horizon + 28],
      [260, horizon + 48],
      [380, horizon + 20],
      [520, horizon + 52],
      [670, horizon + 24],
      [805, horizon + 48],
      [900, horizon + 34],
      [900, world.groundY],
      [0, world.groundY],
    ]);
    ctx.fill();

    const buildingBase = world.groundY - 58;
    const baseOffset = offset * 0.32;
    const parallax = -(baseOffset % 520);
    for (let x = parallax - 120; x < world.width + 160; x += 520) {
      const indexOffset = Math.round((x - (parallax - 120)) / 520);
      const absoluteIndex = Math.floor(baseOffset / 520) + indexOffset;
      const stop = estimateStops[absoluteIndex % estimateStops.length];
      const displayName = stop.name.length > 16 ? stop.name.substring(0, 14) + ".." : stop.name;

      drawBuilding(x + 30, buildingBase, 82, 58, currentColors.building, "#bad0f8");
      drawBuilding(x + 135, buildingBase, 58, 42, currentColors.building2, "#d8caa4");
      ctx.fillStyle = currentColors.roof;
      drawPath([
        [x + 20, buildingBase - 58],
        [x + 72, buildingBase - 86],
        [x + 124, buildingBase - 58],
      ]);
      ctx.fill();
      ctx.fillStyle = currentColors.station;
      roundRect(x + 262, buildingBase - 48, 122, 48, 6);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "800 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(displayName, x + 323, buildingBase - 22);
      ctx.textAlign = "left";
      ctx.fillStyle = "#fbbf24";
      roundRect(x + 274, buildingBase - 40, 28, 9, 2);
      roundRect(x + 318, buildingBase - 40, 48, 9, 2);
    }
  }

  function drawRoad(offset) {
    const curbY = world.groundY - 3;
    const roadTop = world.groundY + 4;
    const roadGradient = ctx.createLinearGradient(0, roadTop, 0, world.height);
    roadGradient.addColorStop(0, currentColors.roadTop);
    roadGradient.addColorStop(1, currentColors.roadBottom);
    ctx.fillStyle = currentColors.grass;
    ctx.fillRect(0, world.groundY - 15, world.width, 18);
    ctx.fillStyle = "#d6b980";
    ctx.fillRect(0, curbY, world.width, 7);
    ctx.fillStyle = roadGradient;
    ctx.fillRect(0, roadTop, world.width, world.height - roadTop);
    ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
    for (let x = -((offset * 1.28) % 86); x < world.width; x += 86) {
      roundRect(x, world.groundY + 33, 46, 5, 3);
    }
    ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
    for (let x = -((offset * 0.78) % 118); x < world.width + 80; x += 118) {
      roundRect(x + 16, world.groundY + 63, 24, 3, 2);
    }
  }

  function drawRoadsideMarkers(offset) {
    for (let x = -((offset * 0.88) % 170); x < world.width + 120; x += 170) {
      ctx.fillStyle = "#f8fafc";
      roundRect(x + 4, world.groundY - 32, 9, 31, 3);
      ctx.fillStyle = "#ef4444";
      roundRect(x + 5, world.groundY - 23, 7, 7, 2);
    }
  }

  function drawSpeedLines(offset) {
    if (!game.running || game.speed < 6.2 || reducedMotionQuery.matches) return;
    ctx.save();
    ctx.globalAlpha = clamp((game.speed - 6.2) / 6, 0, 0.24);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    for (let y = world.groundY + 52; y < world.height; y += 34) {
      for (let x = -((offset * 2.2) % 180); x < world.width; x += 180) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 54, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawBus(x, y) {
    const duckEase = player.duckProgress;
    const visualHeight = player.fullHeight - duckEase * 15;
    const top = y + (player.fullHeight - visualHeight);
    const grounded = player.y + player.height >= world.groundY - 2;
    const bob = game.running && grounded && !reducedMotionQuery.matches ? Math.sin(frame * 0.32) * 1.8 : 0;
    const squashY = player.squash * 3;
    const bodyTop = top + 6 + bob + squashY;
    const bodyHeight = visualHeight - 12 - squashY * 0.4;

    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.24)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = "rgba(15, 23, 42, 0.22)";
    ctx.beginPath();
    ctx.ellipse(x + 43, world.groundY + 6, 46, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "transparent";

    const bodyGradient = ctx.createLinearGradient(x, bodyTop, x, bodyTop + bodyHeight);
    bodyGradient.addColorStop(0, "#3b82f6");
    bodyGradient.addColorStop(0.58, "#2563eb");
    bodyGradient.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = bodyGradient;
    roundRect(x, bodyTop, 86, bodyHeight, 10);
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    roundRect(x + 5, bodyTop + 5, 76, 6, 5);

    ctx.fillStyle = "#dbeafe";
    roundRect(x + 9, bodyTop + 12, 14, 13, 4);
    roundRect(x + 28, bodyTop + 12, 14, 13, 4);
    roundRect(x + 47, bodyTop + 12, 14, 13, 4);
    ctx.fillStyle = "#bfdbfe";
    drawPath([
      [x + 65, bodyTop + 12],
      [x + 79, bodyTop + 16],
      [x + 79, bodyTop + 26],
      [x + 65, bodyTop + 26],
    ]);
    ctx.fill();

    ctx.fillStyle = "#eff6ff";
    roundRect(x + 9, bodyTop + 31, 50, 8, 3);
    ctx.fillStyle = "#facc15";
    roundRect(x + 74, bodyTop + bodyHeight - 18, 8, 6, 3);
    ctx.fillStyle = "#0f172a";
    roundRect(x + 64, bodyTop + 29, 16, 16, 5);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 13px system-ui";
    ctx.fillText("3", x + 69, bodyTop + 42);

    drawWheel(x + 18, bodyTop + bodyHeight - 2, 9, player.wheelSpin);
    drawWheel(x + 68, bodyTop + bodyHeight - 2, 9, player.wheelSpin + 0.8);
    ctx.restore();
  }

  function drawWheel(x, y, radius, spin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(spin);
    ctx.fillStyle = "#0f172a";
    circle(0, 0, radius);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius - 2, 0);
      ctx.stroke();
    }
    ctx.fillStyle = "#ffffff";
    circle(0, 0, 3);
    ctx.restore();
  }

  function drawCone(obstacle) {
    const x = obstacle.x;
    const y = obstacle.y;
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.22)";
    ctx.beginPath();
    ctx.ellipse(x + obstacle.width / 2, y + obstacle.height + 4, 25, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    const coneGradient = ctx.createLinearGradient(x, y, x, y + obstacle.height);
    coneGradient.addColorStop(0, "#f59e0b");
    coneGradient.addColorStop(1, "#c2410c");
    ctx.fillStyle = coneGradient;
    ctx.beginPath();
    ctx.moveTo(x + obstacle.width / 2, y);
    ctx.lineTo(x + obstacle.width, y + obstacle.height);
    ctx.lineTo(x, y + obstacle.height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fff7ed";
    roundRect(x + 8, y + 23, obstacle.width - 16, 6, 3);
    ctx.fillStyle = "#7c2d12";
    roundRect(x - 4, y + obstacle.height - 3, obstacle.width + 8, 7, 3);
    ctx.restore();
  }

  function drawSign(obstacle) {
    const x = obstacle.x;
    const y = obstacle.y;
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
    ctx.beginPath();
    ctx.ellipse(x + 22, world.groundY + 4, 26, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#475569";
    roundRect(x + 18, y + 41, 6, 80, 3);
    ctx.fillStyle = "#1e3a8a";
    roundRect(x - 3, y - 2, obstacle.width + 6, 46, 7);
    ctx.fillStyle = "#60a5fa";
    roundRect(x + 3, y + 4, obstacle.width - 6, 9, 4);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 12px system-ui";
    ctx.fillText(obstacle.stopAbbr || "KIU", x + 8, y + 29);
    ctx.fillStyle = "#fbbf24";
    roundRect(x + 10, y + 34, obstacle.width - 20, 4, 2);
    ctx.restore();
  }

  function drawPlane(obstacle) {
    const x = obstacle.x;
    const y = obstacle.y + (reducedMotionQuery.matches ? 0 : Math.sin(frame * 0.16 + obstacle.phase) * 2);
    const prop = frame * 0.45 + obstacle.phase;
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
    ctx.beginPath();
    ctx.ellipse(x + 54, y + 46, 44, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    const bodyGradient = ctx.createLinearGradient(x, y, x + obstacle.width, y + obstacle.height);
    bodyGradient.addColorStop(0, "#e2e8f0");
    bodyGradient.addColorStop(0.48, "#64748b");
    bodyGradient.addColorStop(1, "#1f2937");
    ctx.fillStyle = bodyGradient;
    roundRect(x + 16, y + 12, 66, 17, 9);
    drawPath([
      [x + 80, y + 12],
      [x + 96, y + 20],
      [x + 80, y + 28],
    ]);
    ctx.fill();
    ctx.fillStyle = "#475569";
    drawPath([
      [x + 34, y + 16],
      [x + 58, y],
      [x + 72, y + 16],
    ]);
    ctx.fill();
    drawPath([
      [x + 38, y + 24],
      [x + 66, y + 38],
      [x + 73, y + 24],
    ]);
    ctx.fill();
    ctx.fillStyle = "#bfdbfe";
    roundRect(x + 24, y + 15, 12, 6, 3);
    roundRect(x + 40, y + 15, 12, 6, 3);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x + 13, y + 20, 4, 13, prop, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x + 13, y + 20, 13, 4, prop, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#111827";
    circle(x + 30, y + 32, 3);
    circle(x + 76, y + 32, 3);
    ctx.restore();
  }

  function drawScorePulse() {
    if (game.scorePulse <= 0) return;
    ctx.save();
    ctx.globalAlpha = game.scorePulse * 0.2;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(14, 14, world.width - 28, world.height - 28, 12);
    ctx.stroke();
    ctx.globalAlpha = game.scorePulse;
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "900 18px system-ui";
    ctx.fillText(`+${game.lastMilestone}`, world.width - 84, 34);
    ctx.restore();
  }

  function drawFlash() {
    if (game.flash <= 0) return;
    ctx.save();
    ctx.globalAlpha = game.flash * 0.28;
    ctx.fillStyle = "#f97316";
    ctx.fillRect(0, 0, world.width, world.height);
    ctx.restore();
  }

  function drawStars(offset) {
    if (game.nightStrength <= 0) return;
    ctx.save();
    ctx.fillStyle = "#ffffff";
    game.stars.forEach((star) => {
      const starX = (star.x - offset * 0.05) % world.width;
      const x = starX < 0 ? starX + world.width : starX;
      const opacity = (Math.sin(frame * star.blinkSpeed + star.blinkPhase) * 0.5 + 0.5) * game.nightStrength;
      ctx.globalAlpha = opacity * 0.8;
      circle(x, star.y, star.size);
    });
    ctx.restore();
  }

  function drawBackground() {
    const distance = game.score * 7 + (game.running ? frame * game.speed * 0.18 : 0);
    const sky = ctx.createLinearGradient(0, 0, 0, world.groundY);
    sky.addColorStop(0, currentColors.skyTop);
    sky.addColorStop(0.58, currentColors.skyMid);
    sky.addColorStop(1, currentColors.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(-28, -28, world.width + 56, world.height + 56);

    drawStars(distance);

    game.clouds.forEach((cloud) => {
      if (game.running && !reducedMotionQuery.matches) {
        cloud.x -= game.speed * cloud.speed;
        if (cloud.x < -90) cloud.x = world.width + 90;
      }
      drawCloud(cloud);
    });

    drawCampusLayer(distance);
    drawRoad(distance);
    drawRoadsideMarkers(distance);
    drawSpeedLines(distance);
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

  function updateColors() {
    const cycleLength = 2000;
    const progress = (game.score % cycleLength) / cycleLength; // 0.0 to 1.0

    let p1, p2, factor;
    if (progress < 0.25) {
      p1 = palettes.day; p2 = palettes.day; factor = 0;
    } else if (progress < 0.35) {
      p1 = palettes.day; p2 = palettes.sunset; factor = (progress - 0.25) / 0.10;
    } else if (progress < 0.50) {
      p1 = palettes.sunset; p2 = palettes.night; factor = (progress - 0.35) / 0.15;
    } else if (progress < 0.75) {
      p1 = palettes.night; p2 = palettes.night; factor = 0;
    } else if (progress < 0.85) {
      p1 = palettes.night; p2 = palettes.sunrise; factor = (progress - 0.75) / 0.10;
    } else {
      p1 = palettes.sunrise; p2 = palettes.day; factor = (progress - 0.85) / 0.15;
    }

    game.nightStrength = progress >= 0.35 && progress <= 0.85 
      ? (progress < 0.50 ? (progress - 0.35) / 0.15 : (progress > 0.75 ? 1.0 - (progress - 0.75) / 0.10 : 1.0))
      : 0;

    for (const key in palettes.day) {
      currentColors[key] = interpolateColor(p1[key], p2[key], factor);
    }
  }

  function update() {
    frame += 1;
    updateColors();
    ctx.save();
    if (game.shake > 0) {
      const shake = reducedMotionQuery.matches ? 0 : game.shake;
      ctx.translate(Math.sin(frame * 1.9) * shake * 0.55, Math.cos(frame * 1.3) * shake * 0.25);
      game.shake *= 0.84;
      if (game.shake < 0.2) game.shake = 0;
    }

    if (game.running && !game.over) {
      const tuning = mobileTuning();
      const wasGrounded = player.y + player.height >= world.groundY - 2;
      player.height = player.ducking ? player.duckHeight : player.fullHeight;
      player.duckProgress += ((player.ducking ? 1 : 0) - player.duckProgress) * 0.18;
      player.vy += tuning.gravity;
      player.y += player.vy;
      if (player.y + player.height > world.groundY) {
        player.y = world.groundY - player.height;
        player.vy = 0;
      }

      const isGrounded = player.y + player.height >= world.groundY - 2;
      if (!wasGrounded && isGrounded) {
        player.squash = 1;
        addDust(player.x + 72, world.groundY - 3, 8, 1);
      }
      player.wasGrounded = isGrounded;
      player.squash *= 0.74;
      player.wheelSpin += isGrounded && !reducedMotionQuery.matches ? game.speed * 0.08 : 0.04;

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

      const visibleScore = Math.floor(game.score);
      const milestone = Math.floor(visibleScore / 50) * 50;
      if (milestone > 0 && milestone > game.lastMilestone) {
        pulseScoreDisplay(milestone);
      }
      scoreEl.textContent = String(visibleScore);
    } else {
      player.duckProgress += (0 - player.duckProgress) * 0.18;
      player.squash *= 0.74;
    }

    updateParticles();
    game.scorePulse *= 0.9;
    game.flash *= 0.86;

    drawBackground();
    game.obstacles.forEach((obstacle) => {
      if (obstacle.type === "plane") drawPlane(obstacle);
      else if (obstacle.type === "sign") drawSign(obstacle);
      else drawCone(obstacle);
    });
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
  bindPressHoldDuck(duckButton);

  window.addEventListener("resize", () => {
    resizeCanvas();
  });
  window.addEventListener("orientationchange", () => {
    window.setTimeout(resizeCanvas, 120);
  });

  resizeCanvas();
  gameSuggestion.hidden = false;
  estimatesScreen.hidden = false;
  gameScreen.hidden = true;
  reset();
  renderEstimates();
  update();
})();
