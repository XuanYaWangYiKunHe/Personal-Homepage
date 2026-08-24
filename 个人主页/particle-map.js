(() => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d", { alpha: true });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stageNames = [
    { zh: "复旦大学校徽", en: "FUDAN UNIVERSITY SEAL", coordinate: "OFFICIAL MARK · EST. 1905" },
    { zh: "复旦老校门", en: "HISTORIC FUDAN GATE", coordinate: "FUDAN WAYPOINT / 02" },
    { zh: "子彬院", en: "ZIBIN COURTYARD", coordinate: "FUDAN WAYPOINT / 03" },
    { zh: "复旦大学校徽", en: "FUDAN UNIVERSITY SEAL", coordinate: "OFFICIAL MARK · EST. 1905" },
    { zh: "复旦大学校徽", en: "FUDAN UNIVERSITY SEAL", coordinate: "OFFICIAL MARK · EST. 1905" },
  ];

  // 所有轮廓均从本地保存的真实源图逐像素生成；这里不包含任何手绘建筑或校徽路径。
  const sealSource = {
    src: "./assets/fudan-identity-guideline.png",
    mode: "mask",
    // 官方原稿画板左上角的蓝色校徽，保留原始字体、篆书、环线与 1905 数字。
    crop: { x: 0, y: 0, width: 760, height: 760 },
  };
  const sources = [
    sealSource,
    {
      src: "./assets/fudan-old-gate.jpg",
      mode: "edge",
      threshold: 23,
      contrast: 11,
      crop: { x: 0, y: 0, width: 600, height: 410 },
    },
    {
      src: "./assets/fudan-zibin.jpg",
      mode: "edge",
      threshold: 27,
      contrast: 14,
      crop: { x: 55, y: 105, width: 1170, height: 535 },
    },
    sealSource,
    sealSource,
  ];

  const SAMPLE_WIDTH = 960;
  const SAMPLE_HEIGHT = 640;
  let viewportWidth = 0;
  let viewportHeight = 0;
  let deviceScale = 1;
  let locale = "zh";
  let stageProgress = 0;
  let currentStage = -1;
  let sourceClouds = [];
  let detailTextures = [];
  let shapes = [];
  let particles = [];
  let assetsReady = false;
  const pointer = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    strength: 0,
    targetStrength: 0,
    initialized: false,
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Unable to load particle source: ${src}`));
      image.src = src;
    });
  }

  function drawContainedImage(drawContext, image, spec) {
    const crop = spec.crop || { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
    const availableWidth = spec.mode === "mask" ? 610 : 920;
    const availableHeight = spec.mode === "mask" ? 610 : 590;
    const scale = Math.min(availableWidth / crop.width, availableHeight / crop.height);
    const drawWidth = crop.width * scale;
    const drawHeight = crop.height * scale;
    const drawX = (SAMPLE_WIDTH - drawWidth) / 2;
    const drawY = (SAMPLE_HEIGHT - drawHeight) / 2;
    drawContext.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
    );
    return { x: drawX, y: drawY, width: drawWidth, height: drawHeight };
  }

  function pointHash(x, y) {
    let value = Math.imul(x + 31, 0x45d9f3b) ^ Math.imul(y + 17, 0x119de1f3);
    value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
    return (value ^ (value >>> 16)) >>> 0;
  }

  function sampleSource(image, spec) {
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = SAMPLE_WIDTH;
    sourceCanvas.height = SAMPLE_HEIGHT;
    const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
    sourceContext.fillStyle = "#ffffff";
    sourceContext.fillRect(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
    const imageBounds = drawContainedImage(sourceContext, image, spec);

    const pixels = sourceContext.getImageData(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT).data;
    const luminance = new Float32Array(SAMPLE_WIDTH * SAMPLE_HEIGHT);
    for (let index = 0; index < luminance.length; index += 1) {
      const offset = index * 4;
      luminance[index] = pixels[offset] * 0.2126 + pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722;
    }

    const points = [];
    const step = 2;
    for (let y = 3; y < SAMPLE_HEIGHT - 3; y += step) {
      for (let x = 3; x < SAMPLE_WIDTH - 3; x += step) {
        if (
          spec.mode === "edge" &&
          (x < imageBounds.x + 9 ||
            x > imageBounds.x + imageBounds.width - 9 ||
            y < imageBounds.y + 9 ||
            y > imageBounds.y + imageBounds.height - 9)
        ) continue;
        const index = y * SAMPLE_WIDTH + x;
        const offset = index * 4;
        let keep = false;
        let strength = 0;

        if (spec.mode === "mask") {
          const red = pixels[offset];
          const green = pixels[offset + 1];
          const blue = pixels[offset + 2];
          const saturation = Math.max(red, green, blue) - Math.min(red, green, blue);
          keep = luminance[index] < 238 && saturation > 26 && blue > red * 1.08;
          strength = keep ? 255 - luminance[index] : 0;
        } else {
          // Sobel 梯度 + 局部明暗差保留砖缝、瓦当、窗框、匾额和立面装饰等细节。
          const left = luminance[index - 1];
          const right = luminance[index + 1];
          const top = luminance[index - SAMPLE_WIDTH];
          const bottom = luminance[index + SAMPLE_WIDTH];
          const diagonalA = luminance[index - SAMPLE_WIDTH - 1] - luminance[index + SAMPLE_WIDTH + 1];
          const diagonalB = luminance[index - SAMPLE_WIDTH + 1] - luminance[index + SAMPLE_WIDTH - 1];
          const gradient = Math.hypot(right - left, bottom - top, diagonalA * 0.55, diagonalB * 0.55);
          const localContrast = Math.max(left, right, top, bottom) - Math.min(left, right, top, bottom);
          keep = gradient > spec.threshold || localContrast > spec.contrast * 2.2;
          strength = Math.max(gradient, localContrast * 1.35);
        }

        if (keep) {
          points.push({
            x: x / SAMPLE_WIDTH,
            y: y / SAMPLE_HEIGHT,
            strength: clamp(strength / 110, 0.35, 1),
            rank: pointHash(x, y),
          });
        }
      }
    }

    points.sort((a, b) => a.rank - b.rank);
    return points;
  }

  function normalizeCloud(cloud, count) {
    if (!cloud.length) return Array.from({ length: count }, () => ({ x: 0.5, y: 0.5, strength: 0.5 }));
    if (cloud.length >= count) {
      // 优先保留强轮廓，再在其中均匀抽样，避免树叶、草地等弱纹理稀释建筑主体。
      const candidateLimit = Math.min(cloud.length, Math.ceil(count * 1.9));
      const candidates = [...cloud]
        .sort((a, b) => b.strength - a.strength || a.rank - b.rank)
        .slice(0, candidateLimit)
        .sort((a, b) => a.rank - b.rank);
      const stride = candidates.length / count;
      return Array.from({ length: count }, (_, index) => candidates[Math.floor(index * stride)]);
    }
    return Array.from({ length: count }, (_, index) => cloud[index % cloud.length]);
  }

  function buildDetailTexture(cloud) {
    const texture = document.createElement("canvas");
    texture.width = SAMPLE_WIDTH;
    texture.height = SAMPLE_HEIGHT;
    const textureContext = texture.getContext("2d");
    textureContext.fillStyle = "rgba(159, 24, 54, 0.72)";
    cloud.forEach((point) => {
      if (point.strength < 0.58) return;
      const size = point.strength > 0.82 ? 1.35 : 1;
      textureContext.fillRect(point.x * SAMPLE_WIDTH, point.y * SAMPLE_HEIGHT, size, size);
    });
    return texture;
  }

  function buildParticleSet() {
    if (!sourceClouds.length) return;
    const count = viewportWidth < 700 ? 9000 : viewportWidth < 1100 ? 16000 : 26000;
    shapes = sourceClouds.map((cloud) => normalizeCloud(cloud, count));
    particles = Array.from({ length: count }, (_, index) => ({
      seed: ((index * 17) % 113) / 113 * Math.PI * 2,
      drift: 0.24 + ((index * 29) % 71) / 100,
      radius: 0.65 + ((index * 13) % 9) / 12,
    }));
  }

  function resize() {
    viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    viewportHeight = window.innerHeight;
    deviceScale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(viewportWidth * deviceScale);
    canvas.height = Math.round(viewportHeight * deviceScale);
    context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
    if (assetsReady) buildParticleSet();
  }

  function updateScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollRatio = clamp(window.scrollY / maxScroll, 0, 1);

    // 每个图形先稳定停留，再用较短的滚动区间完成粒子重组。
    // 这样阅读各页面时背景不会持续处于半变形状态，同时仍保留顺滑的形态切换。
    const transitions = [
      { start: 0.18, end: 0.25, from: 0, to: 1 },
      { start: 0.38, end: 0.45, from: 1, to: 2 },
      { start: 0.58, end: 0.65, from: 2, to: 3 },
      { start: 0.78, end: 0.85, from: 3, to: 4 },
    ];
    stageProgress = 0;
    for (const transition of transitions) {
      if (scrollRatio < transition.start) break;
      if (scrollRatio <= transition.end) {
        const transitionProgress = (scrollRatio - transition.start) / (transition.end - transition.start);
        stageProgress = transition.from + transitionProgress;
        break;
      }
      stageProgress = transition.to;
    }
    const nextStage = Math.min(stageNames.length - 1, Math.round(stageProgress));
    if (nextStage !== currentStage) {
      currentStage = nextStage;
      document.getElementById("particle-stage-index").textContent = String(currentStage + 1).padStart(2, "0");
      document.getElementById("particle-stage-name").textContent = stageNames[currentStage][locale];
      document.getElementById("particle-stage-coordinate").textContent = stageNames[currentStage].coordinate;
    }
  }

  function drawBackgroundGrid() {
    context.save();
    context.strokeStyle = "rgba(159, 24, 54, 0.022)";
    context.lineWidth = 1;
    const step = viewportWidth < 700 ? 52 : 70;
    context.beginPath();
    for (let x = -viewportHeight; x < viewportWidth + viewportHeight; x += step) {
      context.moveTo(x, 0);
      context.lineTo(x + viewportHeight, viewportHeight);
    }
    for (let x = 0; x < viewportWidth + viewportHeight; x += step) {
      context.moveTo(x, 0);
      context.lineTo(x - viewportHeight, viewportHeight);
    }
    context.stroke();
    context.restore();
  }

  function drawParticles(time) {
    if (!shapes.length || !particles.length) return;
    const fromIndex = Math.floor(stageProgress);
    const toIndex = Math.min(stageNames.length - 1, fromIndex + 1);
    const rawMix = stageProgress - fromIndex;
    const mix = rawMix * rawMix * (3 - 2 * rawMix);
    const scale = Math.min(viewportWidth * (viewportWidth < 700 ? 1.08 : 0.72), viewportHeight * 0.96) * 0.5;
    // 首尾校徽停在右侧，老校门与子彬院停在左侧；桌面端两侧位置关于页面中心对称。
    // 移动端缩小横向位移，避免主体被窄屏裁切，同时保留右—左—左—右的节奏。
    const centerRatios = viewportWidth < 700
      ? [0.55, 0.45, 0.45, 0.55, 0.55]
      : [0.71, 0.29, 0.29, 0.71, 0.71];
    const fromCenterX = viewportWidth * centerRatios[fromIndex];
    const toCenterX = viewportWidth * centerRatios[toIndex];
    const centerX = fromCenterX + (toCenterX - fromCenterX) * mix;
    const centerY = viewportHeight * 0.53;
    const fromShape = shapes[fromIndex];
    const toShape = shapes[toIndex];
    const emphasisByStage = [0.92, 1.2, 1.2, 0.92, 0.92];
    const opacityByStage = [0.44, 0.7, 0.7, 0.44, 0.44];
    const emphasis = emphasisByStage[fromIndex] + (emphasisByStage[toIndex] - emphasisByStage[fromIndex]) * mix;
    const opacity = opacityByStage[fromIndex] + (opacityByStage[toIndex] - opacityByStage[fromIndex]) * mix;

    // 建筑阶段叠加由全部强边缘粒子预渲染的高密度纹理，增强屋顶、门楣、柱廊和窗格的连续性。
    // 纹理仍完全由源照片采样点组成，不包含原始照片像素或手绘线条。
    const textureX = centerX - (scale * 1.46) / 2;
    const textureY = centerY - scale / 2;
    const drawDetail = (stageIndex, alpha) => {
      if (stageIndex < 1 || stageIndex > 2 || !detailTextures[stageIndex] || alpha <= 0) return;
      context.save();
      context.globalAlpha = alpha;
      context.drawImage(detailTextures[stageIndex], textureX, textureY, scale * 1.46, scale);
      context.restore();
    };
    drawDetail(fromIndex, (1 - mix) * 0.36);
    drawDetail(toIndex, mix * 0.36);

    context.save();
    context.fillStyle = `rgba(159, 24, 54, ${opacity})`;
    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index];
      const from = fromShape[index];
      const to = toShape[index];
      const nx = from.x + (to.x - from.x) * mix;
      const ny = from.y + (to.y - from.y) * mix;
      const breathe = reducedMotion ? 0 : Math.sin(time * 0.00048 * particle.drift + particle.seed) * 0.72;
      let x = centerX + (nx - 0.5) * scale * 1.46 + breathe;
      let y = centerY + (ny - 0.5) * scale + Math.cos(time * 0.0004 + particle.seed) * (reducedMotion ? 0 : 0.48);
      if (!reducedMotion && pointer.strength > 0.01) {
        const influenceRadius = viewportWidth < 700 ? 68 : 92;
        const deltaX = x - pointer.x;
        const deltaY = y - pointer.y;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;
        if (distanceSquared < influenceRadius * influenceRadius) {
          const distance = Math.max(1, Math.sqrt(distanceSquared));
          const falloff = 1 - distance / influenceRadius;
          const nudge = falloff * falloff * 5.5 * pointer.strength;
          x += (deltaX / distance) * nudge;
          y += (deltaY / distance) * nudge;
        }
      }
      const sourceStrength = from.strength + (to.strength - from.strength) * mix;
      const size = particle.radius * (0.74 + sourceStrength * 0.38) * emphasis;
      context.fillRect(x, y, size, size);
    }
    context.restore();
  }

  function frame(time) {
    updateScroll();
    pointer.x += (pointer.targetX - pointer.x) * 0.2;
    pointer.y += (pointer.targetY - pointer.y) * 0.2;
    pointer.strength += (pointer.targetStrength - pointer.strength) * 0.12;
    context.clearRect(0, 0, viewportWidth, viewportHeight);
    drawBackgroundGrid();
    drawParticles(time);
    if (!reducedMotion) requestAnimationFrame(frame);
  }

  async function initialize() {
    try {
      const images = await Promise.all(sources.map((source) => loadImage(source.src)));
      sourceClouds = images.map((image, index) => sampleSource(image, sources[index]));
      detailTextures = sourceClouds.map(buildDetailTexture);
      assetsReady = true;
      buildParticleSet();
      if (reducedMotion) frame(0);
    } catch (error) {
      console.error(error);
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || reducedMotion) return;
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.targetStrength = 1;
    if (!pointer.initialized) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.initialized = true;
    }
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => {
    pointer.targetStrength = 0;
  }, { passive: true });
  window.FUDAN_PARTICLES = {
    setLocale(nextLocale) {
      locale = nextLocale;
      currentStage = -1;
      updateScroll();
    },
  };

  resize();
  updateScroll();
  initialize();
  if (!reducedMotion) requestAnimationFrame(frame);
})();
