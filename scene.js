const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js";

const stage = document.getElementById("phone-stage");
const canvas = document.getElementById("phone-canvas");
const fallback = document.getElementById("phone-fallback");
const fallbackTitle = document.getElementById("fallback-title");
const fallbackCopy = document.getElementById("fallback-copy");
const fallbackState = document.getElementById("fallback-state");
const fallbackPhone = fallback ? fallback.querySelector(".fallback-phone") : null;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function showFallback(mode) {
  if (!stage) return;
  stage.classList.add("is-fallback");
  if (canvas) canvas.style.display = "none";
  if (fallback) fallback.style.display = "flex";
  const after = mode === "after";
  if (fallbackPhone) fallbackPhone.dataset.mode = after ? "after" : "before";
  if (fallbackTitle) fallbackTitle.textContent = after ? "Text sent" : "Missed call";
  if (fallbackCopy) {
    fallbackCopy.textContent = after
      ? "Job asked. Booking offered. In front of you."
      : "Quote sitting. Nobody called back.";
  }
  if (fallbackState) {
    fallbackState.textContent = after ? "Thursday · job booked." : "No reply. No booking.";
  }
}

function hideFallback() {
  if (!stage) return;
  stage.classList.remove("is-fallback");
  if (canvas) canvas.style.display = "block";
  if (fallback) fallback.style.display = "none";
}

function canUseWebGL() {
  if (!window.WebGLRenderingContext) return false;
  if (navigator.connection && navigator.connection.saveData) return false;
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch (err) {
    return false;
  }
}

let onMode = showFallback;
let onProgress = function (progress, locked) {
  if (locked) return;
  if (progress > 0.62) showFallback("after");
  else if (progress < 0.28) showFallback("before");
};
let boot = null;
let teardownWebGL = function () {};

function useBookedStill() {
  teardownWebGL();
  teardownWebGL = function () {};
  if (boot) {
    boot.disconnect();
    boot = null;
  }
  onMode = showFallback;
  onProgress = function () {};
  showFallback("after");
}

window.addEventListener("hbc:timeline-mode", function (event) {
  const mode = event.detail;
  if (mode !== "before" && mode !== "after") return;
  onMode(mode);
});
window.addEventListener("hbc:process-progress", function (event) {
  const detail = event.detail || {};
  onProgress(Number(detail.progress) || 0, Boolean(detail.locked));
});

reduceMotion.addEventListener("change", function () {
  if (reduceMotion.matches) useBookedStill();
});

if (!stage || !canvas) {
  showFallback("after");
} else if (reduceMotion.matches) {
  useBookedStill();
} else if (!canUseWebGL()) {
  showFallback("before");
} else {
  showFallback("before");
  let started = false;
  boot = new IntersectionObserver(
    function (entries) {
      if (started || !entries.some(function (entry) { return entry.isIntersecting; })) return;
      started = true;
      boot.disconnect();
      boot = null;
      if (reduceMotion.matches) {
        useBookedStill();
        return;
      }
      import(THREE_URL)
        .then(function (THREE) {
          if (reduceMotion.matches) {
            useBookedStill();
            return;
          }
          initPhone(THREE);
        })
        .catch(function () {
          showFallback("before");
        });
    },
    { rootMargin: "25% 0px", threshold: 0.01 }
  );
  boot.observe(stage);
}

