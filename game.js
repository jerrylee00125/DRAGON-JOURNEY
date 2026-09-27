(() => {
    "use strict";
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const stage = document.getElementById("stage");
    const overlay = document.getElementById("overlay");
    const mainButton = document.getElementById("mainButton");
    const pauseButton = document.getElementById("pauseButton");
    const soundButton = document.getElementById("soundButton");
    const milestoneSound = document.getElementById("milestoneSound");
    const hitSound = document.getElementById("hitSound");
    const scoreEl = document.getElementById("score");
    const bestEl = document.getElementById("best");
    const speedEl = document.getElementById("speed");
    const sceneEl = document.getElementById("sceneName");
    const skillStatusEl = document.getElementById("skillStatus");
    const skillButton = document.getElementById("skillButton");
    const toastEl = document.getElementById("achievementToast");
    const skinGrid = document.getElementById("skinGrid");
    const achievementGrid = document.getElementById("achievementGrid");
    const collectionNote = document.getElementById("collectionNote");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const colors = ["#ff776e", "#ffbf70", "#ffe587", "#8ee5a5", "#71dce5", "#9fb6fb"];
    const skins = [
      { id: "prism", name: "虹光龍", ability: "虹彩衝刺", hint: "跑速提高 10%，持續 2.5 秒", cooldown: 18, duration: 2.5, bodyA: "#b2f4ce", bodyB: "#55c9bd", tail: "#47b9b6", snout: "#69d4c5", legs: "#357f99", spikes: colors },
      { id: "cloud", name: "雲翼龍", ability: "雲端二段跳", hint: "空中再跳一次，躍過危險", cooldown: 18, duration: 0, bodyA: "#c8e7ff", bodyB: "#83b8f5", tail: "#7aa8db", snout: "#a8d4fb", legs: "#5878c4", spikes: ["#f9faff", "#d3e4ff", "#a6c7f9", "#edf3ff", "#b2c6f3"] },
      { id: "shield", name: "星盾龍", ability: "星光護盾", hint: "3 秒內抵擋一次碰撞", cooldown: 24, duration: 3, bodyA: "#e1b7f8", bodyB: "#a588df", tail: "#9475c3", snout: "#c4a4eb", legs: "#745caa", spikes: ["#fff0b4", "#ffd3e3", "#ded0ff", "#a9b8ff", "#ffe1a4"] },
      { id: "aurora", name: "極光龍", ability: "極光緩速", hint: "場景放慢至 75%，持續 2.5 秒", cooldown: 24, duration: 2.5, bodyA: "#9cf3e0", bodyB: "#6b97df", tail: "#6c9ac4", snout: "#9dccdc", legs: "#536daf", spikes: ["#9df2d8", "#79e0d8", "#a9b9fc", "#d9a7f0", "#b7f9d4"] }
    ];
    const achievementDefs = [
      { id: "first100", name: "虹光起跑", description: "單局達 100 分", goal: 100, reward: "解鎖雲翼龍", icon: "🌈" },
      { id: "ground10", name: "跨欄新星", description: "單局跳過 10 個地面障礙", goal: 10, reward: "成就徽章", icon: "🌵" },
      { id: "birds5", name: "低空舞步", description: "單局蹲下閃過 5 個飛行障礙", goal: 5, reward: "解鎖星盾龍", icon: "🪽" },
      { id: "score500", name: "遠行者", description: "單局達 500 分", goal: 500, reward: "成就徽章", icon: "✨" },
      { id: "passed25", name: "障礙達人", description: "單局通過 25 個障礙", goal: 25, reward: "成就徽章", icon: "🏁" },
      { id: "skill3", name: "技能節奏", description: "單局發動技能 3 次，並達 300 分", goal: 100, reward: "成就徽章", icon: "✦" },
      { id: "allSix", name: "七彩收藏家", description: "完成前六個成就", goal: 6, reward: "解鎖極光龍", icon: "🏆" }
    ];
    const clouds = [
      { x: .12, y: .19, s: .8, rate: .07 }, { x: .45, y: .28, s: 1.08, rate: .045 },
      { x: .77, y: .14, s: .66, rate: .065 }, { x: 1.08, y: .32, s: .92, rate: .05 }
    ];
    const scenes = [
      { name: "暮光原野", sky: ["#232750", "#3b3c75", "#656392"], glow: "255, 189, 163", far: "#393b70", near: "#30345f", ground: ["#262b4f", "#171b39"], line: "#9ff0d7", track: "rgba(198, 215, 250, .18)" },
      { name: "晨曦花園", sky: ["#42657d", "#a184a5", "#f5bcaa"], glow: "255, 221, 149", far: "#708f9a", near: "#4d797d", ground: ["#365c67", "#234955"], line: "#f8dea4", track: "rgba(255, 238, 192, .28)" },
      { name: "晶彩峽谷", sky: ["#192e56", "#405c91", "#817fbd"], glow: "131, 229, 255", far: "#40568f", near: "#314978", ground: ["#263f68", "#182b50"], line: "#91e6ff", track: "rgba(164, 227, 255, .26)" },
      { name: "極光雪境", sky: ["#132a43", "#26536d", "#547995"], glow: "129, 250, 215", far: "#456b86", near: "#325a76", ground: ["#345a76", "#203e5e"], line: "#cef8fa", track: "rgba(221, 252, 255, .27)" }
    ];
    const sceneFadeDuration = .8;
    const keys = new Set();
    const world = { width: 0, height: 0, ground: 0, baseSpeed: 0 };
    const player = { x: 0, jump: 0, velocity: 0, duck: false };
    let state = "ready";
    let elapsed = 0;
    let distance = 0;
    let progress = 0;
    let speed = 0;
    let score = 0;
    let spawnTimer = 1.6;
    let obstacles = [];
    let lastTime = 0;
    let audioContext = null;
    let naturalSpeed = 0;
    let sceneIndex = 0;
    let pendingSceneIndex = null;
    let previousSceneIndex = null;
    let sceneFadeRemaining = 0;
    let skillCooldown = 0;
    let skillActive = 0;
    let shieldCharges = 0;
    let doubleJumpUsed = false;
    let runStats = { groundJumped: 0, birdsDucked: 0, passed: 0, skillUses: 0 };
    let toastQueue = [];
    let toastTimer = null;

    function readStore(key, fallback) {
      try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
    }
    function writeStore(key, value) {
      try { localStorage.setItem(key, String(value)); } catch { /* 私密模式仍可遊玩 */ }
    }
    const storedBest = Number(readStore("rainbowDino.best.v1", "0"));
    let best = Number.isFinite(storedBest) ? Math.max(0, Math.floor(storedBest)) : 0;
    let muted = readStore("rainbowDino.muted.v1", "0") === "1";
    function loadProgress() {
      try {
        const saved = JSON.parse(readStore("rainbowDino.progress.v2", "{}"));
        return {
          completed: saved?.completed && typeof saved.completed === "object" && !Array.isArray(saved.completed) ? saved.completed : {},
          bestRun: saved?.bestRun && typeof saved.bestRun === "object" && !Array.isArray(saved.bestRun) ? saved.bestRun : {},
          selectedSkin: typeof saved?.selectedSkin === "string" ? saved.selectedSkin : "prism",
          bestSkin: typeof saved?.bestSkin === "string" ? saved.bestSkin : null
        };
      } catch { return { completed: {}, bestRun: {}, selectedSkin: "prism", bestSkin: null }; }
    }
    const progressData = loadProgress();
    if (best >= 100) progressData.completed.first100 = true;
    if (best >= 500) progressData.completed.score500 = true;
    if (achievementDefs.slice(0, 6).every(item => progressData.completed[item.id])) progressData.completed.allSix = true;
    function skinUnlocked(id) {
      return id === "prism" || (id === "cloud" && !!progressData.completed.first100) ||
        (id === "shield" && !!progressData.completed.birds5) ||
        (id === "aurora" && !!progressData.completed.allSix);
    }
    let selectedSkinId = skinUnlocked(progressData.selectedSkin) ? progressData.selectedSkin : "prism";
    let activeSkinId = selectedSkinId;
    function currentSkin() { return skins.find(item => item.id === activeSkinId) || skins[0]; }
    function saveProgress() {
      progressData.selectedSkin = selectedSkinId;
      writeStore("rainbowDino.progress.v2", JSON.stringify(progressData));
    }
    function currentAchievementValue(id) {
      switch (id) {
        case "first100": case "score500": return score;
        case "ground10": return runStats.groundJumped;
        case "birds5": return runStats.birdsDucked;
        case "passed25": return runStats.passed;
        case "skill3": return Math.floor(Math.min(runStats.skillUses / 3, score / 300, 1) * 100);
        case "allSix": return achievementDefs.slice(0, 6).filter(item => progressData.completed[item.id]).length;
        default: return 0;
      }
    }
    function showNextToast() {
      if (toastTimer || !toastQueue.length) return;
      toastEl.textContent = toastQueue.shift();
      toastEl.hidden = false;
      toastTimer = setTimeout(() => {
        toastEl.hidden = true;
        toastTimer = null;
        showNextToast();
      }, 2600);
    }
    function unlockAchievement(id) {
      if (progressData.completed[id]) return;
      progressData.completed[id] = true;
      saveProgress();
      const achievement = achievementDefs.find(item => item.id === id);
      const skinName = id === "first100" ? "雲翼龍" : id === "birds5" ? "星盾龍" : id === "allSix" ? "極光龍" : null;
      toastQueue.push(`成就達成：${achievement.name}${skinName ? ` · 解鎖${skinName}` : ""}`);
      showNextToast();
      renderCollection();
    }
    function checkAchievements() {
      for (const item of achievementDefs.slice(0, 6)) {
        if (currentAchievementValue(item.id) >= item.goal) unlockAchievement(item.id);
      }
      if (currentAchievementValue("allSix") === 6) unlockAchievement("allSix");
    }
    function saveRunProgress() {
      for (const item of achievementDefs.slice(0, 6)) {
        const value = Math.min(item.goal, currentAchievementValue(item.id));
        progressData.bestRun[item.id] = Math.max(Number(progressData.bestRun[item.id]) || 0, value);
      }
      saveProgress();
    }
    function skinPortrait(skin) {
      return `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 43 5 36c2 7 6 10 13 11l-2 7h9l3-8h14l-2 8h9l2-13c4-3 6-8 4-14l-8-1-4-8H30l-4 8c-6 2-10 8-10 17Z" fill="${skin.bodyB}"/><path d="m19 32-4-7 8 3Z" fill="${skin.spikes[0]}"/><path d="m27 26-1-8 8 5Z" fill="${skin.spikes[1]}"/><path d="m37 22 4-8 5 10Z" fill="${skin.spikes[2]}"/><circle cx="46" cy="31" r="2.5" fill="#1d3150"/><path d="M40 40h15" stroke="${skin.snout}" stroke-width="3" stroke-linecap="round"/></svg>`;
    }
    function renderSkins() {
      skinGrid.innerHTML = skins.map(skin => {
        const unlocked = skinUnlocked(skin.id);
        const selected = skin.id === selectedSkinId;
        const label = unlocked ? (selected ? "已選擇" : "選用造型") :
          skin.id === "cloud" ? "達成虹光起跑解鎖" : skin.id === "shield" ? "達成低空舞步解鎖" : "完成前六個成就解鎖";
        return `<article class="skin-card ${selected ? "selected" : ""} ${unlocked ? "" : "locked"}">
          <div class="skin-portrait">${skinPortrait(skin)}</div><h4>${skin.name}</h4>
          <p><strong>${skin.ability}</strong><br>${skin.hint}</p>
          <button type="button" data-skin="${skin.id}" aria-pressed="${selected}" ${unlocked ? "" : "disabled"}>${label}</button>
        </article>`;
      }).join("");
    }
    function renderAchievements() {
      achievementGrid.innerHTML = achievementDefs.map(item => {
        const done = !!progressData.completed[item.id];
        const value = Math.min(item.goal, Math.max(currentAchievementValue(item.id), Number(progressData.bestRun[item.id]) || 0));
        const progressLabel = item.id === "skill3" ? `${value}%` : `${value}／${item.goal}`;
        return `<article class="achievement-card ${done ? "done" : ""}">
          <div class="achievement-symbol" aria-hidden="true">${item.icon}</div><div>
          <h4>${item.name}</h4><p>${item.description}</p>
          <small>${done ? `已達成 · ${item.reward}` : `${progressLabel} · ${item.reward}`}</small>
          <div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width:${done ? 100 : value / item.goal * 100}%"></div></div>
          </div></article>`;
      }).join("");
    }
    function renderCollection() {
      renderSkins(); renderAchievements();
      const bestSkin = skins.find(item => item.id === progressData.bestSkin);
      const recordText = bestSkin ? `目前最高分由${bestSkin.name}創下。` : best > 0 ? "已有舊版最高分紀錄。" : "尚無最高分紀錄。";
      collectionNote.textContent = `已選擇${skins.find(item => item.id === selectedSkinId).name}，從下一局開始使用；所有造型共用最高分。${recordText}`;
    }

    function formatted(value) { return String(value).padStart(4, "0"); }
    function updateHud() {
      scoreEl.textContent = formatted(score);
      bestEl.textContent = formatted(best);
      const speedRatio = speed / Math.max(world.baseSpeed, 1);
      speedEl.textContent = `×${speedRatio > 2.5 ? speedRatio.toFixed(2) : speedRatio.toFixed(1)}`;
      sceneEl.textContent = scenes[sceneIndex].name;
      const skin = currentSkin();
      const active = skillActive > 0;
      const ready = skillCooldown <= 0;
      const canUse = ready && (skin.id !== "cloud" || ((player.jump > 0 || player.velocity > 0) && !doubleJumpUsed));
      skillStatusEl.className = `skill-badge ${active ? "active" : ready ? "ready" : ""}`;
      skillStatusEl.textContent = active ? `${skin.ability} · ${skillActive.toFixed(1)} 秒` :
        ready ? (skin.id === "cloud" && !canUse ? `${skin.ability} · 空中發動` : `${skin.ability} · 已就緒`) :
          `${skin.ability} · ${skillCooldown.toFixed(1)} 秒`;
      skillButton.classList.toggle("skill-ready", canUse && state === "running");
      skillButton.disabled = state !== "running" || !canUse;
      skillButton.setAttribute("aria-label", `${skin.ability}，${skillStatusEl.textContent}`);
    }
    function updateSoundButton() {
      soundButton.textContent = muted ? "♪ 音效關閉" : "♫ 音效開啟";
      soundButton.setAttribute("aria-pressed", String(!muted));
    }
    function playAudio(element) {
      if (muted) return;
      try {
        element.pause(); element.currentTime = 0;
        const result = element.play();
        if (result?.catch) result.catch(() => {});
      } catch { /* 瀏覽器拒絕播放時保持遊戲可用 */ }
    }
    function playJump() {
      if (muted) return;
      try {
        const AudioEngine = window.AudioContext || window.webkitAudioContext;
        if (!AudioEngine) return;
        audioContext ??= new AudioEngine();
        if (audioContext.state === "suspended") void audioContext.resume().catch(() => {});
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(370, now);
        oscillator.frequency.exponentialRampToValueAtTime(650, now + .13);
        gain.gain.setValueAtTime(.065, now);
        gain.gain.exponentialRampToValueAtTime(.001, now + .16);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(now); oscillator.stop(now + .17);
      } catch { /* 音效為選用功能 */ }
    }

    function setOverlay(mode) {
      overlay.hidden = mode === "running";
      if (mode === "running") return;
      const content = {
        ready: ["🌈", "準備好出發了嗎？", "跳過地面障礙、蹲下閃開低空障礙，穿越四個場景。", "開始遊戲 →"],
        paused: ["⏸", "先喘口氣", "準備好了就繼續奔跑。", "繼續遊戲 →"],
        over: ["✨", "這次跑得真不錯！", "再來一次，挑戰更遠的距離。", "再玩一次 →"]
      }[mode];
      document.getElementById("modalIcon").textContent = content[0];
      document.getElementById("modalTitle").textContent = content[1];
      document.getElementById("modalDescription").textContent = content[2];
      mainButton.textContent = content[3];
      document.getElementById("finalScore").hidden = mode !== "over";
      if (mode === "over") {
        document.getElementById("runScore").textContent = formatted(score);
        document.getElementById("runBest").textContent = formatted(best);
      }
    }
    function resize() {
      const oldWidth = world.width;
      const rect = stage.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      world.width = rect.width;
      world.height = rect.height;
      world.ground = Math.round(rect.height * .78);
      world.baseSpeed = Math.max(135, Math.min(420, rect.width * .42));
      player.x = Math.min(157, Math.max(70, rect.width * .17));
      if (oldWidth && oldWidth !== world.width) obstacles.forEach(item => { item.x *= world.width / oldWidth; });
      canvas.width = Math.round(rect.width * pixelRatio);
      canvas.height = Math.round(rect.height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      if (state !== "running") speed = world.baseSpeed * (1 + Math.min(1.5, elapsed * .015));
      updateHud();
    }
    function resetRun() {
      elapsed = 0; distance = 0; progress = 0; score = 0; spawnTimer = 1.65;
      obstacles = []; keys.clear();
      sceneIndex = 0; pendingSceneIndex = null; previousSceneIndex = null; sceneFadeRemaining = 0;
      player.jump = 0; player.velocity = 0; player.duck = false;
      runStats = { groundJumped: 0, birdsDucked: 0, passed: 0, skillUses: 0 };
      skillCooldown = 0; skillActive = 0; shieldCharges = 0; doubleJumpUsed = false;
      activeSkinId = selectedSkinId;
      naturalSpeed = world.baseSpeed; speed = world.baseSpeed;
      updateHud();
    }
    function startGame() {
      resetRun(); state = "running"; pauseButton.disabled = false;
      pauseButton.textContent = "暫停"; setOverlay("running");
      updateHud(); renderCollection(); canvas.focus({ preventScroll: true });
    }
    function pauseGame() {
      if (state !== "running") return;
      state = "paused"; player.duck = false; keys.clear();
      pauseButton.textContent = "繼續"; setOverlay("paused"); updateHud();
    }
    function resumeGame() {
      if (state !== "paused") return;
      state = "running"; lastTime = 0;
      pauseButton.textContent = "暫停"; setOverlay("running"); updateHud(); canvas.focus({ preventScroll: true });
    }
    function endGame() {
      if (state !== "running") return;
      state = "over"; player.duck = false; keys.clear(); pauseButton.disabled = true;
      checkAchievements(); saveRunProgress();
      if (score > best) {
        best = score; progressData.bestSkin = activeSkinId;
        writeStore("rainbowDino.best.v1", best); saveProgress();
      }
      updateHud(); renderCollection(); playAudio(hitSound); setOverlay("over");
    }
    function jump() {
      if (state !== "running" || player.jump > 0 || player.velocity !== 0) return;
      player.duck = false;
      player.velocity = 680;
      doubleJumpUsed = false;
      playJump();
    }
    function activateSkill() {
      if (state !== "running" || skillCooldown > 0) return false;
      const skin = currentSkin();
      if (skin.id === "cloud") {
        if ((player.jump <= 0 && player.velocity <= 0) || doubleJumpUsed) return false;
        player.velocity = 520;
        doubleJumpUsed = true;
        playJump();
      } else {
        skillActive = skin.duration;
        if (skin.id === "shield") shieldCharges = 1;
      }
      skillCooldown = skin.cooldown;
      runStats.skillUses++;
      checkAchievements(); renderAchievements(); updateHud();
      return true;
    }
    function updateDuck() { player.duck = state === "running" && player.jump === 0 && keys.size > 0; }
    function spawnObstacle() {
      let kind = "single";
      const roll = Math.random();
      if (score >= 150 && roll < .33) kind = "bird";
      else if (score >= 300 && roll < .55) kind = "double";
      const dimensions = kind === "bird" ? [51, 34] : kind === "double" ? [54, 57] : [31, 56];
      obstacles.push({ kind, scene: sceneIndex, x: world.width + speed * .35, width: dimensions[0], height: dimensions[1], passed: false, avoidedBy: null, neutralized: false });
    }
    function playerBox() {
      const bottom = world.ground - player.jump;
      return player.duck
        ? { x: player.x + 5, y: bottom - 29, width: 54, height: 25 }
        : { x: player.x + 10, y: bottom - 61, width: 43, height: 56 };
    }
    function obstacleBox(item) {
      return item.kind === "bird"
        ? { x: item.x + 5, y: world.ground - 67, width: 41, height: 32 }
        : { x: item.x + 4, y: world.ground - item.height + 4, width: item.width - 8, height: item.height - 6 };
    }
    function overlaps(a, b) {
      return a.x < b.x + b.width && a.x + a.width > b.x &&
             a.y < b.y + b.height && a.y + a.height > b.y;
    }
    function update(dt) {
      elapsed += dt;
      skillCooldown = Math.max(0, skillCooldown - dt);
      skillActive = Math.max(0, skillActive - dt);
      if (skillActive === 0) shieldCharges = 0;
      naturalSpeed = world.baseSpeed * (1 + Math.min(1.5, elapsed * .015));
      const skillMultiplier = skillActive > 0 && activeSkinId === "prism" ? 1.1 :
        skillActive > 0 && activeSkinId === "aurora" ? .75 : 1;
      speed = naturalSpeed * skillMultiplier;
      distance += speed * dt;
      progress += speed / world.baseSpeed * dt * 10;
      const previousScore = score;
      score = Math.floor(progress);
      if (Math.floor(score / 100) > Math.floor(previousScore / 100)) playAudio(milestoneSound);
      const targetSceneIndex = Math.floor(score / 500) % scenes.length;
      if (targetSceneIndex !== sceneIndex) pendingSceneIndex = targetSceneIndex;
      if (sceneFadeRemaining > 0) {
        sceneFadeRemaining = Math.max(0, sceneFadeRemaining - dt);
        if (sceneFadeRemaining === 0) previousSceneIndex = null;
      }
      if (player.velocity !== 0 || player.jump > 0) {
        player.jump += player.velocity * dt;
        player.velocity -= 1950 * dt;
        if (player.jump <= 0) { player.jump = 0; player.velocity = 0; doubleJumpUsed = false; }
      }
      updateDuck();
      if (pendingSceneIndex === null && sceneFadeRemaining === 0) {
        spawnTimer -= dt * skillMultiplier;
        if (spawnTimer <= 0) {
          spawnObstacle();
          spawnTimer = Math.max(1.2, 1.72 - elapsed * .005) + Math.random() * .35;
        }
      }
      for (const item of obstacles) item.x -= speed * dt;
      const hitbox = playerBox();
      for (const item of obstacles) {
        if (item.neutralized) continue;
        const horizontalContact = item.x < player.x + 53 && item.x + item.width > player.x + 10;
        if (horizontalContact && !item.avoidedBy) {
          if (item.kind !== "bird" && player.jump >= 47) item.avoidedBy = "jump";
          if (item.kind === "bird" && player.duck) item.avoidedBy = "duck";
        }
        if (overlaps(hitbox, obstacleBox(item))) {
          if (shieldCharges > 0 && skillActive > 0 && activeSkinId === "shield") {
            shieldCharges = 0; skillActive = 0; item.neutralized = true;
          } else {
            endGame();
            break;
          }
        }
        if (!item.neutralized && !item.passed && item.x + item.width < player.x + 8) {
          item.passed = true; runStats.passed++;
          if (item.kind === "bird" && item.avoidedBy === "duck") runStats.birdsDucked++;
          if (item.kind !== "bird" && item.avoidedBy === "jump") runStats.groundJumped++;
        }
      }
      obstacles = obstacles.filter(item => !item.neutralized && item.x + item.width > -12);
      if (pendingSceneIndex !== null && obstacles.length === 0) {
        previousSceneIndex = reducedMotion.matches ? null : sceneIndex;
        sceneIndex = pendingSceneIndex;
        pendingSceneIndex = null;
        sceneFadeRemaining = reducedMotion.matches ? 0 : sceneFadeDuration;
        spawnTimer = .6;
        updateHud();
      }
      if (state === "running") checkAchievements();
      if (Math.floor(elapsed) !== Math.floor(elapsed - dt)) renderAchievements();
      if (score !== previousScore || Math.floor(elapsed * 3) !== Math.floor((elapsed - dt) * 3)) updateHud();
    }

    function roundRect(x, y, width, height, radius, fill, stroke) {
      ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
    }
    function drawCloud(x, y, scale) {
      ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
      ctx.fillStyle = "rgba(221, 219, 255, .14)";
      ctx.beginPath(); ctx.ellipse(0, 0, 39, 13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(-17, -8, 17, 0, Math.PI * 2); ctx.arc(4, -16, 22, 0, Math.PI * 2);
      ctx.arc(24, -6, 16, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    function drawBackground(index) {
      const w = world.width, h = world.height, scene = scenes[index];
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, scene.sky[0]); sky.addColorStop(.57, scene.sky[1]); sky.addColorStop(1, scene.sky[2]);
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
      const glow = ctx.createRadialGradient(w * .78, h * .25, 9, w * .78, h * .25, w * .62);
      glow.addColorStop(0, `rgba(${scene.glow}, .28)`); glow.addColorStop(1, `rgba(${scene.glow}, 0)`);
      ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
      const ambient = reducedMotion.matches ? 0 : distance;
      if (index === 1) {
        ctx.fillStyle = "rgba(255, 239, 194, .78)";
        ctx.beginPath(); ctx.arc(w * .78, h * .22, 30, 0, Math.PI * 2); ctx.fill();
      } else if (index === 3) {
        ctx.save(); ctx.globalAlpha *= .29;
        for (let band = 0; band < 3; band++) {
          ctx.strokeStyle = ["#7affd0", "#b9a4ff", "#a7f4ff"][band]; ctx.lineWidth = 22 - band * 4;
          ctx.beginPath(); ctx.moveTo(-30, 102 + band * 24);
          ctx.bezierCurveTo(w * .25, 20 + band * 20, w * .6, 180 - band * 20, w + 30, 48 + band * 22); ctx.stroke();
        }
        ctx.restore();
      }
      if (index === 0 || index === 2 || index === 3) {
        ctx.save(); ctx.globalAlpha *= index === 0 ? .55 : .68;
        for (let i = 0; i < 23; i++) {
          const x = ((i * 127 + 37) % 997) / 997 * w;
          const y = 65 + ((i * 71) % 133) / 180 * h;
          ctx.fillStyle = index === 3 ? "#e5ffff" : i % 4 ? "#c9d5ff" : "#ffe4c3";
          ctx.beginPath(); ctx.arc(x, y, i % 6 ? 1 : 1.7, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
      if (index !== 2) clouds.forEach(cloud => {
        const span = w + 220;
        const x = ((cloud.x * w - ambient * cloud.rate + 120) % span + span) % span - 120;
        drawCloud(x, cloud.y * h, cloud.s);
      });
      ctx.fillStyle = scene.far;
      ctx.beginPath(); ctx.moveTo(0, world.ground);
      for (let x = 0; x <= w + 20; x += 20) {
        const y = world.ground - (index === 2 ? 80 : 48) - Math.sin(x / 86 + .7) * (index === 2 ? 32 : 15) - Math.sin(x / 191) * 14;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, world.ground); ctx.fill();
      if (index === 2) {
        ctx.fillStyle = "rgba(150, 211, 249, .24)";
        for (let i = 0; i < 9; i++) {
          const x = (i * 149 - ambient * .025) % (w + 160);
          const y = world.ground - 46;
          ctx.beginPath(); ctx.moveTo(x - 15, y); ctx.lineTo(x, y - 51 - i % 3 * 12); ctx.lineTo(x + 17, y); ctx.fill();
        }
      }
      ctx.fillStyle = scene.near;
      ctx.beginPath(); ctx.moveTo(0, world.ground);
      for (let x = 0; x <= w + 20; x += 20) {
        const y = world.ground - 25 - Math.sin(x / 72 + 2.4) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, world.ground); ctx.fill();
      if (index === 1) {
        for (let i = 0; i < 15; i++) {
          const x = ((i * 113 - ambient * .06) % (w + 80) + w + 80) % (w + 80);
          const y = world.ground - 12 - i % 3 * 5;
          ctx.fillStyle = i % 2 ? "#ffd2ca" : "#fbe5a3";
          ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    function drawGround(index) {
      const y = world.ground, w = world.width, h = world.height, scene = scenes[index];
      const ground = ctx.createLinearGradient(0, y, 0, h);
      ground.addColorStop(0, scene.ground[0]); ground.addColorStop(1, scene.ground[1]);
      ctx.fillStyle = ground; ctx.fillRect(0, y, w, h - y);
      ctx.fillStyle = scene.line; ctx.fillRect(0, y, w, 3);
      ctx.fillStyle = `rgba(${scene.glow}, .14)`; ctx.fillRect(0, y + 3, w, 9);
      const offset = distance % 66;
      ctx.fillStyle = scene.track;
      for (let x = -offset; x < w + 70; x += 66) roundRect(x, y + 28, 27, 3, 2, ctx.fillStyle);
      ctx.fillStyle = "rgba(236, 240, 255, .09)";
      for (let x = 24 - offset * .45; x < w + 80; x += 94) roundRect(x, y + 71, 34, 2, 2, ctx.fillStyle);
    }
    function drawScene(index) { drawBackground(index); drawGround(index); }
    function drawTrail() {
      if (state !== "running" || reducedMotion.matches) return;
      ctx.save();
      const palette = currentSkin().spikes;
      const boosted = activeSkinId === "prism" && skillActive > 0;
      for (let i = 0; i < 6; i++) {
        const x = player.x - 14 - i * 15 - (distance % 12);
        const y = world.ground - 12 - (i % 2) * 5;
        ctx.globalAlpha = (boosted ? .68 : .4) - i * .045;
        roundRect(x, y, (boosted ? 23 : 16) - i, boosted ? 4 : 3, 2, palette[i % palette.length]);
      }
      ctx.restore();
    }
    function drawCactus(item) {
      const x = item.x, y = world.ground, double = item.kind === "double";
      ctx.save();
      ctx.fillStyle = "rgba(4, 12, 23, .18)";
      ctx.beginPath(); ctx.ellipse(x + item.width / 2, y + 5, item.width * .58, 5, 0, 0, Math.PI * 2); ctx.fill();
      function stem(sx, height, scale) {
        const green = ctx.createLinearGradient(sx, 0, sx + 22 * scale, 0);
        green.addColorStop(0, "#61d6a7"); green.addColorStop(1, "#a0efaa");
        roundRect(sx + 5 * scale, y - height, 19 * scale, height, 9 * scale, green);
        roundRect(sx, y - height * .7, 9 * scale, height * .28, 5 * scale, green);
        roundRect(sx + 17 * scale, y - height * .54, 10 * scale, height * .23, 5 * scale, green);
        ctx.fillStyle = "rgba(255,255,255,.23)";
        roundRect(sx + 9 * scale, y - height + 10, 3 * scale, height - 19, 2, ctx.fillStyle);
      }
      if (double) { stem(x, 55, .9); stem(x + 26, 43, .83); }
      else stem(x + 1, 55, 1);
      ctx.restore();
    }
    function drawBird(item) {
      const x = item.x, y = world.ground - 53;
      const flap = reducedMotion.matches ? 0 : Math.sin(elapsed * 17 + x * .02) * 7;
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = "#aaa6f6";
      ctx.beginPath(); ctx.moveTo(14, -2); ctx.quadraticCurveTo(22, -23 - flap, 38, -14 - flap);
      ctx.quadraticCurveTo(29, -1, 21, 6); ctx.fill();
      ctx.fillStyle = "#e4b5d9";
      ctx.beginPath(); ctx.moveTo(17, 5); ctx.quadraticCurveTo(27, 17 + flap, 42, 10 + flap);
      ctx.quadraticCurveTo(29, 1, 21, -1); ctx.fill();
      ctx.fillStyle = "#ddd0f5";
      ctx.beginPath(); ctx.ellipse(21, 0, 19, 12, -.1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#7676be";
      ctx.beginPath(); ctx.moveTo(6, -2); ctx.lineTo(-1, 3); ctx.lineTo(7, 6); ctx.fill();
      ctx.fillStyle = "#202348"; ctx.beginPath(); ctx.arc(32, -4, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffd795";
      ctx.beginPath(); ctx.moveTo(38, 1); ctx.lineTo(49, 4); ctx.lineTo(38, 7); ctx.fill();
      ctx.restore();
    }
    function drawFlower(item) {
      const x = item.x, y = world.ground;
      ctx.save();
      const blossom = (left, scale) => {
        ctx.strokeStyle = "#78d3a7"; ctx.lineWidth = 7 * scale;
        ctx.beginPath(); ctx.moveTo(left + 14 * scale, y); ctx.quadraticCurveTo(left + 9 * scale, y - 26 * scale, left + 15 * scale, y - 42 * scale); ctx.stroke();
        ctx.fillStyle = "#f89eae";
        for (let i = 0; i < 5; i++) {
          const angle = i * Math.PI * 2 / 5;
          ctx.beginPath(); ctx.ellipse(left + 15 * scale + Math.cos(angle) * 9 * scale, y - 43 * scale + Math.sin(angle) * 9 * scale, 7 * scale, 11 * scale, angle, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = "#ffe5a1"; ctx.beginPath(); ctx.arc(left + 15 * scale, y - 43 * scale, 7 * scale, 0, Math.PI * 2); ctx.fill();
      };
      if (item.kind === "double") { blossom(x, .96); blossom(x + 25, .78); }
      else blossom(x, 1);
      ctx.restore();
    }
    function drawCrystal(item) {
      const x = item.x, y = world.ground;
      ctx.save();
      const shard = (left, width, height) => {
        ctx.fillStyle = "#9ee7f6";
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + width * .15, y - height * .62);
        ctx.lineTo(left + width * .5, y - height); ctx.lineTo(left + width * .86, y - height * .58);
        ctx.lineTo(left + width, y); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.42)";
        ctx.beginPath(); ctx.moveTo(left + width * .5, y - height); ctx.lineTo(left + width * .5, y);
        ctx.lineTo(left + width * .15, y - height * .62); ctx.fill();
      };
      if (item.kind === "double") { shard(x, 28, 57); shard(x + 24, 30, 45); }
      else shard(x, 31, 56);
      ctx.restore();
    }
    function drawIce(item) {
      const x = item.x, y = world.ground;
      ctx.save();
      const spire = (left, width, height) => {
        ctx.fillStyle = "#a3e2f1";
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + width * .5, y - height);
        ctx.lineTo(left + width, y); ctx.fill();
        ctx.fillStyle = "#e6fcff";
        ctx.beginPath(); ctx.moveTo(left + width * .5, y - height); ctx.lineTo(left + width * .5, y);
        ctx.lineTo(left + width * .2, y); ctx.fill();
      };
      if (item.kind === "double") { spire(x, 28, 57); spire(x + 25, 29, 45); }
      else spire(x, 31, 56);
      ctx.restore();
    }
    function drawAirHazard(item) {
      const scene = item.scene ?? 0;
      if (scene === 0) { drawBird(item); return; }
      const x = item.x, y = world.ground - 67;
      ctx.save(); ctx.translate(x, y);
      if (scene === 1) {
        const flutter = reducedMotion.matches ? 0 : Math.sin(elapsed * 17 + x * .02) * 3;
        ctx.fillStyle = "rgba(210, 249, 255, .78)";
        for (const [wx, wy] of [[18, 5 + flutter], [31, 5 - flutter], [18, 26 - flutter], [31, 26 + flutter]]) {
          ctx.beginPath(); ctx.ellipse(wx, wy, 13, 6, -.2, 0, Math.PI * 2); ctx.fill();
        }
        roundRect(10, 14, 34, 7, 4, "#7bddc7");
        ctx.fillStyle = "#ffe7a8"; ctx.beginPath(); ctx.arc(43, 17, 5, 0, Math.PI * 2); ctx.fill();
      } else if (scene === 2) {
        ctx.fillStyle = "rgba(121, 223, 251, .28)";
        ctx.beginPath(); ctx.ellipse(25, 17, 25, 16, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#9be9ff";
        ctx.beginPath(); ctx.moveTo(25, 1); ctx.lineTo(44, 16); ctx.lineTo(25, 33); ctx.lineTo(7, 16); ctx.fill();
        ctx.fillStyle = "#e4fbff";
        ctx.beginPath(); ctx.moveTo(25, 1); ctx.lineTo(25, 33); ctx.lineTo(7, 16); ctx.fill();
      } else {
        ctx.fillStyle = "#e8f9ff";
        ctx.beginPath(); ctx.ellipse(26, 19, 17, 13, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#b0d9ec";
        ctx.beginPath(); ctx.ellipse(12, 19, 12, 7, -.25, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(40, 19, 11, 7, .25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#315270";
        for (const ex of [21, 32]) { ctx.beginPath(); ctx.arc(ex, 15, 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = "#f6dba0";
        ctx.beginPath(); ctx.moveTo(25, 20); ctx.lineTo(29, 20); ctx.lineTo(27, 25); ctx.fill();
      }
      ctx.restore();
    }
    function drawObstacle(item) {
      if (item.kind === "bird") { drawAirHazard(item); return; }
      switch (item.scene ?? 0) {
        case 1: drawFlower(item); break;
        case 2: drawCrystal(item); break;
        case 3: drawIce(item); break;
        default: drawCactus(item);
      }
    }
    function drawIncomingWarning(item) {
      if (item.x <= world.width) return;
      const airborne = item.kind === "bird";
      const y = world.ground - (airborne ? 99 : 79);
      ctx.save();
      roundRect(world.width - 37, y, 31, 30, 10, "rgba(21, 28, 58, .85)", airborne ? "#c7d7ff" : "#ffe4a5");
      ctx.fillStyle = airborne ? "#e7edff" : "#fff0c5";
      ctx.font = "bold 19px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(airborne ? "↓" : "↑", world.width - 21, y + 15);
      ctx.restore();
    }
    function drawDino() {
      const x = player.x, bottom = world.ground - player.jump;
      const skin = currentSkin();
      ctx.save(); ctx.translate(x, bottom);
      if (activeSkinId === "shield" && shieldCharges > 0 && skillActive > 0) {
        ctx.strokeStyle = "rgba(255, 226, 153, .82)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(27, -35, 43, 45, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = "rgba(3, 9, 29, .2)";
      ctx.beginPath(); ctx.ellipse(27, player.jump + 5, 30 - Math.min(player.jump / 12, 10), 5, 0, 0, Math.PI * 2); ctx.fill();
      const body = ctx.createLinearGradient(0, -62, 52, 0);
      body.addColorStop(0, skin.bodyA); body.addColorStop(1, skin.bodyB);
      if (player.duck) {
        ctx.fillStyle = skin.tail;
        ctx.beginPath(); ctx.moveTo(9, -19); ctx.lineTo(-12, -24); ctx.lineTo(2, -12); ctx.fill();
        roundRect(2, -29, 55, 27, 13, body);
        roundRect(37, -32, 25, 22, 9, body);
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = skin.spikes[i]; ctx.beginPath();
          ctx.moveTo(8 + i * 10, -28); ctx.lineTo(13 + i * 10, -37); ctx.lineTo(19 + i * 10, -28); ctx.fill();
        }
        ctx.fillStyle = "#20294d"; ctx.beginPath(); ctx.arc(52, -24, 2.4, 0, Math.PI * 2); ctx.fill();
        roundRect(15, -5, 16, 6, 3, skin.legs); roundRect(39, -5, 15, 6, 3, skin.legs);
      } else {
        const step = player.jump > 0 || state !== "running" || reducedMotion.matches ? 0 : Math.sin(elapsed * 22) * 5;
        ctx.fillStyle = skin.tail;
        ctx.beginPath(); ctx.moveTo(12, -35); ctx.quadraticCurveTo(-8, -38, -16, -26);
        ctx.quadraticCurveTo(-3, -29, 6, -19); ctx.fill();
        roundRect(10, -15 + step, 11, 16 - Math.max(step, 0), 5, skin.legs);
        roundRect(31, -15 - step, 11, 16 + Math.min(step, 0), 5, skin.legs);
        roundRect(3, -46, 43, 37, 17, body);
        roundRect(32, -57, 17, 33, 8, body);
        roundRect(30, -66, 35, 28, 11, body);
        roundRect(43, -43, 23, 10, 5, skin.snout);
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = skin.spikes[i]; ctx.beginPath();
          ctx.moveTo(4 + i * 8, -43 - i * 2); ctx.lineTo(9 + i * 8, -54 - i * 2);
          ctx.lineTo(16 + i * 8, -44 - i * 2); ctx.fill();
        }
        ctx.fillStyle = activeSkinId === "shield" ? "#f5d9f5" : "#f3d39b";
        ctx.beginPath(); ctx.ellipse(29, -25, 14, 11, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1b3150"; ctx.beginPath(); ctx.arc(53, -55, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.beginPath(); ctx.arc(54, -56, .8, 0, Math.PI * 2); ctx.fill();
        if (activeSkinId === "cloud") {
          ctx.fillStyle = "rgba(255,255,255,.88)";
          for (const [cx, cy, r] of [[36, -69, 5], [43, -71, 7], [50, -68, 5]]) {
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
          }
        } else if (activeSkinId === "shield") {
          ctx.fillStyle = "#fff0ae";
          ctx.beginPath(); ctx.moveTo(25, -37); ctx.lineTo(28, -31); ctx.lineTo(34, -30);
          ctx.lineTo(29, -26); ctx.lineTo(30, -20); ctx.lineTo(25, -24);
          ctx.lineTo(20, -20); ctx.lineTo(21, -26); ctx.lineTo(16, -30);
          ctx.lineTo(22, -31); ctx.fill();
        } else if (activeSkinId === "aurora") {
          ctx.strokeStyle = "rgba(230,246,255,.76)"; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(16, -35); ctx.quadraticCurveTo(25, -42, 34, -35); ctx.stroke();
        }
      }
      ctx.restore();
    }
    function render() {
      ctx.clearRect(0, 0, world.width, world.height);
      if (previousSceneIndex !== null && sceneFadeRemaining > 0) {
        drawScene(previousSceneIndex);
        ctx.save(); ctx.globalAlpha = 1 - sceneFadeRemaining / sceneFadeDuration;
        drawScene(sceneIndex); ctx.restore();
      } else drawScene(sceneIndex);
      drawTrail();
      for (const item of obstacles) { drawIncomingWarning(item); drawObstacle(item); }
      drawDino();
    }
    function frame(timestamp) {
      const dt = lastTime ? Math.min((timestamp - lastTime) / 1000, .033) : 0;
      lastTime = timestamp;
      if (state === "running") update(dt);
      render();
      requestAnimationFrame(frame);
    }
    function action() {
      if (state === "ready" || state === "over") startGame();
      else if (state === "paused") resumeGame();
      else jump();
    }
    document.addEventListener("keydown", event => {
      if (event.target?.closest?.("button")) return;
      if (["Space", "ArrowUp", "ArrowDown"].includes(event.code)) event.preventDefault();
      if (["ArrowDown", "KeyS"].includes(event.code)) { keys.add(event.code); updateDuck(); return; }
      if (["Space", "ArrowUp", "KeyW"].includes(event.code)) { if (!event.repeat) action(); return; }
      if (["ShiftLeft", "ShiftRight", "KeyX"].includes(event.code)) { if (!event.repeat) activateSkill(); return; }
      if (["KeyP", "Escape"].includes(event.code) && !event.repeat) {
        if (state === "running") pauseGame(); else if (state === "paused") resumeGame();
      }
    });
    document.addEventListener("keyup", event => {
      if (["ArrowDown", "KeyS"].includes(event.code)) { keys.delete(event.code); updateDuck(); }
    });
    window.addEventListener("blur", () => { keys.clear(); player.duck = false; pauseGame(); });
    document.addEventListener("visibilitychange", () => { if (document.hidden) pauseGame(); });
    mainButton.addEventListener("click", action);
    canvas.addEventListener("pointerdown", event => { if (event.pointerType !== "mouse" || event.button === 0) action(); });
    pauseButton.addEventListener("click", () => state === "running" ? pauseGame() : resumeGame());
    soundButton.addEventListener("click", () => {
      muted = !muted;
      if (muted) { milestoneSound.pause(); hitSound.pause(); }
      writeStore("rainbowDino.muted.v1", muted ? "1" : "0"); updateSoundButton();
      if (state === "running") canvas.focus({ preventScroll: true });
    });
    const jumpButton = document.getElementById("jumpButton");
    const duckButton = document.getElementById("duckButton");
    jumpButton.addEventListener("pointerdown", event => { event.preventDefault(); action(); });
    skillButton.addEventListener("pointerdown", event => { event.preventDefault(); activateSkill(); });
    duckButton.addEventListener("pointerdown", event => {
      event.preventDefault(); duckButton.setPointerCapture(event.pointerId);
      keys.add("touch"); updateDuck();
    });
    for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) {
      duckButton.addEventListener(name, () => { keys.delete("touch"); updateDuck(); });
    }
    skinGrid.addEventListener("click", event => {
      const button = event.target.closest("button[data-skin]");
      if (!button || !skinUnlocked(button.dataset.skin)) return;
      if (state === "running") pauseGame();
      if (selectedSkinId === button.dataset.skin) return;
      selectedSkinId = button.dataset.skin;
      saveProgress(); renderCollection();
    });
    window.addEventListener("resize", resize);
    saveProgress(); updateSoundButton(); resize(); setOverlay("ready"); renderCollection(); requestAnimationFrame(frame);
  })();
