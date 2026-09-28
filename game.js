(() => {
    "use strict";
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const stage = document.getElementById("stage");
    const overlay = document.getElementById("overlay");
    const mainButton = document.getElementById("mainButton");
    const pauseButton = document.getElementById("pauseButton");
    const musicButton = document.getElementById("musicButton");
    const soundButton = document.getElementById("soundButton");
    const milestoneSound = document.getElementById("milestoneSound");
    const hitSound = document.getElementById("hitSound");
    const jumpSound = document.getElementById("jumpSound");
    const duckSound = document.getElementById("duckSound");
    const skillSound = document.getElementById("skillSound");
    const musicPlayers = [document.getElementById("musicA"), document.getElementById("musicB")];
    const scoreEl = document.getElementById("score");
    const bestEl = document.getElementById("best");
    const bestLabelEl = document.getElementById("bestLabel");
    const speedEl = document.getElementById("speed");
    const speedLabelEl = document.getElementById("speedLabel");
    const modePicker = document.getElementById("modePicker");
    const modePickerLabel = document.getElementById("modePickerLabel");
    const normalModeButton = document.getElementById("normalModeButton");
    const hardModeButton = document.getElementById("hardModeButton");
    const runBestLabel = document.getElementById("runBestLabel");
    const sceneEl = document.getElementById("sceneName");
    const skillStatusEl = document.getElementById("skillStatus");
    const skillNameEl = document.getElementById("skillName");
    const skillRemainingEl = document.getElementById("skillRemaining");
    const skillProgressEl = document.getElementById("skillProgress");
    const skillFillEl = document.getElementById("skillFill");
    const skillEffectEl = document.getElementById("skillEffect");
    const skillButton = document.getElementById("skillButton");
    const toastEl = document.getElementById("achievementToast");
    const skinGrid = document.getElementById("skinGrid");
    const achievementGrid = document.getElementById("achievementGrid");
    const collectionNote = document.getElementById("collectionNote");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const colors = ["#d8ecb2", "#a5d7bd", "#e8d59b", "#90bfae", "#d5e5cd"];
    const skins = [
      { id: "prism", name: "青嵐龍", ability: "凌風身法", hint: "跑速提高 10%，持續 2.5 秒", cooldown: 5, duration: 2.5, bodyA: "#c3e2bc", bodyB: "#6fac92", tail: "#548d78", snout: "#8bc9a4", legs: "#44695b", belly: "#e1f0cf", trim: "#e9d59a", spikes: colors },
      { id: "cloud", name: "雲翼龍", ability: "雲端二段跳", hint: "空中再跳一次，躍過危險", cooldown: 5, duration: 0, bodyA: "#c8e7ff", bodyB: "#83b8f5", tail: "#7aa8db", snout: "#a8d4fb", legs: "#5878c4", belly: "#eaf6fb", trim: "#f8fbf4", spikes: ["#f9faff", "#d3e4ff", "#a6c7f9", "#edf3ff", "#b2c6f3"] },
      { id: "shield", name: "星盾龍", ability: "星光護盾", hint: "3 秒內抵擋一次碰撞", cooldown: 5, duration: 3, bodyA: "#e1b7f8", bodyB: "#a588df", tail: "#9475c3", snout: "#c4a4eb", legs: "#745caa", belly: "#ead8f6", trim: "#ffe3a1", spikes: ["#fff0b4", "#ffd3e3", "#ded0ff", "#a9b8ff", "#ffe1a4"] },
      { id: "aurora", name: "極光龍", ability: "極光緩速", hint: "場景放慢至 75%，持續 2.5 秒", cooldown: 5, duration: 2.5, bodyA: "#9cf3e0", bodyB: "#6b97df", tail: "#6c9ac4", snout: "#9dccdc", legs: "#536daf", belly: "#bce9e8", trim: "#e3f8dc", spikes: ["#9df2d8", "#79e0d8", "#a9b9fc", "#d9a7f0", "#b7f9d4"] },
      { id: "godzilla", name: "哥吉拉", ability: "光速破壞", hint: "清除畫面內前方所有障礙", cooldown: 5, duration: 0, bodyA: "#444b4d", bodyB: "#171c20", tail: "#202629", snout: "#30383a", legs: "#11171b", spikes: ["#e8e9e3", "#c8cfca", "#f1f0e8", "#aebbb6", "#d9ded8"] }
    ];
    const achievementDefs = [
      { id: "first100", name: "初入江湖", description: "單局達 100 分", goal: 100, reward: "解鎖雲翼龍", icon: "🎋" },
      { id: "ground10", name: "凌空十躍", description: "單局跳過 10 個地面障礙", goal: 10, reward: "成就徽章", icon: "🥋" },
      { id: "birds5", name: "伏影五閃", description: "單局蹲下閃過 5 個飛行障礙", goal: 5, reward: "解鎖星盾龍", icon: "🍃" },
      { id: "score500", name: "千里行者", description: "單局達 500 分", goal: 500, reward: "成就徽章", icon: "🧭" },
      { id: "passed25", name: "過關斬將", description: "單局通過 25 個障礙", goal: 25, reward: "成就徽章", icon: "⚔" },
      { id: "skill3", name: "招式連環", description: "單局發動技能 3 次，並達 300 分", goal: 100, reward: "成就徽章", icon: "✦" },
      { id: "allSix", name: "百藝宗師", description: "完成前六個成就", goal: 6, reward: "解鎖極光龍", icon: "🏆" },
      { id: "score5000", name: "萬里龍吟", description: "單局達 5000 分", goal: 5000, reward: "解鎖哥吉拉", icon: "🐲" }
    ];
    const clouds = [
      { x: .12, y: .19, s: .8, rate: .07 }, { x: .45, y: .28, s: 1.08, rate: .045 },
      { x: .77, y: .14, s: .66, rate: .065 }, { x: 1.08, y: .32, s: .92, rate: .05 }
    ];
    const scenes = [
      { name: "青竹山徑", sky: ["#172e32", "#345b59", "#7eaa8f"], glow: "205, 224, 161", far: "#446b65", near: "#31584f", ground: ["#314c45", "#182f30"], line: "#d4c695", track: "rgba(224, 214, 171, .21)" },
      { name: "桃花渡口", sky: ["#544765", "#b48586", "#e7bb9d"], glow: "255, 219, 174", far: "#9f7c83", near: "#736c72", ground: ["#625961", "#363b4c"], line: "#f3d4ab", track: "rgba(249, 213, 178, .24)" },
      { name: "雲崖劍谷", sky: ["#1e344d", "#45657a", "#829ba7"], glow: "200, 230, 221", far: "#5b7884", near: "#3c5b68", ground: ["#3e5260", "#243741"], line: "#d6e2c9", track: "rgba(214, 228, 212, .23)" },
      { name: "雪夜古關", sky: ["#17283f", "#33506c", "#6b8393"], glow: "202, 221, 229", far: "#547184", near: "#3c5b6c", ground: ["#3a5061", "#213440"], line: "#d8e8e5", track: "rgba(220, 235, 230, .25)" }
    ];
    const sceneFadeDuration = .8;
    const keys = new Set();
    const world = { width: 0, height: 0, ground: 0, baseSpeed: 0 };
    const player = { x: 0, jump: 0, velocity: 0, duck: false };
    let state = "ready";
    let elapsed = 0;
    let pausedHeroTailSway = 0;
    let distance = 0;
    let progress = 0;
    let speed = 0;
    let score = 0;
    let spawnTimer = 1.6;
    let obstacles = [];
    let lastTime = 0;
    const actionVoices = new Set();
    const musicVolume = .24;
    const musicCrossfadeSeconds = 2;
    let musicLeadIndex = 0;
    let musicFading = false;
    let musicPlaying = false;
    let musicFadeBlocked = false;
    let musicEpoch = 0;
    let naturalSpeed = 0;
    let sceneIndex = 0;
    let pendingSceneIndex = null;
    let previousSceneIndex = null;
    let sceneFadeRemaining = 0;
    let skillCooldown = 0;
    let skillActive = 0;
    let shieldCharges = 0;
    let beamRemaining = 0;
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
    function validScore(value) {
      const number = Number(value);
      return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
    }
    function loadHardRecord() {
      try {
        const saved = JSON.parse(readStore("rainbowDino.hardRecord.v1", "{}"));
        return { score: validScore(saved?.score), skin: skins.some(item => item.id === saved?.skin) ? saved.skin : null };
      } catch { return { score: 0, skin: null }; }
    }
    let normalBest = validScore(readStore("rainbowDino.best.v1", "0"));
    let hardRecord = loadHardRecord();
    const storedMode = readStore("rainbowDino.mode.v1", "normal");
    let selectedModeId = storedMode === "hard" ? "hard" : "normal";
    let activeModeId = selectedModeId;
    function modeBest(id) { return id === "hard" ? hardRecord.score : normalBest; }
    let best = modeBest(selectedModeId);
    const legacyAudioDefault = readStore("rainbowDino.muted.v1", "0") === "1" ? "0" : "1";
    let musicEnabled = readStore("rainbowDino.musicEnabled.v1", legacyAudioDefault) === "1";
    let sfxEnabled = readStore("rainbowDino.sfxEnabled.v1", legacyAudioDefault) === "1";
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
    const lifetimeBest = Math.max(normalBest, hardRecord.score);
    if (lifetimeBest >= 100) progressData.completed.first100 = true;
    if (lifetimeBest >= 500) progressData.completed.score500 = true;
    if (lifetimeBest >= 5000) progressData.completed.score5000 = true;
    progressData.bestRun.score5000 = Math.max(Number(progressData.bestRun.score5000) || 0, Math.min(lifetimeBest, 5000));
    if (achievementDefs.slice(0, 6).every(item => progressData.completed[item.id])) progressData.completed.allSix = true;
    function skinUnlocked(id) {
      return id === "prism" || (id === "cloud" && !!progressData.completed.first100) ||
        (id === "shield" && !!progressData.completed.birds5) ||
        (id === "aurora" && !!progressData.completed.allSix) ||
        (id === "godzilla" && !!progressData.completed.score5000);
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
        case "first100": case "score500": case "score5000": return score;
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
      const skinName = id === "first100" ? "雲翼龍" : id === "birds5" ? "星盾龍" :
        id === "allSix" ? "極光龍" : id === "score5000" ? "哥吉拉" : null;
      toastQueue.push(`成就達成：${achievement.name}${skinName ? ` · 解鎖${skinName}` : ""}`);
      showNextToast();
      renderCollection();
    }
    function checkAchievements() {
      for (const item of achievementDefs.slice(0, 6)) {
        if (currentAchievementValue(item.id) >= item.goal) unlockAchievement(item.id);
      }
      if (currentAchievementValue("allSix") === 6) unlockAchievement("allSix");
      if (currentAchievementValue("score5000") >= 5000) unlockAchievement("score5000");
    }
    function saveRunProgress() {
      for (const item of achievementDefs.slice(0, 6)) {
        const value = Math.min(item.goal, currentAchievementValue(item.id));
        progressData.bestRun[item.id] = Math.max(Number(progressData.bestRun[item.id]) || 0, value);
      }
      progressData.bestRun.score5000 = Math.max(Number(progressData.bestRun.score5000) || 0, Math.min(score, 5000));
      saveProgress();
    }
    function skinPortrait(skin) {
      if (skin.id === "godzilla") {
        return `<svg viewBox="-33 -81 103 83" aria-hidden="true">
          <path d="M14-40C2-36-7-33-15-26c-6 6-12 9-17 10 10 2 18-2 26-7L18-22Z" fill="#22292c" stroke="#87918f" stroke-width="1.8"/>
          <path d="m-17-27 1-11 7 9 3-14 9 12 3-21 10 14 3-28 9 18 7-29 7 22 6-16 6 20-7 10Z" fill="#d4d7d2" stroke="#354043" stroke-width="2" stroke-linejoin="round"/>
          <path d="M34-28q12-3 14 9l-4 7 4 5 5 3 1 4H37l-2-7-5-8q-1-8 4-13Z" fill="#1a2225" stroke="#697773" stroke-width="1.6"/>
          <path d="M10-39c3-16 14-25 30-22 8 2 13 10 13 21l-2 15c-2 8-7 12-15 14H27c-9-4-15-10-18-19-2-5-1-7 1-9Z" fill="#30393c" stroke="#9ba8a4" stroke-width="2"/>
          <path d="M30-43q9 1 14 8l-1 11q-3 8-9 12l-8-5q-5-6-4-13 2-9 8-13Z" fill="#4d585a"/>
          <path d="M15-26q12-4 15 9l-4 5 1 5 6 3 1 4H17l-3-6-4-8q-1-8 5-12Z" fill="#273034" stroke="#91a09a" stroke-width="1.6"/>
          <path d="m27-1 3 1m-9-1 3 1m23-1 3 1" stroke="#d7dad2" stroke-width="1.3"/>
          <path d="M42-60c5-8 16-10 22-4l4 9-3 6 3 2-3 5H54l-9-4-5-8Z" fill="#394246" stroke="#a7b2ae" stroke-width="1.8"/>
          <path d="M48-43c5 2 11 3 17 1l-5 5-10-2Z" fill="#242c2f" stroke="#899691" stroke-width="1.2"/>
          <path d="M43-37c6-3 9 1 8 6l-4 5 5 3-3 3-8-5-3-9Z" fill="#222a2d" stroke="#8c9a95" stroke-width="1.4"/>
          <path d="m49-22 3 3 3-2" fill="none" stroke="#e1e3db" stroke-width="1.6"/>
          <path d="M48-59q8-5 13-1" fill="none" stroke="#aab7af" stroke-width="2" stroke-linecap="round"/>
          <circle cx="57" cy="-55" r="2.1" fill="#edcf94"/>
          <path d="M56-47h10" stroke="#c5cbc3" stroke-width="1.5"/>
        </svg>`;
      }
      const back = skin.id === "prism"
        ? `<path d="M7-43q-3-12 7-17 2 12-5 17Zm11-5q-2-15 9-20 1 12-7 20Zm13-4q1-13 11-16-2 12-9 17Z" fill="${skin.spikes[0]}" stroke="#5b9779" stroke-width="1.5"/>`
        : skin.id === "cloud"
          ? `<path d="M5-43q-1-14 9-19 3 13-6 20Zm12-6q0-15 10-21 3 13-7 22Zm13-4q3-13 13-16 1 12-9 18Z" fill="#f1f8fb" stroke="#8caed7" stroke-width="1.5"/>`
          : skin.id === "shield"
            ? `<path d="m6-42 2-14 8 6-1 10Zm12-7 4-18 9 10-3 11Zm13-5 7-14 7 12-7 7Z" fill="#e2c9f2" stroke="#f7dfaa" stroke-width="2" stroke-linejoin="round"/>`
            : `<path d="M6-42q-2-15 8-22 4 13-4 22Zm11-8q1-16 12-21 3 15-8 22Zm13-5q4-13 14-15 0 14-10 18Z" fill="#b9f3e5" stroke="#8eb2e6" stroke-width="2"/>`;
      const outfit = skin.id === "prism"
        ? `<path d="M43-56Q28-59 13-54l10 3-11 4q17-2 31-5Z" fill="#e8d59b" stroke="#5f9d79" stroke-width="1.2"/><path d="m14-51-13-8 5 10Z" fill="#e8d59b"/>`
        : skin.id === "cloud"
          ? `<path d="M19-43Q28-49 39-42L35-25 12-28Z" fill="#ecf6fb" stroke="#86b4dd" stroke-width="1.5"/><path d="M42-63q1-10 9-10 2 8-6 13Z" fill="#f8fbff" stroke="#89aed7" stroke-width="1.2"/><path d="m-13-27-8-7 10 3Z" fill="#edf8fc"/>`
          : skin.id === "shield"
            ? `<path d="M34-45 44-42 46-31 37-26 30-35Z" fill="#8067ae" stroke="#ffe3a1" stroke-width="2"/><path d="M46-63h16" stroke="#ffe3a1" stroke-width="3"/>`
            : `<path d="M19-45Q29-50 40-42L35-21 11-28Z" fill="#80bcd6" stroke="#d9f7e9" stroke-width="1.6"/><path d="M18-42q12 4 18 15" fill="none" stroke="#bbf6e7" stroke-width="2"/><path d="M44-63q5-9 12-9-2 9-8 13Z" fill="#d9b7ef" stroke="#9de9df" stroke-width="1.2"/>`;
      const badge = skin.id === "shield"
        ? `<path d="m24-35 2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1Z" fill="#fff0b6"/>` : "";
      const headwear = skin.id === "prism"
        ? `<path d="M42-61h20" stroke="#f1da9e" stroke-width="3"/><path d="m43-61-15-4 7 6Z" fill="#e7d392"/>`
        : skin.id === "cloud"
          ? `<path d="M42-64q-3-11 7-11 4 7-2 13Z" fill="#f7fbfc" stroke="#8fb9df" stroke-width="1.3"/>`
          : skin.id === "shield"
            ? `<path d="M43-63h19" stroke="#ffe3a1" stroke-width="3"/><path d="m48-64 4-7 4 8Z" fill="#fff1ba"/>`
            : `<path d="M43-65q5-11 13-11-2 9-8 14Z" fill="#d8b6ed" stroke="#c6f7e8" stroke-width="1.4"/>`;
      return `<svg viewBox="-20 -74 90 76" aria-hidden="true">
        <path d="M13-39Q-1-40-18-21q10-1 20 3l18-3Z" fill="${skin.tail}" stroke="${skin.legs}" stroke-width="1.5"/>
        ${back}
        <path d="M32-20q7-4 11 2l-1 11 9 4 1 3H36l-2-8Z" fill="${skin.legs}"/>
        <path d="M8-42q5-16 24-15 17 1 19 21l-2 15q-5 11-19 11H18Q5-16 6-29Z" fill="${skin.bodyB}" stroke="${skin.legs}" stroke-width="1.7"/>
        ${outfit}
        <path d="M28-41q11 2 12 13l-5 13-9-2q-6-7-5-14Z" fill="${skin.belly}" opacity=".84"/>
        ${badge}
        <path d="M14-23q10-4 14 4l-1 12 8 4 1 3H19l-3-8-6-5Z" fill="${skin.legs}" stroke="${skin.tail}" stroke-width="1.3"/>
        <path d="M37-59q5-8 16-7 11 1 12 11l-2 6 5 4-3 5H47l-8-6Z" fill="${skin.bodyA}" stroke="${skin.legs}" stroke-width="1.7"/>
        ${headwear}
        <path d="M43-39q8-3 10 5l-4 6 4 2-3 2-9-5Z" fill="${skin.bodyB}" stroke="${skin.legs}" stroke-width="1.2"/>
        <circle cx="55" cy="-55" r="2.5" fill="#1d3150"/>
        <path d="M55-43h11" stroke="${skin.snout}" stroke-width="2.2" stroke-linecap="round"/>
      </svg>`;
    }
    function renderSkins() {
      skinGrid.innerHTML = skins.map(skin => {
        const unlocked = skinUnlocked(skin.id);
        const selected = skin.id === selectedSkinId;
        const label = unlocked ? (selected ? "已選擇" : "選用造型") :
          skin.id === "cloud" ? "達成初入江湖解鎖" : skin.id === "shield" ? "達成伏影五閃解鎖" :
            skin.id === "godzilla" ? "單局達 5000 分解鎖" : "完成前六個成就解鎖";
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
      const modeName = selectedModeId === "hard" ? "困難" : "一般";
      const recordSkinId = selectedModeId === "hard" ? hardRecord.skin : progressData.bestSkin;
      const bestSkin = skins.find(item => item.id === recordSkinId);
      const recordText = bestSkin ? `${modeName}模式最高分由${bestSkin.name}創下。` :
        best > 0 ? `${modeName}模式已有最高分紀錄。` : `${modeName}模式尚無最高分紀錄。`;
      collectionNote.textContent = `已選擇${skins.find(item => item.id === selectedSkinId).name}，從下一局開始使用；兩種模式分開記錄最高分，成就與造型共用。${recordText}`;
    }

    function formatted(value) { return String(value).padStart(4, "0"); }
    function updateModeButtons() {
      normalModeButton.setAttribute("aria-pressed", String(selectedModeId === "normal"));
      hardModeButton.setAttribute("aria-pressed", String(selectedModeId === "hard"));
    }
    function chooseMode(id) {
      if ((state !== "ready" && state !== "over") || (id !== "normal" && id !== "hard") || id === selectedModeId) return;
      selectedModeId = id;
      if (state === "ready") activeModeId = id;
      best = modeBest(id);
      writeStore("rainbowDino.mode.v1", id);
      updateModeButtons(); updateHud(); renderCollection();
    }
    function naturalMultiplier() {
      return 1 + (activeModeId === "hard" ? elapsed * .015 : Math.min(1.5, elapsed * .015));
    }
    function skillSpeedMultiplier() {
      return skillActive > 0 && activeSkinId === "prism" ? 1.1 :
        skillActive > 0 && activeSkinId === "aurora" ? .75 : 1;
    }
    function updateSkillMeter() {
      const skin = currentSkin();
      const ready = skillCooldown <= 0;
      const airborne = player.jump > 0 || player.velocity > 0;
      const canUse = ready && (skin.id !== "cloud" || (airborne && !doubleJumpUsed));
      const seconds = (Math.ceil(skillCooldown * 10) / 10).toFixed(1);
      const remaining = ready ? "可使用" : `CD ${seconds} 秒`;
      const groundCloud = ready && skin.id === "cloud" && !canUse;
      const percent = ready ? 100 : Math.max(0, Math.min(99, Math.floor((1 - skillCooldown / skin.cooldown) * 100)));
      const effect = skillActive > 0 ? `發動中 ${skillActive.toFixed(1)} 秒` : "";
      const usable = canUse && state === "running";
      const statusClass = `skill-badge${effect ? " active" : ready ? " ready" : ""}${usable ? " usable" : ""}`;
      if (skillStatusEl.className !== statusClass) skillStatusEl.className = statusClass;
      skillNameEl.textContent = skin.ability;
      skillRemainingEl.textContent = groundCloud ? "空中發動" : remaining;
      skillEffectEl.textContent = effect;
      skillFillEl.style.width = `${percent}%`;
      skillProgressEl.setAttribute("aria-label", `${skin.ability}冷卻進度`);
      skillProgressEl.setAttribute("aria-valuenow", String(percent));
      skillProgressEl.setAttribute("aria-valuetext", ready
        ? (groundCloud ? "冷卻完成，空中發動" : "冷卻完成，可使用")
        : `冷卻剩餘 ${seconds} 秒，進度 ${percent}%`);
      skillButton.classList.toggle("skill-ready", usable);
      skillButton.disabled = !usable;
      skillButton.setAttribute("aria-label", `${skin.ability}，${groundCloud ? "空中發動" : remaining}${effect ? `，${effect}` : ""}`);
    }
    function updateHud() {
      scoreEl.textContent = formatted(score);
      bestEl.textContent = formatted(best);
      bestLabelEl.textContent = `${selectedModeId === "hard" ? "困難" : "一般"}最高分`;
      speedLabelEl.textContent = `${activeModeId === "hard" ? "困難" : "一般"}速度`;
      scoreEl.classList.toggle("compact", score >= 100000);
      scoreEl.classList.toggle("ultra-compact", score >= 1000000);
      bestEl.classList.toggle("compact", best >= 100000);
      bestEl.classList.toggle("ultra-compact", best >= 1000000);
      const speedRatio = speed / Math.max(world.baseSpeed, 1);
      const speedText = speedRatio < 10 ? (speedRatio > 2.5 ? speedRatio.toFixed(2) : speedRatio.toFixed(1)) :
        speedRatio < 100 ? speedRatio.toFixed(1) : speedRatio < 1000 ? String(Math.round(speedRatio)) : `${(speedRatio / 1000).toFixed(1)}k`;
      speedEl.textContent = `×${speedText}`;
      sceneEl.textContent = scenes[sceneIndex].name;
      updateSkillMeter();
    }
    function updateAudioButtons() {
      for (const [button, name, icon, enabled] of [
        [musicButton, "背景音樂", "♬", musicEnabled], [soundButton, "音效", "♪", sfxEnabled]
      ]) {
        button.innerHTML = `<span aria-hidden="true">${icon}</span><span class="audio-label">${name === "背景音樂" ? "音樂" : name}${enabled ? "開啟" : "關閉"}</span>`;
        button.setAttribute("aria-pressed", String(enabled));
        button.setAttribute("aria-label", `${name}已${enabled ? "開啟，按下關閉" : "關閉，按下開啟"}`);
      }
    }
    function stopMusic(reset = false) {
      musicEpoch++;
      musicPlaying = false;
      for (const player of musicPlayers) {
        try { player.pause(); } catch { /* 音樂為選用功能 */ }
      }
      if (reset) {
        musicLeadIndex = 0; musicFading = false; musicFadeBlocked = false;
        for (const [index, player] of musicPlayers.entries()) {
          try { player.currentTime = 0; player.volume = index === 0 ? musicVolume : 0; } catch { /* 素材未載入仍可重玩 */ }
        }
      }
    }
    function startMusic() {
      if (!musicEnabled || state !== "running" || musicPlaying) return;
      const epoch = ++musicEpoch;
      musicPlaying = true;
      try {
        const lead = musicPlayers[musicLeadIndex];
        lead.loop = true;
        if (!musicFading) lead.volume = musicVolume;
        const result = lead.play();
        if (result?.catch) result.catch(() => { if (epoch === musicEpoch) stopMusic(); });
        if (musicFading) {
          const incoming = musicPlayers[1 - musicLeadIndex];
          incoming.loop = true;
          try {
            const nextResult = incoming.play();
            if (nextResult?.catch) nextResult.catch(() => {
              if (epoch === musicEpoch) {
                musicFading = false; musicFadeBlocked = true;
                incoming.pause(); lead.volume = musicVolume;
              }
            });
          } catch {
            musicFading = false; musicFadeBlocked = true;
            incoming.pause(); lead.volume = musicVolume;
          }
        }
      } catch { if (epoch === musicEpoch) stopMusic(); }
    }
    function updateMusic() {
      if (!musicPlaying || !musicEnabled) return;
      const lead = musicPlayers[musicLeadIndex];
      const duration = lead.duration;
      if (!Number.isFinite(duration) || duration <= musicCrossfadeSeconds + .5) return;
      if (musicFadeBlocked && lead.currentTime < duration - musicCrossfadeSeconds - .2) musicFadeBlocked = false;
      if (!musicFading && !musicFadeBlocked && lead.currentTime >= duration - musicCrossfadeSeconds) {
        const outgoingIndex = musicLeadIndex;
        const incomingIndex = 1 - outgoingIndex;
        const incoming = musicPlayers[incomingIndex];
        const epoch = musicEpoch;
        try {
          incoming.pause(); incoming.currentTime = 0; incoming.volume = 0; incoming.loop = true;
          musicFading = true;
          const result = incoming.play();
          if (result?.catch) result.catch(() => {
            if (epoch !== musicEpoch) return;
            if (musicFading && musicLeadIndex === outgoingIndex) {
              musicFading = false; musicFadeBlocked = true;
              incoming.pause(); lead.volume = musicVolume;
            } else if (musicLeadIndex === incomingIndex) {
              incoming.pause(); incoming.volume = 0;
              musicLeadIndex = outgoingIndex; musicFadeBlocked = true;
              try {
                lead.currentTime = 0; lead.volume = musicVolume;
                const fallback = lead.play();
                if (fallback?.catch) fallback.catch(() => { if (epoch === musicEpoch) stopMusic(); });
              } catch { stopMusic(); }
            }
          });
        } catch {
          musicFading = false; musicFadeBlocked = true; lead.volume = musicVolume;
        }
      }
      if (!musicFading) return;
      const incoming = musicPlayers[1 - musicLeadIndex];
      const progress = lead.currentTime < duration - musicCrossfadeSeconds - .2 ? 1 :
        Math.max(0, Math.min(1, (lead.currentTime - (duration - musicCrossfadeSeconds)) / musicCrossfadeSeconds));
      lead.volume = musicVolume * Math.cos(progress * Math.PI / 2);
      incoming.volume = musicVolume * Math.sin(progress * Math.PI / 2);
      if (progress >= .95) {
        lead.pause();
        try { lead.currentTime = 0; } catch { /* 已停止的音樂可在下輪再重設 */ }
        lead.volume = 0; incoming.volume = musicVolume;
        musicLeadIndex = 1 - musicLeadIndex;
        musicFading = false; musicFadeBlocked = false;
      }
    }
    function playAudio(element) {
      if (!sfxEnabled) return;
      try {
        element.pause(); element.currentTime = 0;
        const result = element.play();
        if (result?.catch) result.catch(() => {});
      } catch { /* 瀏覽器拒絕播放時保持遊戲可用 */ }
    }
    function playActionClip(template, volume) {
      if (!sfxEnabled) return;
      let voice;
      try {
        voice = template.cloneNode(true);
        voice.preload = "auto";
        voice.volume = volume;
        const cleanup = () => actionVoices.delete(voice);
        voice.addEventListener("ended", cleanup, { once: true });
        voice.addEventListener("error", cleanup, { once: true });
        actionVoices.add(voice);
        const result = voice.play();
        if (result?.catch) result.catch(cleanup);
      } catch {
        if (voice) actionVoices.delete(voice);
        /* 音效無法播放時保持操作可用 */
      }
    }
    function playJump() { playActionClip(jumpSound, .88); }
    function playDuck() { playActionClip(duckSound, .82); }
    function playSkill() { playActionClip(skillSound, .84); }

    function setOverlay(mode) {
      overlay.hidden = mode === "running";
      modePicker.hidden = mode !== "ready" && mode !== "over";
      if (mode === "running") return;
      modePickerLabel.textContent = mode === "over" ? "選擇下一局模式" : "選擇遊戲模式";
      const content = {
        ready: ["⚔", "準備闖蕩江湖了嗎？", "躍過路障、蹲下閃開飛行障礙，穿越四處江湖勝景。", "開始遊戲 →"],
        paused: ["⏸", "先喘口氣", "準備好了就繼續奔跑。", "繼續遊戲 →"],
        over: ["✨", "這次跑得真不錯！", "點選下方「再玩一次」重新出發。", "再玩一次 →"]
      }[mode];
      document.getElementById("modalIcon").textContent = content[0];
      document.getElementById("modalTitle").textContent = content[1];
      document.getElementById("modalDescription").textContent = content[2];
      mainButton.textContent = content[3];
      document.getElementById("finalScore").hidden = mode !== "over";
      if (mode === "over") {
        document.getElementById("runScore").textContent = formatted(score);
        runBestLabel.textContent = `${activeModeId === "hard" ? "困難" : "一般"}模式最高分`;
        document.getElementById("runBest").textContent = formatted(modeBest(activeModeId));
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
      if (state !== "running") {
        naturalSpeed = world.baseSpeed * naturalMultiplier();
        speed = naturalSpeed * skillSpeedMultiplier();
      }
      updateHud();
    }
    function resetRun() {
      elapsed = 0; distance = 0; progress = 0; score = 0; spawnTimer = 1.65;
      pausedHeroTailSway = 0;
      obstacles = []; keys.clear();
      sceneIndex = 0; pendingSceneIndex = null; previousSceneIndex = null; sceneFadeRemaining = 0;
      player.jump = 0; player.velocity = 0; player.duck = false;
      runStats = { groundJumped: 0, birdsDucked: 0, passed: 0, skillUses: 0 };
      skillCooldown = 0; skillActive = 0; shieldCharges = 0; doubleJumpUsed = false;
      beamRemaining = 0;
      activeModeId = selectedModeId; best = modeBest(activeModeId);
      activeSkinId = selectedSkinId;
      naturalSpeed = world.baseSpeed; speed = world.baseSpeed;
      updateHud();
    }
    function startGame() {
      stopMusic(true);
      resetRun(); state = "running"; pauseButton.disabled = false;
      pauseButton.textContent = "暫停"; setOverlay("running");
      updateHud(); renderCollection(); canvas.focus({ preventScroll: true }); startMusic();
    }
    function pauseGame() {
      if (state !== "running") return;
      pausedHeroTailSway = heroTailSway();
      state = "paused"; player.duck = false; keys.clear();
      stopMusic();
      pauseButton.textContent = "繼續"; setOverlay("paused"); updateHud();
    }
    function resumeGame() {
      if (state !== "paused") return;
      state = "running"; lastTime = 0;
      pauseButton.textContent = "暫停"; setOverlay("running"); updateHud(); canvas.focus({ preventScroll: true }); startMusic();
    }
    function endGame() {
      if (state !== "running") return;
      state = "over"; player.duck = false; keys.clear(); beamRemaining = 0; pauseButton.disabled = true;
      stopMusic(true);
      checkAchievements(); saveRunProgress();
      if (score > best) {
        best = score;
        if (activeModeId === "hard") {
          hardRecord = { score, skin: activeSkinId };
          writeStore("rainbowDino.hardRecord.v1", JSON.stringify(hardRecord));
        } else {
          normalBest = score; progressData.bestSkin = activeSkinId;
          writeStore("rainbowDino.best.v1", best); saveProgress();
        }
      }
      updateHud(); renderCollection(); playAudio(hitSound); setOverlay("over");
    }
    function jump() {
      if (state !== "running" || player.jump > 0 || player.velocity !== 0) return;
      player.duck = false;
      player.velocity = 680;
      doubleJumpUsed = false;
      playJump();
      updateSkillMeter();
    }
    function activateSkill() {
      if (state !== "running" || skillCooldown > 0) return false;
      const skin = currentSkin();
      if (skin.id === "cloud") {
        if ((player.jump <= 0 && player.velocity <= 0) || doubleJumpUsed) return false;
        player.velocity = 520;
        doubleJumpUsed = true;
      } else if (skin.id === "godzilla") {
        beamRemaining = reducedMotion.matches ? .12 : .35;
        // 發動時先移除命中的障礙，避免下一畫格碰撞或計入閃避成就。
        for (const item of obstacles) {
          if (item.x >= player.x + 53 && item.x < world.width) item.neutralized = true;
        }
        obstacles = obstacles.filter(item => !item.neutralized);
      } else {
        skillActive = skin.duration;
        if (skin.id === "shield") shieldCharges = 1;
      }
      skillCooldown = skin.cooldown;
      runStats.skillUses++;
      playSkill();
      checkAchievements(); renderAchievements(); updateHud();
      return true;
    }
    function updateDuck() {
      const wasDucking = player.duck;
      player.duck = state === "running" && player.jump === 0 && player.velocity === 0 && keys.size > 0;
      if (!wasDucking && player.duck) playDuck();
    }
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
    function obstacleContact(item, oldX, travel, hitbox, jumpBefore, velocityBefore, dt) {
      const box = obstacleBox(item);
      const oldLeft = oldX + box.x - item.x;
      let enter = 0, leave = 0;
      if (travel > 0) {
        enter = Math.max(0, (oldLeft - hitbox.x - hitbox.width) / travel);
        leave = Math.min(1, (oldLeft + box.width - hitbox.x) / travel);
        if (enter >= leave) return { crossed: false, hit: false };
      } else if (!overlaps(hitbox, box)) return { crossed: false, hit: false };

      const heightAt = fraction => Math.max(0, jumpBefore + velocityBefore * dt * fraction - 975 * dt * dt * fraction * fraction);
      let minJump = Math.min(heightAt(enter), heightAt(leave));
      let maxJump = Math.max(heightAt(enter), heightAt(leave));
      if (dt > 0) {
        const peak = velocityBefore / (1950 * dt);
        if (peak > enter && peak < leave) maxJump = Math.max(maxJump, heightAt(peak));
      }
      const playerTop = world.ground - (player.duck ? 29 : 61);
      const playerBottom = playerTop + (player.duck ? 25 : 56);
      const hit = maxJump > playerTop - (box.y + box.height) && minJump < playerBottom - box.y;
      return { crossed: true, hit, minJump };
    }
    function update(dt) {
      elapsed += dt;
      skillCooldown = Math.max(0, skillCooldown - dt);
      skillActive = Math.max(0, skillActive - dt);
      beamRemaining = Math.max(0, beamRemaining - dt);
      if (skillActive === 0) shieldCharges = 0;
      naturalSpeed = world.baseSpeed * naturalMultiplier();
      const skillMultiplier = skillSpeedMultiplier();
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
      const jumpBefore = player.jump, velocityBefore = player.velocity;
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
      const travel = speed * dt;
      const hitbox = playerBox();
      for (const item of obstacles) {
        const oldX = item.x;
        item.x -= travel;
        if (item.neutralized) continue;
        const contact = obstacleContact(item, oldX, travel, hitbox, jumpBefore, velocityBefore, dt);
        if (contact.hit) {
          if (shieldCharges > 0 && skillActive > 0 && activeSkinId === "shield") {
            shieldCharges = 0; skillActive = 0; item.neutralized = true;
          } else {
            endGame();
            break;
          }
        }
        if (contact.crossed && !item.neutralized && !item.avoidedBy) {
          if (item.kind !== "bird" && !contact.hit && contact.minJump >= 47) item.avoidedBy = "jump";
          if (item.kind === "bird" && !contact.hit && player.duck) item.avoidedBy = "duck";
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
      else updateSkillMeter();
    }

    function roundRect(x, y, width, height, radius, fill, stroke) {
      ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
    }
    function drawCloud(x, y, scale) {
      ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
      ctx.fillStyle = "rgba(235, 242, 224, .13)";
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
      ctx.fillStyle = index === 1 ? "rgba(255, 226, 190, .86)" : "rgba(240, 238, 213, .83)";
      ctx.beginPath(); ctx.arc(w * .78, h * .2, index === 1 ? 31 : 24, 0, Math.PI * 2); ctx.fill();
      if (index === 0 || index === 3) {
        ctx.save(); ctx.globalAlpha *= index === 0 ? .55 : .68;
        for (let i = 0; i < 23; i++) {
          const x = ((i * 127 + 37) % 997) / 997 * w;
          const y = 65 + ((i * 71) % 133) / 180 * h;
          ctx.fillStyle = index === 3 ? "#edf5f0" : "#e1ecd1";
          ctx.beginPath(); ctx.arc(x, y, i % 6 ? 1 : 1.7, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
      clouds.forEach(cloud => {
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
        ctx.fillStyle = "rgba(219, 232, 224, .15)";
        for (let i = 0; i < 7; i++) {
          const x = ((i * 149 - ambient * .025) % (w + 160) + w + 160) % (w + 160);
          ctx.beginPath(); ctx.moveTo(x - 24, world.ground - 46);
          ctx.lineTo(x + 2, world.ground - 114 - i % 3 * 13);
          ctx.lineTo(x + 25, world.ground - 46); ctx.fill();
        }
      }
      ctx.fillStyle = scene.near;
      ctx.beginPath(); ctx.moveTo(0, world.ground);
      for (let x = 0; x <= w + 20; x += 20) {
        const y = world.ground - 25 - Math.sin(x / 72 + 2.4) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, world.ground); ctx.fill();
      if (index === 0) {
        for (let i = 0; i < Math.ceil(w / 96) + 2; i++) {
          const x = ((i * 96 - ambient * .045) % (w + 120) + w + 120) % (w + 120) - 30;
          ctx.strokeStyle = "rgba(20, 56, 49, .75)"; ctx.lineWidth = 7;
          ctx.beginPath(); ctx.moveTo(x, world.ground); ctx.lineTo(x + 5, world.ground - 118 - i % 3 * 19); ctx.stroke();
          ctx.strokeStyle = "rgba(197, 222, 176, .3)"; ctx.lineWidth = 2;
          for (let joint = 0; joint < 3; joint++) {
            const jy = world.ground - 35 - joint * 31;
            ctx.beginPath(); ctx.moveTo(x - 4, jy); ctx.lineTo(x + 9, jy - 2); ctx.stroke();
            ctx.fillStyle = "rgba(34, 92, 67, .85)";
            ctx.beginPath(); ctx.moveTo(x + 4, jy); ctx.quadraticCurveTo(x + 24, jy - 21, x + 31, jy - 8);
            ctx.quadraticCurveTo(x + 17, jy - 4, x + 4, jy); ctx.fill();
          }
        }
      } else if (index === 1) {
        ctx.fillStyle = "rgba(202, 223, 208, .28)";
        ctx.fillRect(0, world.ground - 35, w, 28);
        ctx.strokeStyle = "rgba(63, 59, 62, .8)"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(0, world.ground - 26);
        ctx.quadraticCurveTo(w * .5, world.ground - 79, w, world.ground - 26); ctx.stroke();
        for (let i = 0; i < Math.ceil(w / 120) + 1; i++) {
          const x = ((i * 120 - ambient * .04) % (w + 130) + w + 130) % (w + 130);
          const y = world.ground - 20;
          ctx.fillStyle = "#785d61"; ctx.fillRect(x, y - 37, 3, 37);
          ctx.fillStyle = "#f5c4b0";
          for (const [dx, dy] of [[-12, -41], [7, -54], [18, -38]]) {
            ctx.beginPath(); ctx.arc(x + dx, y + dy, 11, 0, Math.PI * 2); ctx.fill();
          }
        }
      } else if (index === 2) {
        const templeX = w * .73, ridgeY = world.ground - 68;
        ctx.fillStyle = "#2b4653";
        ctx.fillRect(templeX - 23, ridgeY - 31, 46, 31);
        ctx.beginPath(); ctx.moveTo(templeX - 38, ridgeY - 30);
        ctx.lineTo(templeX, ridgeY - 49); ctx.lineTo(templeX + 38, ridgeY - 30); ctx.fill();
        ctx.fillStyle = "#d3c59e"; ctx.fillRect(templeX - 3, ridgeY - 21, 6, 21);
      } else {
        ctx.fillStyle = "#284554";
        ctx.fillRect(w * .6, world.ground - 72, w * .36, 64);
        for (let i = 0; i < 5; i++) {
          const x = w * .6 + i * w * .08;
          ctx.fillRect(x, world.ground - 86, 20, 14);
        }
        ctx.fillStyle = "rgba(238, 246, 240, .78)";
        ctx.fillRect(w * .6, world.ground - 74, w * .36, 5);
      }
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
      const offset = distance % (index === 1 ? 82 : 66);
      ctx.fillStyle = scene.track;
      for (let x = -offset; x < w + 84; x += index === 1 ? 82 : 66) {
        if (index === 0) {
          roundRect(x, y + 25, 35, 7, 3, ctx.fillStyle);
          roundRect(x + 12, y + 67, 28, 5, 2, ctx.fillStyle);
        } else if (index === 1) {
          roundRect(x, y + 21, 65, 5, 2, ctx.fillStyle);
          roundRect(x + 2, y + 62, 62, 4, 2, ctx.fillStyle);
        } else if (index === 2) {
          ctx.beginPath(); ctx.moveTo(x, y + 27); ctx.lineTo(x + 29, y + 24);
          ctx.lineTo(x + 32, y + 30); ctx.lineTo(x + 4, y + 33); ctx.fill();
          roundRect(x + 18, y + 66, 24, 3, 2, ctx.fillStyle);
        } else {
          roundRect(x, y + 28, 34, 6, 3, ctx.fillStyle);
          roundRect(x + 14, y + 68, 32, 4, 2, ctx.fillStyle);
        }
      }
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
    function drawBambooStake(item) {
      const x = item.x, y = world.ground, double = item.kind === "double";
      ctx.save();
      function stake(sx, height, scale) {
        const width = 19 * scale;
        ctx.lineWidth = 2.8;
        roundRect(sx + 4 * scale, y - height, width, height, 3, "#8fc2a0", "#1b3531");
        ctx.fillStyle = "#f1d9a7";
        ctx.beginPath(); ctx.moveTo(sx + 4 * scale, y - height);
        ctx.lineTo(sx + 13 * scale, y - height - 7 * scale);
        ctx.lineTo(sx + 23 * scale, y - height); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#1b3531"; ctx.lineWidth = 2.4; ctx.stroke();
        ctx.strokeStyle = "#f3dba9"; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(sx + 8 * scale, y - height + 4);
        ctx.lineTo(sx + 8 * scale, y - 5); ctx.stroke();
        ctx.strokeStyle = "#254d3d"; ctx.lineWidth = 2.2;
        for (let joint = 1; joint < 4; joint++) {
          const jy = y - height + joint * height / 4;
          ctx.beginPath(); ctx.moveTo(sx + 5 * scale, jy);
          ctx.lineTo(sx + 22 * scale, jy); ctx.stroke();
        }
        ctx.fillStyle = "#5e9b76";
        ctx.beginPath(); ctx.moveTo(sx + width, y - height * .68);
        ctx.lineTo(sx + width + 8 * scale, y - height * .79);
        ctx.lineTo(sx + width + 5 * scale, y - height * .57); ctx.closePath();
        ctx.fill(); ctx.strokeStyle = "#1b3531"; ctx.stroke();
      }
      if (double) { stake(x, 50, .9); stake(x + 26, 41, .83); }
      else stake(x + 1, 49, 1);
      ctx.restore();
    }
    function drawStoneLantern(item) {
      const x = item.x, y = world.ground;
      ctx.save();
      const lantern = (left, height, scale) => {
        ctx.lineWidth = 2.7;
        roundRect(left + 4 * scale, y - 8 * scale, 25 * scale, 8 * scale, 2, "#71645d", "#252b2e");
        roundRect(left + 11 * scale, y - height + 25 * scale, 10 * scale, height - 32 * scale, 2, "#b5a396", "#252b2e");
        roundRect(left + 5 * scale, y - height + 12 * scale, 23 * scale, 22 * scale, 3, "#e5c9a3", "#252b2e");
        roundRect(left + 10 * scale, y - height + 16 * scale, 12 * scale, 12 * scale, 2, "#ffe4a9", "#765044");
        ctx.fillStyle = "#796b64";
        ctx.beginPath(); ctx.moveTo(left, y - height + 13 * scale);
        ctx.lineTo(left + 16 * scale, y - height);
        ctx.lineTo(left + 32 * scale, y - height + 13 * scale); ctx.closePath();
        ctx.fill(); ctx.strokeStyle = "#252b2e"; ctx.stroke();
        ctx.strokeStyle = "#f5d7a4"; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(left + 5 * scale, y - height + 11 * scale);
        ctx.lineTo(left + 16 * scale, y - height + 2 * scale);
        ctx.lineTo(left + 27 * scale, y - height + 11 * scale); ctx.stroke();
      };
      if (item.kind === "double") { lantern(x, 55, .9); lantern(x + 27, 42, .8); }
      else lantern(x, 54, 1);
      ctx.restore();
    }
    function drawSwordStone(item) {
      const x = item.x, y = world.ground;
      ctx.save();
      const stone = (left, width, height) => {
        ctx.fillStyle = "#aebcb0";
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + 3, y - height * .62);
        ctx.lineTo(left + width * .5, y - height * .75);
        ctx.lineTo(left + width - 3, y - height * .57);
        ctx.lineTo(left + width, y); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#263737"; ctx.lineWidth = 3; ctx.stroke();
        ctx.strokeStyle = "#f2d9ab"; ctx.lineWidth = 2.7;
        ctx.beginPath(); ctx.moveTo(left + 5, y - height * .58);
        ctx.lineTo(left + width * .5, y - height * .7); ctx.stroke();
        ctx.strokeStyle = "#f1efd1"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(left + width * .5, y - height * .64);
        ctx.lineTo(left + width * .5, y - height); ctx.stroke();
        ctx.strokeStyle = "#263737"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(left + 6, y - height * .64);
        ctx.lineTo(left + width - 6, y - height * .64); ctx.stroke();
        ctx.strokeStyle = "#f0d5a1"; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(left + 6, y - height * .64);
        ctx.lineTo(left + width - 6, y - height * .64); ctx.stroke();
      };
      if (item.kind === "double") { stone(x, 28, 57); stone(x + 26, 28, 45); }
      else stone(x, 31, 56);
      ctx.restore();
    }
    function drawSnowBarricade(item) {
      const x = item.x, y = world.ground;
      ctx.save();
      const barricade = (left, width, height) => {
        ctx.lineWidth = 2.8;
        roundRect(left + 2, y - height + 7, width - 4, height - 7, 3, "#a17a62", "#253238");
        ctx.strokeStyle = "#493d3a"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(left + 6, y - height + 14);
        ctx.lineTo(left + width - 6, y - 9);
        ctx.moveTo(left + width - 6, y - height + 14);
        ctx.lineTo(left + 6, y - 9); ctx.stroke();
        ctx.strokeStyle = "#f2d3a1"; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(left + 6, y - height + 14);
        ctx.lineTo(left + width - 6, y - 9); ctx.stroke();
        ctx.lineWidth = 2.8;
        roundRect(left, y - height, width, 10, 5, "#f0f5eb", "#253238");
      };
      if (item.kind === "double") { barricade(x, 27, 56); barricade(x + 26, 28, 44); }
      else barricade(x, 31, 56);
      ctx.restore();
    }
    function drawAirHazard(item) {
      const scene = item.scene ?? 0;
      const x = item.x, y = world.ground - 67;
      ctx.save(); ctx.translate(x, y);
      ctx.shadowColor = "rgba(9, 23, 25, .48)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      if (scene === 0) {
        ctx.strokeStyle = "#203d3d"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(5, 20); ctx.lineTo(45, 11); ctx.stroke();
        ctx.strokeStyle = "#e4f3ce"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(5, 20); ctx.lineTo(45, 11); ctx.stroke();
        for (const [lx, ly] of [[10, 16], [26, 12], [37, 9]]) {
          ctx.fillStyle = "#b9e6c9";
          ctx.beginPath(); ctx.moveTo(lx, ly);
          ctx.quadraticCurveTo(lx + 10, ly - 13, lx + 13, ly - 4);
          ctx.quadraticCurveTo(lx + 11, ly + 4, lx, ly); ctx.closePath();
          ctx.fill(); ctx.strokeStyle = "#203d3d"; ctx.lineWidth = 2.6; ctx.stroke();
          ctx.strokeStyle = "#e7f7df"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(lx + 3, ly - 2);
          ctx.quadraticCurveTo(lx + 9, ly - 10, lx + 11, ly - 5); ctx.stroke();
        }
      } else if (scene === 1) {
        ctx.fillStyle = "#d9e8d3";
        ctx.beginPath(); ctx.moveTo(26, 2); ctx.lineTo(45, 16);
        ctx.lineTo(26, 29); ctx.lineTo(7, 16); ctx.closePath();
        ctx.fill(); ctx.strokeStyle = "#233a3b"; ctx.lineWidth = 3.2; ctx.stroke();
        ctx.fillStyle = "#91c8b4";
        ctx.beginPath(); ctx.moveTo(26, 2); ctx.lineTo(45, 16);
        ctx.lineTo(26, 16); ctx.fill();
        ctx.strokeStyle = "#f2f8e6"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(26, 4); ctx.lineTo(42, 16);
        ctx.lineTo(26, 27); ctx.lineTo(10, 16); ctx.closePath(); ctx.stroke();
        ctx.strokeStyle = "#375e58"; ctx.lineWidth = 2.3;
        ctx.beginPath(); ctx.moveTo(26, 4); ctx.lineTo(26, 29);
        ctx.moveTo(8, 16); ctx.lineTo(44, 16); ctx.stroke();
        ctx.strokeStyle = "#e2f3d4"; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(26, 28); ctx.quadraticCurveTo(34, 35, 42, 31); ctx.stroke();
      } else if (scene === 2) {
        ctx.fillStyle = "rgba(224, 244, 222, .65)";
        ctx.beginPath(); ctx.ellipse(25, 17, 25, 15, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.strokeStyle = "#294545"; ctx.lineWidth = 2.8; ctx.stroke();
        ctx.lineCap = "round";
        ctx.strokeStyle = "#20383b"; ctx.lineWidth = 11;
        ctx.beginPath(); ctx.moveTo(5, 25); ctx.quadraticCurveTo(23, 2, 47, 8); ctx.stroke();
        ctx.strokeStyle = "#b9e9d1"; ctx.lineWidth = 6.5;
        ctx.beginPath(); ctx.moveTo(5, 25); ctx.quadraticCurveTo(23, 2, 47, 8); ctx.stroke();
        ctx.strokeStyle = "#f3f9e9"; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(7, 22); ctx.quadraticCurveTo(24, 6, 42, 8); ctx.stroke();
      } else {
        const flap = reducedMotion.matches ? 0 : Math.sin(elapsed * 15 + x * .02) * 3;
        ctx.fillStyle = "#d9f1df";
        ctx.beginPath(); ctx.ellipse(26, 19, 17, 13, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.strokeStyle = "#233b41"; ctx.lineWidth = 2.8; ctx.stroke();
        ctx.fillStyle = "#a5d4c3";
        ctx.beginPath(); ctx.moveTo(19, 15); ctx.quadraticCurveTo(8, 1 + flap, 3, 11);
        ctx.lineTo(11, 27); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(34, 15); ctx.quadraticCurveTo(43, 1 - flap, 49, 10);
        ctx.lineTo(42, 27); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#eef9e7"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(4, 11); ctx.quadraticCurveTo(9, 6 + flap, 16, 15);
        ctx.moveTo(37, 15); ctx.quadraticCurveTo(44, 5 - flap, 48, 10); ctx.stroke();
        ctx.fillStyle = "#324b56";
        ctx.beginPath(); ctx.arc(32, 16, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#e6ddb0";
        ctx.beginPath(); ctx.moveTo(40, 18); ctx.lineTo(49, 21);
        ctx.lineTo(40, 24); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#233b41"; ctx.lineWidth = 1.8; ctx.stroke();
      }
      ctx.restore();
    }
    function drawObstacle(item) {
      if (item.kind === "bird") { drawAirHazard(item); return; }
      ctx.save();
      ctx.fillStyle = "rgba(11, 27, 29, .28)";
      ctx.beginPath();
      ctx.ellipse(item.x + item.width / 2, world.ground + 2, item.width * .47, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      switch (item.scene ?? 0) {
        case 1: drawStoneLantern(item); break;
        case 2: drawSwordStone(item); break;
        case 3: drawSnowBarricade(item); break;
        default: drawBambooStake(item);
      }
    }
    function drawIncomingWarning(item) {
      if (item.x <= world.width) return;
      const airborne = item.kind === "bird";
      const y = world.ground - (airborne ? 99 : 79);
      ctx.save();
      roundRect(world.width - 37, y, 31, 30, 10, "rgba(18, 43, 42, .88)", airborne ? "#c9e3d7" : "#eed4a8");
      ctx.fillStyle = airborne ? "#e9f3e8" : "#fff0d4";
      ctx.font = "bold 19px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(airborne ? "↓" : "↑", world.width - 21, y + 15);
      ctx.restore();
    }
    function drawGodzillaPlate(points) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (const [x, y] of points.slice(1)) ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fillStyle = "#d4d7d2";
      ctx.strokeStyle = "#344044";
      ctx.lineWidth = 1.7;
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#f0f0e9";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(points[0][0] + 1, points[0][1] - 2);
      ctx.lineTo(points[1][0], points[1][1] + 3);
      ctx.stroke();
    }
    function godzillaTailSway() {
      return player.jump === 0 && player.velocity === 0 && !player.duck && !reducedMotion.matches
        ? Math.sin(elapsed * 6) * 3 : 0;
    }
    function drawGodzillaLeg(left, lift, rear, tucked) {
      const footY = tucked ? -3 : 0;
      ctx.save();
      ctx.translate(0, -lift);
      ctx.fillStyle = rear ? "#1a2225" : "#273034";
      ctx.strokeStyle = rear ? "#697773" : "#91a09a";
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(left + 3, -25);
      ctx.quadraticCurveTo(left + 14, -29, left + 17, -18);
      ctx.lineTo(left + 14, -12);
      ctx.quadraticCurveTo(left + 9, -10, left + 12, -7);
      ctx.lineTo(left + 21, footY - 4);
      ctx.quadraticCurveTo(left + 24, footY - 3, left + 24, footY);
      ctx.lineTo(left + 7, footY);
      ctx.quadraticCurveTo(left + 3, footY - 2, left + 3, footY - 5);
      ctx.lineTo(left + 1, -13);
      ctx.quadraticCurveTo(left - 2, -21, left + 3, -25);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rear ? "#303a3d" : "#485255";
      ctx.beginPath();
      ctx.moveTo(left + 3, -21);
      ctx.quadraticCurveTo(left + 11, -25, left + 14, -17);
      ctx.lineTo(left + 9, -13);
      ctx.lineTo(left + 3, -16);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#d7dad2";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(left + 15, footY - 1); ctx.lineTo(left + 18, footY);
      ctx.moveTo(left + 20, footY - 1); ctx.lineTo(left + 23, footY);
      ctx.stroke();
      ctx.restore();
    }
    function drawGodzillaCrouchLeg(left, rear) {
      ctx.fillStyle = rear ? "#1a2225" : "#273034";
      ctx.strokeStyle = rear ? "#697773" : "#91a09a";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(left + 2, -15);
      ctx.quadraticCurveTo(left + 12, -18, left + 16, -11);
      ctx.lineTo(left + 11, -7);
      ctx.lineTo(left + 21, -4);
      ctx.lineTo(left + 23, 0);
      ctx.lineTo(left + 5, 0);
      ctx.lineTo(left + 4, -4);
      ctx.lineTo(left - 1, -7);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#d7dad2";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(left + 15, -1); ctx.lineTo(left + 18, 0);
      ctx.moveTo(left + 20, -1); ctx.lineTo(left + 22, 0);
      ctx.stroke();
    }
    function drawGodzilla() {
      ctx.save();
      ctx.lineJoin = "round";
      const body = ctx.createLinearGradient(4, -66, 57, -7);
      body.addColorStop(0, "#596164");
      body.addColorStop(.44, "#333b3e");
      body.addColorStop(1, "#171c20");
      if (player.duck) {
        // 蹲姿保留背鰭輪廓，同時讓頭部與身體貼近跑道。
        ctx.fillStyle = "#20272a";
        ctx.strokeStyle = "#889591";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(12, -24);
        ctx.bezierCurveTo(-2, -24, -10, -18, -25, -9);
        ctx.quadraticCurveTo(-16, -8, -7, -12);
        ctx.quadraticCurveTo(2, -10, 14, -11);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        for (const plate of [
          [[-14, -20], [-14, -29], [-8, -23]],
          [[-6, -25], [-3, -36], [3, -27]],
          [[3, -29], [8, -42], [15, -30]],
          [[14, -31], [22, -44], [27, -31]],
          [[27, -31], [33, -40], [37, -29]]
        ]) drawGodzillaPlate(plate);
        drawGodzillaCrouchLeg(8, true);
        ctx.fillStyle = body;
        ctx.strokeStyle = "#9aa6a1";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(4, -20);
        ctx.bezierCurveTo(8, -32, 23, -35, 38, -29);
        ctx.quadraticCurveTo(51, -27, 55, -19);
        ctx.lineTo(50, -12);
        ctx.quadraticCurveTo(44, -5, 34, -6);
        ctx.lineTo(18, -6);
        ctx.quadraticCurveTo(6, -8, 4, -20);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#4a5557";
        ctx.beginPath();
        ctx.moveTo(18, -26);
        ctx.quadraticCurveTo(28, -29, 37, -24);
        ctx.lineTo(41, -18);
        ctx.quadraticCurveTo(38, -11, 32, -8);
        ctx.lineTo(24, -10);
        ctx.quadraticCurveTo(20, -16, 18, -26);
        ctx.closePath(); ctx.fill();
        drawGodzillaCrouchLeg(32, false);
        ctx.fillStyle = "#30393c";
        ctx.strokeStyle = "#a8b2ac";
        ctx.beginPath();
        ctx.moveTo(43, -27);
        ctx.quadraticCurveTo(47, -35, 55, -33);
        ctx.lineTo(61, -30);
        ctx.lineTo(64, -25);
        ctx.lineTo(62, -22);
        ctx.lineTo(66, -20);
        ctx.lineTo(64, -17);
        ctx.lineTo(55, -17);
        ctx.quadraticCurveTo(48, -19, 44, -17);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#c0c9bf"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(54, -22); ctx.lineTo(63, -22); ctx.stroke();
        ctx.fillStyle = "#edcf94";
        ctx.beginPath(); ctx.arc(54, -28, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#232b2e";
        ctx.strokeStyle = "#8c9a95";
        ctx.beginPath();
        ctx.moveTo(42, -17); ctx.quadraticCurveTo(48, -18, 49, -12);
        ctx.lineTo(46, -9); ctx.lineTo(51, -7); ctx.lineTo(47, -5);
        ctx.lineTo(40, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#d6d9d1"; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(47, -5); ctx.lineTo(50, -3); ctx.stroke();
      } else {
        // 尾根固定，尾端以較慢的節奏擺動；空中與減少動態效果時回到中立姿勢。
        const tailSway = godzillaTailSway();
        ctx.fillStyle = "#20272a";
        ctx.strokeStyle = "#8b9893";
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(14, -40);
        ctx.bezierCurveTo(2, -36, -7, -33 + tailSway * .3, -15, -26 + tailSway * .7);
        ctx.bezierCurveTo(-21, -20 + tailSway * .85, -27, -17 + tailSway, -32, -16 + tailSway);
        ctx.bezierCurveTo(-23, -13 + tailSway, -17, -16 + tailSway * .8, -7, -22 + tailSway * .4);
        ctx.lineTo(18, -21);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        for (const plate of [
          [[-18, -27 + tailSway * .75], [-18, -38 + tailSway * .75], [-9, -29 + tailSway * .5]],
          [[-7, -35 + tailSway * .4], [-4, -50 + tailSway * .3], [5, -39]],
          [[3, -42], [10, -62], [19, -47]],
          [[13, -49], [22, -74], [31, -52]],
          [[26, -53], [35, -78], [43, -51]],
          [[38, -53], [46, -69], [49, -48]]
        ]) drawGodzillaPlate(plate);
        const tucked = player.jump > 0 || player.velocity !== 0;
        const step = tucked || reducedMotion.matches ? 0 : Math.sin(elapsed * 18) * 2;
        drawGodzillaLeg(30, Math.max(0, -step), true, tucked);
        ctx.fillStyle = body;
        ctx.strokeStyle = "#98a5a0";
        ctx.lineWidth = 1.9;
        ctx.beginPath();
        ctx.moveTo(9, -39);
        ctx.bezierCurveTo(11, -53, 23, -63, 38, -61);
        ctx.bezierCurveTo(48, -59, 52, -47, 54, -36);
        ctx.lineTo(51, -25);
        ctx.quadraticCurveTo(49, -15, 42, -11);
        ctx.lineTo(27, -12);
        ctx.quadraticCurveTo(17, -16, 12, -24);
        ctx.quadraticCurveTo(7, -31, 9, -39);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#4d585a";
        ctx.beginPath();
        ctx.moveTo(30, -43);
        ctx.quadraticCurveTo(39, -42, 44, -36);
        ctx.lineTo(43, -25);
        ctx.quadraticCurveTo(40, -18, 35, -13);
        ctx.lineTo(26, -17);
        ctx.quadraticCurveTo(22, -23, 23, -30);
        ctx.quadraticCurveTo(25, -39, 30, -43);
        ctx.closePath(); ctx.fill();
        drawGodzillaLeg(10, Math.max(0, step), false, tucked);
        ctx.fillStyle = "#343d40";
        ctx.strokeStyle = "#a3afaa";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(40, -60);
        ctx.quadraticCurveTo(47, -68, 55, -66);
        ctx.quadraticCurveTo(62, -65, 63, -59);
        ctx.lineTo(66, -54);
        ctx.lineTo(64, -51);
        ctx.lineTo(67, -49);
        ctx.lineTo(65, -46);
        ctx.lineTo(55, -46);
        ctx.quadraticCurveTo(50, -44, 46, -47);
        ctx.lineTo(40, -51);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#242d30";
        ctx.beginPath(); ctx.moveTo(51, -46); ctx.quadraticCurveTo(59, -44, 65, -46);
        ctx.lineTo(60, -42); ctx.lineTo(52, -43); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#c1c9c0"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(53, -48); ctx.lineTo(64, -48); ctx.stroke();
        ctx.strokeStyle = "#aebbb2"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(48, -60);
        ctx.quadraticCurveTo(56, -64, 61, -60); ctx.stroke();
        ctx.fillStyle = "#edcf94";
        ctx.beginPath(); ctx.arc(55, -56, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#20282b";
        ctx.strokeStyle = "#899691";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(43, -41); ctx.quadraticCurveTo(50, -43, 51, -36);
        ctx.lineTo(47, -31); ctx.lineTo(52, -28); ctx.lineTo(49, -25);
        ctx.lineTo(42, -29); ctx.lineTo(39, -37);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#d9dcd4"; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(49, -25); ctx.lineTo(52, -22); ctx.stroke();
        ctx.strokeStyle = "rgba(168, 180, 174, .55)"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(15, -35); ctx.lineTo(19, -39);
        ctx.moveTo(18, -27); ctx.lineTo(22, -31);
        ctx.moveTo(35, -39); ctx.lineTo(38, -42); ctx.stroke();
      }
      ctx.restore();
    }
    function drawHeroLeg(left, lift, rear, tucked, skin) {
      const footY = tucked ? -3 : 0;
      ctx.save(); ctx.translate(0, -lift);
      ctx.fillStyle = rear ? skin.tail : skin.legs;
      ctx.strokeStyle = "rgba(31, 63, 74, .7)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(left + 3, -20);
      ctx.quadraticCurveTo(left + 13, -23, left + 15, -14);
      ctx.lineTo(left + 12, -9);
      ctx.lineTo(left + 14, footY - 5);
      ctx.lineTo(left + 21, footY - 3);
      ctx.lineTo(left + 22, footY);
      ctx.lineTo(left + 6, footY);
      ctx.lineTo(left + 3, -7);
      ctx.quadraticCurveTo(left - 1, -16, left + 3, -20);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = skin.trim; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(left + 17, footY - 1);
      ctx.lineTo(left + 20, footY); ctx.stroke();
      ctx.restore();
    }
    function drawHeroCrouchLeg(left, rear, skin) {
      ctx.fillStyle = rear ? skin.tail : skin.legs;
      ctx.strokeStyle = "rgba(31, 63, 74, .7)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(left + 2, -14);
      ctx.quadraticCurveTo(left + 12, -16, left + 16, -9);
      ctx.lineTo(left + 11, -6);
      ctx.lineTo(left + 21, -3);
      ctx.lineTo(left + 22, 0);
      ctx.lineTo(left + 5, 0);
      ctx.lineTo(left + 3, -4);
      ctx.lineTo(left - 1, -7);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = skin.trim; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(left + 17, -1);
      ctx.lineTo(left + 20, 0); ctx.stroke();
    }
    function drawHeroSpines(skin, duck) {
      ctx.save();
      if (duck) ctx.scale(1, .58);
      if (skin.id === "prism") {
        for (const [x, y] of [[7, -44], [18, -50], [29, -54], [39, -54]]) {
          ctx.fillStyle = "#dcebb5";
          ctx.beginPath(); ctx.moveTo(x, y + 3);
          ctx.quadraticCurveTo(x - 4, y - 10, x + 6, y - 16);
          ctx.quadraticCurveTo(x + 9, y - 6, x + 5, y + 3);
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = "#65a37b"; ctx.lineWidth = 1.4; ctx.stroke();
        }
      } else if (skin.id === "cloud") {
        for (const [x, y] of [[7, -45], [18, -51], [30, -55], [40, -55]]) {
          ctx.fillStyle = "#eff8fc";
          ctx.beginPath(); ctx.moveTo(x, y + 3);
          ctx.quadraticCurveTo(x - 2, y - 13, x + 7, y - 17);
          ctx.quadraticCurveTo(x + 11, y - 5, x + 5, y + 3);
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = "#8fb9dd"; ctx.lineWidth = 1.3; ctx.stroke();
        }
      } else if (skin.id === "shield") {
        for (const [x, y] of [[7, -46], [18, -52], [29, -56], [40, -54]]) {
          ctx.fillStyle = "#d7baf0";
          ctx.beginPath(); ctx.moveTo(x, y + 4);
          ctx.lineTo(x + 1, y - 9); ctx.lineTo(x + 6, y - 15);
          ctx.lineTo(x + 11, y - 8); ctx.lineTo(x + 9, y + 4);
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = "#ffe4aa"; ctx.lineWidth = 2; ctx.stroke();
        }
      } else {
        for (const [i, x, y] of [[0, 7, -46], [1, 18, -52], [2, 29, -56], [3, 40, -54]]) {
          ctx.fillStyle = skin.spikes[i];
          ctx.beginPath(); ctx.moveTo(x, y + 3);
          ctx.quadraticCurveTo(x - 3, y - 12, x + 8, y - 18);
          ctx.quadraticCurveTo(x + 10, y - 5, x + 7, y + 3);
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = "#d9f8ec"; ctx.lineWidth = 1.6; ctx.stroke();
        }
      }
      ctx.restore();
    }
    function drawHeroOutfit(skin, duck) {
      ctx.save();
      if (duck) ctx.scale(1, .56);
      if (skin.id === "prism") {
        ctx.fillStyle = "#e8d49a";
        ctx.beginPath(); ctx.moveTo(40, -52);
        ctx.quadraticCurveTo(25, -55, 11, -51);
        ctx.lineTo(23, -48); ctx.lineTo(12, -45);
        ctx.quadraticCurveTo(30, -46, 42, -48);
        ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(12, -49);
        ctx.lineTo(0, -56); ctx.lineTo(5, -46); ctx.closePath(); ctx.fill();
      } else if (skin.id === "cloud") {
        ctx.fillStyle = "#eaf5fb";
        ctx.beginPath(); ctx.moveTo(19, -44);
        ctx.quadraticCurveTo(30, -48, 40, -42);
        ctx.lineTo(35, -26); ctx.lineTo(11, -29);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#8cb9df"; ctx.lineWidth = 1.5; ctx.stroke();
      } else if (skin.id === "shield") {
        ctx.fillStyle = "#8169ae";
        ctx.beginPath(); ctx.moveTo(35, -44);
        ctx.lineTo(45, -41); ctx.lineTo(47, -32);
        ctx.lineTo(39, -27); ctx.lineTo(31, -34);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#ffe3a1"; ctx.lineWidth = 2; ctx.stroke();
      } else {
        const cape = ctx.createLinearGradient(11, -44, 37, -20);
        cape.addColorStop(0, "#a0eeda");
        cape.addColorStop(.55, "#81c8dc");
        cape.addColorStop(1, "#918cce");
        ctx.fillStyle = cape;
        ctx.beginPath(); ctx.moveTo(18, -45);
        ctx.quadraticCurveTo(30, -49, 40, -41);
        ctx.lineTo(35, -22); ctx.lineTo(11, -29);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#d8f7e7"; ctx.lineWidth = 1.6; ctx.stroke();
      }
      ctx.restore();
    }
    function drawHeroBadge(skin, duck) {
      if (skin.id !== "shield") return;
      ctx.save();
      if (duck) ctx.scale(1, .56);
      ctx.fillStyle = "#fff0bc";
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = -Math.PI / 2 + i * Math.PI / 5;
        const radius = i % 2 ? 3.5 : 7;
        const x = 24 + Math.cos(angle) * radius;
        const y = -31 + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    function drawHeroHeadwear(skin, duck) {
      ctx.save();
      if (duck) ctx.scale(1, .52);
      if (skin.id === "prism") {
        ctx.strokeStyle = "#f1da9e"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(42, -61); ctx.lineTo(61, -60); ctx.stroke();
        ctx.fillStyle = "#e7d392";
        ctx.beginPath(); ctx.moveTo(43, -61); ctx.lineTo(28, -65);
        ctx.lineTo(35, -59); ctx.closePath(); ctx.fill();
      } else if (skin.id === "cloud") {
        ctx.fillStyle = "#f7fbfc";
        ctx.beginPath(); ctx.moveTo(40, -64);
        ctx.quadraticCurveTo(39, -76, 48, -75);
        ctx.quadraticCurveTo(52, -69, 47, -63);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#8fb9df"; ctx.lineWidth = 1.3; ctx.stroke();
      } else if (skin.id === "shield") {
        ctx.strokeStyle = "#ffe3a1"; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(43, -63); ctx.lineTo(62, -61); ctx.stroke();
        ctx.fillStyle = "#fff1ba";
        ctx.beginPath(); ctx.moveTo(48, -64); ctx.lineTo(52, -70);
        ctx.lineTo(56, -63); ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = "#d8b6ed";
        ctx.beginPath(); ctx.moveTo(43, -65);
        ctx.quadraticCurveTo(47, -75, 56, -76);
        ctx.quadraticCurveTo(53, -67, 48, -62);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#c6f7e8"; ctx.lineWidth = 1.4; ctx.stroke();
      }
      ctx.restore();
    }
    function heroTailSway() {
      if (state === "paused") return pausedHeroTailSway;
      return player.jump === 0 && player.velocity === 0 && !player.duck && !reducedMotion.matches
        ? Math.sin(elapsed * 6) * 3 : 0;
    }
    function drawHeroTailAccent(skin, duck, sway = 0) {
      ctx.save();
      if (duck) ctx.scale(1, .58);
      if (skin.id === "cloud") {
        ctx.fillStyle = "#f2f9fb";
        ctx.beginPath(); ctx.moveTo(-14, -27 + sway);
        ctx.quadraticCurveTo(-22, -37 + sway, -21, -22 + sway);
        ctx.lineTo(-14, -23 + sway); ctx.closePath(); ctx.fill();
      } else if (skin.id === "shield") {
        ctx.strokeStyle = skin.trim; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(-11, -31 + sway * .8); ctx.lineTo(-8, -24 + sway * .7);
        ctx.moveTo(-2, -34 + sway * .4); ctx.lineTo(1, -27 + sway * .3); ctx.stroke();
      } else if (skin.id === "aurora") {
        ctx.strokeStyle = "#d8f6ec"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-15, -25 + sway);
        ctx.quadraticCurveTo(-4, -34 + sway * .5, 8, -32); ctx.stroke();
      }
      ctx.restore();
    }
    function drawHeroDino(skin) {
      ctx.save(); ctx.lineJoin = "round";
      const body = ctx.createLinearGradient(5, -61, 54, -7);
      body.addColorStop(0, skin.bodyA);
      body.addColorStop(1, skin.bodyB);
      if (player.duck) {
        ctx.fillStyle = skin.tail;
        ctx.beginPath(); ctx.moveTo(10, -22);
        ctx.quadraticCurveTo(-2, -24, -14, -17);
        ctx.quadraticCurveTo(-7, -11, 11, -11);
        ctx.closePath(); ctx.fill();
        drawHeroTailAccent(skin, true);
        drawHeroSpines(skin, true);
        drawHeroCrouchLeg(8, true, skin);
        ctx.fillStyle = body;
        ctx.strokeStyle = skin.tail; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(5, -19);
        ctx.quadraticCurveTo(8, -32, 26, -32);
        ctx.quadraticCurveTo(47, -33, 54, -20);
        ctx.lineTo(52, -11);
        ctx.quadraticCurveTo(46, -5, 32, -5);
        ctx.lineTo(17, -5);
        ctx.quadraticCurveTo(3, -7, 5, -19);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        drawHeroOutfit(skin, true);
        ctx.fillStyle = skin.belly;
        ctx.beginPath(); ctx.moveTo(23, -26);
        ctx.quadraticCurveTo(33, -28, 40, -21);
        ctx.lineTo(39, -13); ctx.lineTo(32, -8);
        ctx.lineTo(25, -10); ctx.quadraticCurveTo(21, -16, 23, -26);
        ctx.closePath(); ctx.fill();
        drawHeroCrouchLeg(32, false, skin);
        drawHeroBadge(skin, true);
        ctx.fillStyle = body;
        ctx.beginPath(); ctx.moveTo(42, -27);
        ctx.quadraticCurveTo(48, -35, 56, -32);
        ctx.lineTo(62, -29); ctx.lineTo(64, -23);
        ctx.lineTo(62, -20); ctx.lineTo(66, -17);
        ctx.lineTo(64, -14); ctx.lineTo(54, -14);
        ctx.quadraticCurveTo(48, -15, 43, -17);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = skin.bodyB;
        ctx.beginPath(); ctx.moveTo(43, -16);
        ctx.quadraticCurveTo(49, -19, 51, -12);
        ctx.lineTo(47, -9); ctx.lineTo(51, -7);
        ctx.lineTo(47, -5); ctx.lineTo(41, -10);
        ctx.closePath(); ctx.fill();
        drawHeroHeadwear(skin, true);
        ctx.fillStyle = "#1d3150";
        ctx.beginPath(); ctx.arc(54, -25, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = skin.legs; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(54, -19); ctx.lineTo(63, -19); ctx.stroke();
      } else {
        const tucked = player.jump > 0 || player.velocity !== 0;
        const step = tucked || reducedMotion.matches ? 0 : Math.sin(elapsed * 22) * 3;
        const tailSway = heroTailSway();
        ctx.fillStyle = skin.tail;
        ctx.beginPath(); ctx.moveTo(11, -38);
        ctx.quadraticCurveTo(-2, -39 + tailSway * .3, -19, -23 + tailSway);
        ctx.quadraticCurveTo(-11, -22 + tailSway * .7, 2, -20 + tailSway * .15);
        ctx.lineTo(17, -25); ctx.closePath(); ctx.fill();
        drawHeroTailAccent(skin, false, tailSway);
        drawHeroSpines(skin, false);
        drawHeroLeg(30, Math.max(0, -step), true, tucked, skin);
        ctx.fillStyle = body;
        ctx.strokeStyle = skin.tail; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(9, -43);
        ctx.quadraticCurveTo(15, -57, 34, -56);
        ctx.quadraticCurveTo(47, -54, 51, -39);
        ctx.lineTo(50, -24);
        ctx.quadraticCurveTo(47, -13, 36, -10);
        ctx.lineTo(23, -11);
        ctx.quadraticCurveTo(8, -17, 7, -30);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        drawHeroOutfit(skin, false);
        ctx.fillStyle = skin.belly;
        ctx.beginPath(); ctx.moveTo(28, -43);
        ctx.quadraticCurveTo(39, -42, 42, -31);
        ctx.lineTo(40, -23); ctx.lineTo(34, -14);
        ctx.lineTo(26, -17); ctx.quadraticCurveTo(22, -26, 23, -33);
        ctx.closePath(); ctx.fill();
        drawHeroLeg(10, Math.max(0, step), false, tucked, skin);
        drawHeroBadge(skin, false);
        ctx.fillStyle = body;
        ctx.beginPath(); ctx.moveTo(39, -60);
        ctx.quadraticCurveTo(46, -68, 55, -66);
        ctx.quadraticCurveTo(63, -65, 64, -57);
        ctx.lineTo(63, -52); ctx.lineTo(68, -46);
        ctx.lineTo(65, -42); ctx.lineTo(53, -42);
        ctx.quadraticCurveTo(47, -44, 40, -49);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = skin.bodyB;
        ctx.beginPath(); ctx.moveTo(43, -39);
        ctx.quadraticCurveTo(51, -41, 52, -33);
        ctx.lineTo(48, -28); ctx.lineTo(53, -26);
        ctx.lineTo(49, -23); ctx.lineTo(41, -28);
        ctx.closePath(); ctx.fill();
        drawHeroHeadwear(skin, false);
        ctx.fillStyle = "#1d3150";
        ctx.beginPath(); ctx.arc(54, -55, 2.7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.8)";
        ctx.beginPath(); ctx.arc(54.8, -55.8, .8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = skin.legs; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(54, -46); ctx.lineTo(65, -46); ctx.stroke();
      }
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
      if (activeSkinId === "godzilla") {
        drawGodzilla();
        ctx.restore();
        return;
      }
      drawHeroDino(skin);
      ctx.restore();
    }
    function drawBeam() {
      if (beamRemaining <= 0 || activeSkinId !== "godzilla") return;
      const startX = player.x + 61;
      const beamY = world.ground - player.jump - (player.duck ? 24 : 48);
      const length = Math.max(0, world.width - startX);
      ctx.save();
      if (reducedMotion.matches) {
        roundRect(startX, beamY - 3, length, 6, 3, "#e6f5d5");
      } else {
        const strength = Math.min(1, beamRemaining / .12);
        ctx.globalAlpha = strength;
        const glow = ctx.createLinearGradient(startX, beamY, world.width, beamY);
        glow.addColorStop(0, "rgba(221, 250, 201, .94)");
        glow.addColorStop(1, "rgba(162, 231, 190, .13)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.moveTo(startX, beamY - 10);
        ctx.lineTo(world.width, beamY - 16);
        ctx.lineTo(world.width, beamY + 16);
        ctx.lineTo(startX, beamY + 10); ctx.fill();
        roundRect(startX, beamY - 3, length, 6, 3, "rgba(248, 255, 225, .88)");
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
      drawBeam();
    }
    function frame(timestamp) {
      const dt = lastTime ? Math.min((timestamp - lastTime) / 1000, .033) : 0;
      lastTime = timestamp;
      if (state === "running") update(dt);
      if (state === "running") updateMusic();
      render();
      requestAnimationFrame(frame);
    }
    function action() {
      if (state === "ready") startGame();
      else if (state === "paused") resumeGame();
      else if (state === "running") jump();
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
    mainButton.addEventListener("click", () => state === "over" ? startGame() : action());
    normalModeButton.addEventListener("click", () => chooseMode("normal"));
    hardModeButton.addEventListener("click", () => chooseMode("hard"));
    canvas.addEventListener("pointerdown", event => { if (event.pointerType !== "mouse" || event.button === 0) action(); });
    pauseButton.addEventListener("click", () => state === "running" ? pauseGame() : resumeGame());
    musicButton.addEventListener("click", () => {
      musicEnabled = !musicEnabled;
      writeStore("rainbowDino.musicEnabled.v1", musicEnabled ? "1" : "0");
      if (musicEnabled) startMusic(); else stopMusic();
      updateAudioButtons();
      if (state === "running") canvas.focus({ preventScroll: true });
    });
    soundButton.addEventListener("click", () => {
      sfxEnabled = !sfxEnabled;
      if (!sfxEnabled) {
        milestoneSound.pause(); hitSound.pause();
        for (const voice of actionVoices) voice.pause();
        actionVoices.clear();
      }
      writeStore("rainbowDino.sfxEnabled.v1", sfxEnabled ? "1" : "0"); updateAudioButtons();
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
    saveProgress(); updateAudioButtons(); updateModeButtons(); resize(); setOverlay("ready"); renderCollection(); requestAnimationFrame(frame);
  })();
