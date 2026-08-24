(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function renderSphere(ctx, size, rot, lightAz, tilt) {
    const image = ctx.createImageData(size, size);
    const px = image.data;
    const cx = (size - 1) * 0.5;
    const radius = size * 0.48;
    const el = 0.38 + tilt * 0.35;
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
        const ny = -dy;
        const nz2 = -dx * sinR + nz * cosR;

        const ndotl = Math.max(0, nx * Lx + ny * Ly + nz2 * Lz);
        const lat = Math.asin(Math.max(-1, Math.min(1, ny)));
        const groove = Math.exp(-((lat * 16) ** 2)) * 0.22;
        const ridge = Math.exp(-((lat * 48) ** 2)) * 0.1;
        const rings = Math.sin(lat * 86) * 0.028 * (1 - Math.abs(lat));

        let rC = 0.2 - groove + ridge + rings;
        let gC = 0.21 - groove * 0.9 + ridge * 0.85 + rings;
        let bC = 0.23 - groove * 0.75 + ridge * 0.7 + rings * 0.9;

        const fres = (1 - nz) ** 2.35;
        rC = rC * (1 - fres) + 0.52 * fres;
        gC = gC * (1 - fres) + 0.55 * fres;
        bC = bC * (1 - fres) + 0.58 * fres;

        const hx = Lx;
        const hy = Ly;
        const hz = Lz + 1;
        const hlen = Math.hypot(hx, hy, hz) || 1;
        const spec = Math.max(0, (nx * hx + ny * hy + nz2 * hz) / hlen) ** 64;
        const sheen = Math.max(0, (nx * hx + ny * hy + nz2 * hz) / hlen) ** 10;

        const lum = 0.16 + ndotl * 0.78;
        let rr = rC * lum + spec * 0.92 + sheen * 0.07 + nx * 0.015;
        let gg = gC * lum + spec * 0.9 + sheen * 0.065;
        let bb = bC * lum + spec * 0.86 + sheen * 0.055 - nx * 0.01;

        const nacre = sheen * 0.11 * ndotl;
        rr += nacre * 0.95;
        gg += nacre * 0.88;
        bb += nacre * 0.74;

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

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const cssSize = 240;
    canvas.width = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);

    const state = { rot: 0.16, light: 0.62, tilt: 0.02, lastRot: -1, lastLight: -1, lastTilt: -1 };
    const draw = function (force) {
      if (
        !force &&
        Math.abs(state.rot - state.lastRot) < 0.004 &&
        Math.abs(state.light - state.lastLight) < 0.004 &&
        Math.abs(state.tilt - state.lastTilt) < 0.004
      ) {
        return;
      }
      state.lastRot = state.rot;
      state.lastLight = state.light;
      state.lastTilt = state.tilt;
      renderSphere(ctx, canvas.width, state.rot, state.light, state.tilt);
    };
    draw(true);
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
  if (typeof SplitText !== "undefined") {
    gsap.registerPlugin(SplitText);
  }
  if (typeof DrawSVGPlugin !== "undefined") {
    gsap.registerPlugin(DrawSVGPlugin);
  }

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(".reveal, .hero-copy > *, .compass, .streaks i, .hero-rail", {
      autoAlpha: 1,
      y: 0,
      x: 0,
      clearProps: "transform",
    });
    if (sphere) {
      sphere.state.rot = 0.22;
      sphere.state.light = 0.78;
      sphere.state.tilt = 0.04;
      sphere.draw(true);
    }
  });

  mm.add(
    {
      isDesktop: "(min-width: 900px)",
      isMobile: "(max-width: 899px)",
      motion: "(prefers-reduced-motion: no-preference)",
    },
    function (context) {
      if (!context.conditions.motion) return;

      const intro = gsap.timeline({
        defaults: { ease: "power4.out", duration: 0.8 },
      });

      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.set(".compass-draw", { drawSVG: "0%" });
        intro.to(
          ".compass-draw",
          {
            drawSVG: "100%",
            duration: 1.1,
            stagger: 0.08,
            ease: "power2.inOut",
          },
          0
        );
      } else {
        intro.from(".compass", { autoAlpha: 0, scale: 0.92, duration: 0.9 }, 0);
      }

      intro.from(
        ".streaks i",
        { autoAlpha: 0, x: -40, duration: 0.9, stagger: 0.06, ease: "power3.out" },
        0.15
      );

      const title = document.getElementById("hero-title");
      if (title && typeof SplitText !== "undefined") {
        SplitText.create(title, {
          type: "words,lines",
          mask: "lines",
          autoSplit: true,
          aria: "auto",
          onSplit: function (self) {
            return gsap.from(self.words, {
              yPercent: 120,
              autoAlpha: 0,
              duration: 0.85,
              stagger: 0.045,
              ease: "power4.out",
              delay: 0.12,
            });
          },
        });
      } else {
        intro.from("h1", { y: 22, autoAlpha: 0 }, 0.1);
      }

      intro.from(
        ".hero-copy > *:not(h1)",
        { y: 18, autoAlpha: 0, stagger: 0.07, duration: 0.7 },
        0.28
      );
      intro.from(
        ".sphere-well",
        { autoAlpha: 0, duration: 1, ease: "power3.out" },
        0.18
      );
      intro.from(".hero-rail", { autoAlpha: 0, y: 10, duration: 0.6 }, 0.55);

      const amp = document.querySelector("h1 .amp");
      if (amp) {
        intro.from(amp, { rotation: -10, duration: 1, ease: "power3.out" }, 0.22);
      }

      if (sphere && typeof ScrollTrigger !== "undefined") {
        const proxy = {
          rot: sphere.state.rot,
          light: sphere.state.light,
          tilt: sphere.state.tilt,
        };
        const pinHero = context.conditions.isDesktop;

        const film = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: pinHero ? "+=175%" : "bottom top",
            pin: pinHero,
            anticipatePin: 1,
            scrub: 0.85,
          },
          onUpdate: function () {
            sphere.state.rot = proxy.rot;
            sphere.state.light = proxy.light;
            sphere.state.tilt = proxy.tilt;
            sphere.draw();
          },
        });

        film.fromTo(proxy, { rot: 0.16, light: 0.62, tilt: 0.02 }, { rot: 2.35, light: 2.05, tilt: 0.2 }, 0);
        film.fromTo(".compass", { rotation: 0, scale: 1 }, { rotation: 26, scale: 1.06 }, 0);
        film.fromTo(".streaks i", { xPercent: 0, yPercent: 0 }, { xPercent: 28, yPercent: -16 }, 0);
        film.fromTo(".sphere-spec", { x: 0, y: 0, scale: 1 }, { x: 36, y: 10, scale: 1.15 }, 0);
        film.fromTo(".hero-object", { y: 0, scale: 1 }, { y: -16, scale: 1.04 }, 0);
      }

      if (typeof ScrollTrigger !== "undefined") {
        const offers = gsap.utils.toArray("#offers .reveal");
        if (offers.length) {
          gsap
            .timeline({
              defaults: { ease: "power3.out", duration: 0.65 },
              scrollTrigger: {
                trigger: "#offers",
                start: "top 78%",
                once: true,
              },
            })
            .from(offers[0], { y: 28, autoAlpha: 0 })
            .from(offers.slice(1), { y: 36, autoAlpha: 0, stagger: 0.12 }, "-=0.35");
        }

        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.6 },
            scrollTrigger: {
              trigger: "#process",
              start: "top 76%",
              once: true,
            },
          })
          .from("#process .sec-head", { y: 22, autoAlpha: 0 })
          .from("#process .proc li", { y: 28, autoAlpha: 0, stagger: 0.1 }, "-=0.25");

        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.65 },
            scrollTrigger: {
              trigger: "#work",
              start: "top 80%",
              once: true,
            },
          })
          .from("#work .sec-head", { y: 22, autoAlpha: 0 })
          .from("#work .sample", { y: 32, autoAlpha: 0 }, "-=0.3");

        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.7 },
            scrollTrigger: {
              trigger: "#about",
              start: "top 78%",
              once: true,
            },
          })
          .from(".amp-well", { y: 30, autoAlpha: 0, scale: 0.96 })
          .from(".amp-well .amp", { rotation: -12, duration: 0.9 }, "<0.05")
          .from("#about .about", { y: 24, autoAlpha: 0 }, "-=0.45");

        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.65 },
            scrollTrigger: {
              trigger: "#contact",
              start: "top 80%",
              once: true,
            },
          })
          .from("#contact .reveal", { y: 26, autoAlpha: 0, stagger: 0.12 });
      }

      document.fonts.ready.then(function () {
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      });
    }
  );

  reduceMotion.addEventListener("change", function () {
    if (typeof gsap.matchMediaRefresh === "function") {
      gsap.matchMediaRefresh();
    }
  });
})();
