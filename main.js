(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function renderSphere(ctx, size, rot, lightAz) {
    const image = ctx.createImageData(size, size);
    const px = image.data;
    const cx = (size - 1) * 0.5;
    const radius = size * 0.48;
    const el = 0.42;
    const lx = Math.cos(el) * Math.cos(lightAz);
    const ly = Math.sin(el);
    const lz = Math.cos(el) * Math.sin(lightAz);
    const llen = Math.hypot(lx, ly, lz) || 1;
    const Lx = lx / llen;
    const Ly = ly / llen;
    const Lz = lz / llen;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = (x - cx) / radius;
        const dy = (y - cx) / radius;
        const d2 = dx * dx + dy * dy;
        if (d2 > 1) continue;

        const nz = Math.sqrt(1 - d2);
        const nx = dx * cosR + nz * sinR;
        const ny = dy;
        const nz2 = -dx * sinR + nz * cosR;

        const ndotl = Math.max(0, nx * Lx + ny * Ly + nz2 * Lz);
        const lat = Math.asin(Math.max(-1, Math.min(1, ny)));
        const groove = Math.exp(-((lat * 11) ** 2)) * 0.14;

        let rC = 0.91 - groove;
        let gC = 0.87 - groove * 0.88;
        let bC = 0.8 - groove * 0.68;

        const fres = (1 - nz) ** 2.15;
        rC = rC * (1 - fres) + 0.58 * fres;
        gC = gC * (1 - fres) + 0.59 * fres;
        bC = bC * (1 - fres) + 0.61 * fres;

        const hx = Lx;
        const hy = Ly + 1;
        const hz = Lz;
        const hlen = Math.hypot(hx, hy, hz) || 1;
        const spec = Math.max(0, (nx * hx + ny * hy + nz2 * hz) / hlen) ** 46;

        const lum = 0.27 + ndotl * 0.73;
        let rr = rC * lum + spec * 0.9 + nx * 0.025;
        let gg = gC * lum + spec * 0.88;
        let bb = bC * lum + spec * 0.78 - nx * 0.018;

        const edge = d2 > 0.9 ? (1 - d2) / 0.1 : 1;
        const i = (y * size + x) * 4;
        px[i] = Math.min(255, Math.max(0, rr * 255));
        px[i + 1] = Math.min(255, Math.max(0, gg * 255));
        px[i + 2] = Math.min(255, Math.max(0, bb * 255));
        px[i + 3] = Math.min(255, edge * 255);
      }
    }

    ctx.putImageData(image, 0, 0);
  }

  function setupSphere() {
    const canvas = document.getElementById("sphere");
    if (!canvas) return null;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    const state = { rot: 0.18, light: 0.72 };
    const draw = function () {
      renderSphere(ctx, canvas.width, state.rot, state.light);
    };
    draw();
    return { state, draw };
  }

  const sphere = setupSphere();

  const compose = document.getElementById("compose");
  if (compose) {
    compose.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = (document.getElementById("name") || {}).value || "";
      const shop = (document.getElementById("shop") || {}).value || "";
      const note = (document.getElementById("note") || {}).value || "";
      const subject = shop
        ? "Kickoff readiness — " + shop
        : "Kickoff readiness";
      const lines = [];
      if (name) lines.push("Name: " + name);
      if (shop) lines.push("Agency or business: " + shop);
      if (note) lines.push("", note);
      const body = lines.join("\n");
      const href =
        "mailto:hello@hambrickco.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
      window.location.href = href;
    });
  }

  if (typeof gsap === "undefined") return;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  const mm = gsap.matchMedia();

  mm.add(
    {
      isMotion: "(prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    function (context) {
      const motion = context.conditions.isMotion;

      if (!motion) {
        gsap.set(".reveal", { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.from("h1", {
        y: 18,
        autoAlpha: 0,
        duration: 0.75,
        ease: "power3.out",
      });

      const amp = document.querySelector("h1 .amp");
      if (amp) {
        gsap.from(amp, {
          rotation: -8,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.16,
        });
      }

      gsap.from(".hero-copy > *:not(h1)", {
        y: 14,
        autoAlpha: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.08,
      });

      if (sphere && typeof ScrollTrigger !== "undefined") {
        const proxy = { rot: sphere.state.rot, light: sphere.state.light };
        gsap.to(proxy, {
          rot: 0.72,
          light: 1.18,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.7,
          },
          onUpdate: function () {
            sphere.state.rot = proxy.rot;
            sphere.state.light = proxy.light;
            sphere.draw();
          },
        });
      }

      gsap.utils.toArray(".reveal").forEach(function (el) {
        gsap.from(el, {
          y: 18,
          autoAlpha: 0,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
          },
        });
      });
    }
  );

  reduceMotion.addEventListener("change", function () {
    if (typeof gsap.matchMediaRefresh === "function") {
      gsap.matchMediaRefresh();
    }
  });
})();
