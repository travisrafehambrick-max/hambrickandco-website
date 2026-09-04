const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js";

const stage = document.getElementById("phone-stage");
const canvas = document.getElementById("phone-canvas");
const fallback = document.getElementById("phone-fallback");
const fallbackTitle = document.getElementById("fallback-title");
const fallbackCopy = document.getElementById("fallback-copy");
const fallbackState = document.getElementById("fallback-state");
const fallbackPhone = document.getElementById("fallback-phone");
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

let applyProgress = function (progress) {
  if (progress > 0.55) showFallback("after");
  else showFallback("before");
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
  applyProgress = function () {};
  showFallback("after");
}

window.addEventListener("hbc:peel-progress", function (event) {
  const detail = event.detail || {};
  if (detail.reduced) {
    useBookedStill();
    return;
  }
  applyProgress(Number(detail.progress) || 0);
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
    { rootMargin: "20% 0px", threshold: 0.01 }
  );
  boot.observe(stage);
}

function screenTexture(THREE, after) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 896;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "#c4a574";
  ctx.strokeRect(24, 24, c.width - 48, c.height - 48);
  ctx.fillStyle = "#c4a574";
  ctx.font = "28px monospace";
  ctx.fillText("ILLUSTRATION", 48, 90);
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "48px monospace";
  ctx.fillText(after ? "TEXT SENT" : "MISSED CALL", 48, 180);
  ctx.font = "28px sans-serif";
  ctx.fillStyle = "#f5f5f5";
  const lines = after
    ? ["Job asked.", "Booking offered.", "In front of the owner."]
    : ["Quote sitting.", "Nobody called back.", "No reply."];
  lines.forEach(function (line, i) {
    ctx.fillText(line, 48, 260 + i * 42);
  });
  ctx.fillStyle = "#c4a574";
  ctx.font = "26px monospace";
  ctx.fillText(after ? "RECOVERED" : "DEAD THREAD", 48, 820);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function initPhone(THREE) {
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(canvas.clientWidth || stage.clientWidth, 480, false);
  renderer.setClearColor(0x121212, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, (canvas.clientWidth || 1) / 480, 0.1, 40);
  camera.position.set(0, 0, 8);

  const light = new THREE.DirectionalLight(0xf5f5f5, 1.1);
  light.position.set(-2, 3, 6);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xc4a574, 0.35));

  const phone = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 4.4, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x121212, metalness: 0.55, roughness: 0.35 })
  );
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 3.9),
    new THREE.MeshBasicMaterial({ map: screenTexture(THREE, true) })
  );
  screen.position.z = 0.1;

  const sheet = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 3.9),
    new THREE.MeshBasicMaterial({ map: screenTexture(THREE, false) })
  );
  sheet.position.z = 0.12;
  sheet.userData.pivot = true;

  phone.add(body);
  phone.add(screen);
  phone.add(sheet);
  phone.rotation.y = -0.18;
  phone.rotation.x = 0.08;
  scene.add(phone);

  hideFallback();

  let raf = 0;
  let progress = 0;
  let moving = false;

  function pose(p) {
    progress = Math.max(0, Math.min(1, p));
    sheet.rotation.x = -progress * 1.25;
    sheet.position.y = progress * 0.35;
    sheet.material.opacity = 1 - progress * 0.15;
    sheet.material.transparent = true;
    phone.rotation.y = -0.18 + progress * 0.28;
  }

  function draw() {
    renderer.render(scene, camera);
    raf = 0;
  }

  function tick() {
    if (moving) draw();
    if (moving) raf = requestAnimationFrame(tick);
  }

  applyProgress = function (p) {
    pose(p);
    moving = true;
    if (!raf) raf = requestAnimationFrame(tick);
    window.clearTimeout(applyProgress._quiet);
    applyProgress._quiet = window.setTimeout(function () {
      moving = false;
    }, 180);
  };

  function onResize() {
    const w = canvas.clientWidth || stage.clientWidth;
    renderer.setSize(w, 480, false);
    camera.aspect = w / 480;
    camera.updateProjectionMatrix();
    draw();
  }

  window.addEventListener("resize", onResize);

  teardownWebGL = function () {
    window.removeEventListener("resize", onResize);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    moving = false;
    scene.remove(phone);
    body.geometry.dispose();
    screen.geometry.dispose();
    sheet.geometry.dispose();
    body.material.dispose();
    if (screen.material.map) screen.material.map.dispose();
    screen.material.dispose();
    if (sheet.material.map) sheet.material.map.dispose();
    sheet.material.dispose();
    renderer.dispose();
    applyProgress = function (p) {
      if (p > 0.55) showFallback("after");
      else showFallback("before");
    };
  };

  pose(0);
  draw();
}
