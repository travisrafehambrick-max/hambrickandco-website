import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js";

const stage = document.getElementById("phone-stage");
const canvas = document.getElementById("phone-canvas");
const fallback = document.getElementById("phone-fallback");
const fallbackKicker = document.getElementById("fallback-kicker");
const fallbackTitle = document.getElementById("fallback-title");
const fallbackCopy = document.getElementById("fallback-copy");
const fallbackTicket = document.getElementById("fallback-ticket");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function roundedRect(width, height, radius) {
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

function assignUVs(geometry) {
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

function paintScreen(mode) {
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

  ctx.fillStyle = "#111318";
  ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
  ctx.fillStyle = "#FBFBF9";
  ctx.font = "600 34px Arial, sans-serif";
  ctx.fillText(after ? "recovered enquiry" : "missed enquiry", 54, 86);
  ctx.fillStyle = "#7F838A";
  ctx.font = "24px Arial, sans-serif";
  ctx.fillText("10:42", 54, 132);

  rows.forEach(function (row, index) {
    const y = 218 + index * 190;
    ctx.fillStyle = index === 1 ? "#A98F45" : "#25282E";
    ctx.fillRect(44, y - 58, 8, 126);
    ctx.fillStyle = "#FBFBF9";
    ctx.font = "600 31px Arial, sans-serif";
    ctx.fillText(row.title, 78, y - 8);
    ctx.fillStyle = "#9A9DA3";
    ctx.font = "24px Arial, sans-serif";
    ctx.fillText(row.time, 78, y + 30);
    ctx.fillText(row.detail, 78, y + 66);
  });

  ctx.fillStyle = after ? "#A98F45" : "#22252B";
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

function paintTicket(progress) {
  const canvas2d = document.createElement("canvas");
  canvas2d.width = 768;
  canvas2d.height = 1024;
  const ctx = canvas2d.getContext("2d");
  if (!ctx) return null;
  const alive = progress > 0.55;

  ctx.fillStyle = "#F4EFE0";
  ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
  ctx.fillStyle = "#A98F45";
  ctx.fillRect(0, 0, canvas2d.width, 18);
  ctx.fillStyle = "#7E672C";
  ctx.font = "600 28px Arial, sans-serif";
  ctx.fillText("ESTIMATE", 56, 96);
  ctx.fillStyle = "#0F1115";
  ctx.font = "600 54px Georgia, serif";
  ctx.fillText("Deck repair", 56, 180);
  ctx.fillStyle = "#3A3F47";
  ctx.font = "28px Arial, sans-serif";
  ctx.fillText("Sent Monday. Still open.", 56, 236);
  ctx.fillStyle = alive ? "#7E672C" : "#5F646B";
  ctx.font = "600 32px Arial, sans-serif";
  ctx.fillText(alive ? "Follow-up landed." : "No reply.", 56, 860);
  ctx.fillStyle = "#5F646B";
  ctx.font = "24px Arial, sans-serif";
  ctx.fillText(alive ? "Stops the moment they write back." : "The job is going cold.", 56, 910);

  const texture = new THREE.CanvasTexture(canvas2d);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function showFallback(mode, progress) {
  if (!stage) return;
  stage.classList.add("is-fallback");
  if (canvas) canvas.style.display = "none";
  if (fallback) fallback.style.display = "flex";
  const after = mode === "after" || progress > 0.55;
  if (fallbackKicker) fallbackKicker.textContent = after ? "Text sent" : "Missed call";
  if (fallbackTitle) fallbackTitle.textContent = "Deck repair";
  if (fallbackCopy) {
    fallbackCopy.textContent = after
      ? "Job asked. Booking offered. In front of you."
      : "Quote sitting. Nobody called back.";
  }
  if (fallbackTicket) {
    fallbackTicket.innerHTML = after
      ? "<p>Estimate</p><p>Follow-up landed</p>"
      : "<p>Estimate</p><p>No reply</p>";
  }
}

function canUseWebGL() {
  if (!window.WebGLRenderingContext) return false;
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch (err) {
    return false;
  }
}

if (!stage || !canvas || reduceMotion.matches || !canUseWebGL()) {
  showFallback("before", 0);
} else {
  const state = {
    mode: "before",
    progress: 0,
    targetX: 0.14,
    targetY: -0.08,
    dead: false,
    visible: false,
    frame: 0,
  };

  let renderer;
  let scene;
  let camera;
  let group;
  let ticket;
  let screenMaterial;
  let screenTexture;
  let ticketMaterial;
  let ticketTexture;
  let observer;
  let resizeObserver;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (err) {
    showFallback("before", 0);
  }

  if (renderer) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0.55, 0.12, 12.2);

    group = new THREE.Group();
    group.rotation.set(0.1, -0.055, -0.035);
    group.scale.setScalar(0.86);
    scene.add(group);

    const body = new THREE.Mesh(
      new THREE.ExtrudeGeometry(roundedRect(3.7, 6.9, 0.48), {
        depth: 0.42,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.11,
        bevelThickness: 0.1,
        curveSegments: 10,
      }).center(),
      new THREE.MeshStandardMaterial({ color: 0x090a0d, roughness: 0.78, metalness: 0.18 })
    );
    group.add(body);

    const bezel = new THREE.Mesh(
      new THREE.ShapeGeometry(roundedRect(3.34, 6.48, 0.36), 10),
      new THREE.MeshStandardMaterial({ color: 0x171a1e, roughness: 0.62, metalness: 0.1 })
    );
    bezel.position.z = 0.34;
    group.add(bezel);

    const screenGeom = new THREE.ShapeGeometry(roundedRect(3.08, 6.15, 0.27), 10);
    assignUVs(screenGeom);
    screenTexture = paintScreen("before");
    screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });
    const screen = new THREE.Mesh(screenGeom, screenMaterial);
    screen.position.z = 0.355;
    group.add(screen);

    const ear = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.055, 0.42, 4, 10),
      new THREE.MeshStandardMaterial({ color: 0x050608, roughness: 0.9 })
    );
    ear.rotation.z = Math.PI / 2;
    ear.position.set(0, 2.92, 0.39);
    group.add(ear);

    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0x111318,
      roughness: 0.55,
      metalness: 0.35,
    });
    const button = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.72, 0.18), buttonMat);
    button.position.set(-2.02, 1.2, 0.02);
    group.add(button);
    const button2 = button.clone();
    button2.scale.y = 1.28;
    button2.position.y = 0.15;
    group.add(button2);

    ticketTexture = paintTicket(0);
    ticketMaterial = new THREE.MeshStandardMaterial({
      map: ticketTexture,
      roughness: 0.72,
      metalness: 0.04,
    });
    const ticketGeom = new THREE.ExtrudeGeometry(roundedRect(2.55, 3.4, 0.12), {
      depth: 0.04,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      curveSegments: 6,
    });
    assignUVs(ticketGeom);
    ticket = new THREE.Mesh(ticketGeom, ticketMaterial);
    ticket.position.set(2.55, -0.15, 0.2);
    ticket.rotation.set(0.18, -0.72, 0.08);
    scene.add(ticket);

    const light = new THREE.SpotLight(0xa98f45, 110, 26, Math.PI / 5, 0.78, 1.25);
    light.position.set(-4.5, 5.8, 6.5);
    light.target.position.set(0, 0, 0);
    scene.add(light, light.target);

    const fill = new THREE.DirectionalLight(0xfbfbf9, 0.55);
    fill.position.set(4.2, 2.4, 6);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(4.5, 64),
      new THREE.MeshBasicMaterial({ color: 0x0b0d11, transparent: true, opacity: 0.72 })
    );
    ground.scale.y = 0.18;
    ground.position.set(0, -3.82, -0.45);
    scene.add(ground);

    function resize() {
      const width = Math.max(1, stage.clientWidth);
      const height = Math.max(1, stage.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    let ticketAlive = false;

    function applyTicket(progress) {
      if (!ticket) return;
      const t = Math.min(1, Math.max(0, progress));
      ticket.position.set(2.55 - t * 0.35, -0.15 + t * 0.35, 0.2 + t * 0.35);
      ticket.rotation.set(0.18 - t * 0.12, -0.72 + t * 0.86, 0.08 - t * 0.06);
      const alive = t > 0.55;
      if (alive === ticketAlive) return;
      ticketAlive = alive;
      const next = paintTicket(t);
      if (next) {
        ticketTexture?.dispose();
        ticketTexture = next;
        ticketMaterial.map = next;
        ticketMaterial.needsUpdate = true;
      }
    }

    function applyMode(mode) {
      state.mode = mode;
      const next = paintScreen(mode);
      if (next && screenMaterial) {
        screenTexture?.dispose();
        screenTexture = next;
        screenMaterial.map = next;
        screenMaterial.needsUpdate = true;
      }
      applyTicket(mode === "after" ? 1 : 0);
    }

    function loop() {
      if (state.dead || !state.visible || document.hidden) {
        state.frame = 0;
        return;
      }
      group.rotation.x += (state.targetX - group.rotation.x) * 0.045;
      group.rotation.y += (state.targetY - group.rotation.y) * 0.045;
      renderer.render(scene, camera);
      state.frame = requestAnimationFrame(loop);
    }

    function start() {
      if (!state.frame) state.frame = requestAnimationFrame(loop);
    }

    function stop() {
      if (state.frame) cancelAnimationFrame(state.frame);
      state.frame = 0;
    }

    resize();
    renderer.render(scene, camera);

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    observer = new IntersectionObserver(
      function (entries) {
        state.visible = entries.some(function (entry) {
          return entry.isIntersecting;
        });
        if (state.visible) start();
        else stop();
      },
      { threshold: 0.08 }
    );
    observer.observe(stage);

    stage.addEventListener("pointermove", function (event) {
      const box = stage.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      state.targetY = -0.08 + x * 0.16;
      state.targetX = 0.14 + y * 0.1;
    });
    stage.addEventListener("pointerleave", function () {
      state.targetY = -0.08;
      state.targetX = 0.14;
    });

    window.addEventListener("hbc:timeline-mode", function (event) {
      const mode = event.detail;
      if (mode !== "before" && mode !== "after") return;
      applyMode(mode);
    });

    window.addEventListener("hbc:process-progress", function (event) {
      const detail = event.detail;
      const locked = Boolean(detail && typeof detail === "object" ? detail.locked : false);
      const progress = Number(detail && typeof detail === "object" ? detail.progress : detail) || 0;
      state.progress = progress;
      if (locked) {
        applyTicket(state.mode === "after" ? 1 : 0);
        return;
      }
      applyTicket(progress);
      if (progress > 0.62 && state.mode !== "after") applyMode("after");
      if (progress < 0.28 && state.mode !== "before") applyMode("before");
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (state.visible) start();
    });

    window.addEventListener("pagehide", function () {
      state.dead = true;
      stop();
      observer?.disconnect();
      resizeObserver?.disconnect();
      screenTexture?.dispose();
      ticketTexture?.dispose();
      scene.traverse(function (obj) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(function (mat) { mat.dispose(); });
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    });
  }
}