function roundedRect(THREE, width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function assignUVs(THREE, geometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const pos = geometry.getAttribute("position");
  if (!box || !pos) return;
  const spanX = box.max.x - box.min.x;
  const spanY = box.max.y - box.min.y;
  const uv = [];
  for (let i = 0; i < pos.count; i += 1) {
    uv.push((pos.getX(i) - box.min.x) / spanX, (pos.getY(i) - box.min.y) / spanY);
  }
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
}

function paintScreen(THREE, mode) {
  const after = mode === "after";
  const canvas2d = document.createElement("canvas");
  canvas2d.width = 640;
  canvas2d.height = 1180;
  const ctx = canvas2d.getContext("2d");
  if (!ctx) return null;

  const rows = after
    ? [
        { title: "Quote sent", time: "Mon 3:18 PM", detail: "Deck repair · sitting" },
        { title: "Missed call", time: "Tue 10:42 AM", detail: "They rang the shop" },
        { title: "Text sent", time: "10:43 AM", detail: "Job asked. Booking offered." },
        { title: "In front of you", time: "10:45 AM", detail: "Thread on your phone" },
      ]
    : [
        { title: "Quote sent", time: "Mon 3:18 PM", detail: "Deck repair · sitting" },
        { title: "Missed call", time: "Tue 10:42 AM", detail: "They rang the shop" },
        { title: "Voicemail", time: "10:44 AM", detail: "Not played" },
        { title: "Follow-up", time: "Friday", detail: "Never scheduled" },
      ];

  ctx.fillStyle = "#0F1115";
  ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
  ctx.fillStyle = "#FBFBF9";
  ctx.font = "600 34px Arial, sans-serif";
  ctx.fillText(after ? "illustration · recovered" : "illustration · missed", 54, 86);
  ctx.fillStyle = "#5F646B";
  ctx.font = "24px Arial, sans-serif";
  ctx.fillText("10:42", 54, 132);

  rows.forEach(function (row, index) {
    const y = 218 + index * 190;
    ctx.fillStyle = index === 1 ? "#A98F45" : "#3A3F47";
    ctx.fillRect(44, y - 58, 8, 126);
    ctx.fillStyle = "#FBFBF9";
    ctx.font = "600 31px Arial, sans-serif";
    ctx.fillText(row.title, 78, y - 8);
    ctx.fillStyle = "#5F646B";
    ctx.font = "24px Arial, sans-serif";
    ctx.fillText(row.time, 78, y + 30);
    ctx.fillText(row.detail, 78, y + 66);
  });

  ctx.fillStyle = after ? "#A98F45" : "#3A3F47";
  ctx.fillRect(44, 1010, 552, 104);
  ctx.fillStyle = after ? "#0F1115" : "#FBFBF9";
  ctx.font = "600 28px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(after ? "Thursday · job booked" : "No reply. No booking.", 320, 1073);

  const texture = new THREE.CanvasTexture(canvas2d);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function initPhone(THREE) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (err) {
    showFallback("before");
    return;
  }

  hideFallback();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.08, 11.6);

  const group = new THREE.Group();
  scene.add(group);

  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRect(THREE, 3.7, 6.9, 0.48), {
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.11,
      bevelThickness: 0.1,
      curveSegments: 10,
    }).center(),
    new THREE.MeshStandardMaterial({ color: 0x0f1115, roughness: 0.78, metalness: 0.18 })
  );
  group.add(body);

  const bezel = new THREE.Mesh(
    new THREE.ShapeGeometry(roundedRect(THREE, 3.34, 6.48, 0.36), 10),
    new THREE.MeshStandardMaterial({ color: 0x0f1115, roughness: 0.62, metalness: 0.1 })
  );
  bezel.position.z = 0.34;
  group.add(bezel);

  const screenGeom = new THREE.ShapeGeometry(roundedRect(THREE, 3.08, 6.15, 0.27), 10);
  assignUVs(THREE, screenGeom);
  let screenTexture = paintScreen(THREE, "before");
  const screenMaterial = new THREE.MeshBasicMaterial({
    map: screenTexture,
    toneMapped: false,
    transparent: true,
    opacity: 0.72,
  });
  const screen = new THREE.Mesh(screenGeom, screenMaterial);
  screen.position.z = 0.355;
  group.add(screen);

  const ear = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.055, 0.42, 4, 10),
    new THREE.MeshStandardMaterial({ color: 0x0f1115, roughness: 0.9 })
  );
  ear.rotation.z = Math.PI / 2;
  ear.position.set(0, 2.92, 0.39);
  group.add(ear);

  const light = new THREE.SpotLight(0xa98f45, 90, 26, Math.PI / 5, 0.78, 1.25);
  light.position.set(-4.5, 5.8, 6.5);
  light.target.position.set(0, 0, 0);
  scene.add(light, light.target);

  const fill = new THREE.DirectionalLight(0xfbfbf9, 0.45);
  fill.position.set(3.2, 2.2, 6);
  scene.add(fill);

  const state = {
    mode: "before",
    progress: 0,
    visible: false,
    dead: false,
    frame: 0,
    rotX: 0.24,
    rotY: -0.16,
    posY: -0.28,
    opacity: 0.72,
  };
  const target = { rotX: 0.24, rotY: -0.16, posY: -0.28, opacity: 0.72 };

  function poseFrom(progress) {
    const t = Math.min(1, Math.max(0, progress));
    target.rotX = 0.24 - t * 0.16;
    target.rotY = -0.16 + t * 0.14;
    target.posY = -0.28 + t * 0.4;
    target.opacity = 0.72 + t * 0.28;
  }

  function applyMode(mode) {
    state.mode = mode;
    const next = paintScreen(THREE, mode);
    if (next && screenMaterial) {
      screenTexture?.dispose();
      screenTexture = next;
      screenMaterial.map = next;
      screenMaterial.needsUpdate = true;
    }
    poseFrom(mode === "after" ? 1 : 0);
    kick();
  }

  function resize() {
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function loop() {
    if (state.dead || !state.visible || document.hidden) {
      state.frame = 0;
      return;
    }
    const dx = target.rotX - state.rotX;
    const dy = target.rotY - state.rotY;
    const dPos = target.posY - state.posY;
    const dOp = target.opacity - state.opacity;
    state.rotX += dx * 0.12;
    state.rotY += dy * 0.12;
    state.posY += dPos * 0.12;
    state.opacity += dOp * 0.12;
    group.rotation.x = state.rotX;
    group.rotation.y = state.rotY;
    group.position.y = state.posY;
    screenMaterial.opacity = state.opacity;
    renderer.render(scene, camera);
    const moving = Math.abs(dx) + Math.abs(dy) + Math.abs(dPos) + Math.abs(dOp) > 0.004;
    state.frame = moving ? requestAnimationFrame(loop) : 0;
  }

  function kick() {
    if (!state.visible || state.dead || document.hidden) return;
    if (!state.frame) state.frame = requestAnimationFrame(loop);
  }

  resize();
  poseFrom(0);
  group.rotation.set(state.rotX, state.rotY, -0.03);
  group.position.y = state.posY;
  renderer.render(scene, camera);

  const resizeObserver = new ResizeObserver(function () {
    resize();
    renderer.render(scene, camera);
  });
  resizeObserver.observe(stage);

  const observer = new IntersectionObserver(
    function (entries) {
      state.visible = entries.some(function (entry) {
        return entry.isIntersecting;
      });
      if (state.visible) kick();
      else if (state.frame) {
        cancelAnimationFrame(state.frame);
        state.frame = 0;
      }
    },
    { threshold: 0.08 }
  );
  observer.observe(stage);

  onMode = applyMode;
  onProgress = function (progress, locked) {
    if (locked) {
      poseFrom(state.mode === "after" ? 1 : 0);
      kick();
      return;
    }
    state.progress = progress;
    poseFrom(progress);
    if (progress > 0.62 && state.mode !== "after") applyMode("after");
    else if (progress < 0.28 && state.mode !== "before") applyMode("before");
    else kick();
  };

  function disposeWebGL() {
    if (state.dead) return;
    state.dead = true;
    if (state.frame) cancelAnimationFrame(state.frame);
    state.frame = 0;
    observer.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", disposeWebGL);
    screenTexture?.dispose();
    scene.traverse(function (obj) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(function (mat) { mat.dispose(); });
        else obj.material.dispose();
      }
    });
    renderer.dispose();
    onMode = showFallback;
    onProgress = function () {};
  }

  function onVisibility() {
    if (document.hidden && state.frame) {
      cancelAnimationFrame(state.frame);
      state.frame = 0;
    } else if (state.visible) kick();
  }

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", disposeWebGL);
  teardownWebGL = disposeWebGL;
}
