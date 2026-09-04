(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const demo = document.getElementById("enquiry-demo");
  const beforeBtn = document.getElementById("btn-before");
  const afterBtn = document.getElementById("btn-after");
  const beforePane = document.getElementById("pane-before");
  const afterPane = document.getElementById("pane-after");
  const urlbar = document.getElementById("demo-url");
  const form = document.getElementById("lead-form");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const hasGsap = typeof gsap !== "undefined";

  function prefersReduced() {
    return reduceMotion.matches;
  }

  function dispatchMode(mode) {
    window.dispatchEvent(new CustomEvent("hbc:timeline-mode", { detail: mode }));
  }

  function playPane(pane) {
    if (!pane) return;
    const rows = pane.querySelectorAll(".enquiry-row");
    const words = pane.querySelectorAll(".flip-word");
    if (!hasGsap || prefersReduced()) {
      rows.forEach(function (row) {
        row.style.opacity = "1";
        row.style.transform = "none";
      });
      words.forEach(function (word) {
        word.style.opacity = "1";
        word.style.transform = "none";
      });
      return;
    }
    gsap.fromTo(
      rows,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.07, ease: "power3.out", overwrite: true }
    );
    gsap.fromTo(
      words,
      { autoAlpha: 0, rotationX: -70 },
      { autoAlpha: 1, rotationX: 0, duration: 0.42, stagger: 0.04, ease: "power3.out", overwrite: true }
    );
  }

  function setMode(mode, userMoved) {
    if (!demo || !beforePane || !afterPane) return;
    const after = mode === "after";
    demo.dataset.mode = after ? "after" : "before";
    beforePane.hidden = after;
    afterPane.hidden = !after;
    if (urlbar) {
      urlbar.textContent = after ? "illustration / recovered enquiry" : "illustration / missed enquiry";
    }
    if (beforeBtn && afterBtn) {
      beforeBtn.setAttribute("aria-pressed", after ? "false" : "true");
      afterBtn.setAttribute("aria-pressed", after ? "true" : "false");
      beforeBtn.classList.toggle("on", !after);
      afterBtn.classList.toggle("on", after);
      const pill = demo.querySelector(".toggle-pill");
      if (pill && hasGsap && !prefersReduced()) {
        const host = after ? afterBtn : beforeBtn;
        if (!pill.parentElement || pill.parentElement !== host) {
          host.prepend(pill);
        }
        gsap.fromTo(
          pill,
          { scaleX: 0.86, autoAlpha: 0.7 },
          { scaleX: 1, autoAlpha: 1, duration: 0.28, ease: "power3.out" }
        );
      } else if (pill) {
        (after ? afterBtn : beforeBtn).prepend(pill);
      }
    }
    playPane(after ? afterPane : beforePane);
    dispatchMode(after ? "after" : "before");
    if (userMoved) demo.dataset.locked = "1";
  }

  if (beforeBtn) {
    beforeBtn.addEventListener("click", function () {
      setMode("before", true);
    });
  }
  if (afterBtn) {
    afterBtn.addEventListener("click", function () {
      setMode("after", true);
    });
  }

  function bindControls() {
    document.querySelectorAll("[data-control]").forEach(function (el) {
      if (!hasGsap || prefersReduced()) return;
      const arrow = el.querySelector(".btn-arrow");
      el.addEventListener("pointerenter", function () {
        gsap.to(el, { scale: 1.015, duration: 0.22, ease: "power3.out", overwrite: "auto" });
        if (arrow) {
          gsap.to(arrow, { x: 2, y: el.classList.contains("line") ? 2 : -2, duration: 0.22, ease: "power3.out" });
        }
      });
      el.addEventListener("pointerleave", function () {
        gsap.to(el, { scale: 1, duration: 0.22, ease: "power3.out", overwrite: "auto" });
        if (arrow) gsap.to(arrow, { x: 0, y: 0, duration: 0.22, ease: "power3.out" });
      });
      el.addEventListener("pointerdown", function () {
        gsap.to(el, { scale: 0.97, duration: 0.08, ease: "power2.out", overwrite: "auto" });
      });
      el.addEventListener("pointerup", function () {
        gsap.to(el, { scale: 1.015, duration: 0.16, ease: "power2.out", overwrite: "auto" });
      });
    });
  }

  function bindFields() {
    document.querySelectorAll(".field").forEach(function (field) {
      const input = field.querySelector("input, textarea");
      if (!input) return;
      const live = function () {
        field.classList.toggle("is-live", document.activeElement === input || Boolean(input.value));
      };
      input.addEventListener("focus", live);
      input.addEventListener("blur", live);
      input.addEventListener("input", live);
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = (document.getElementById("name") || {}).value || "";
      const shop = (document.getElementById("biz") || {}).value || "";
      const reach = (document.getElementById("reach") || {}).value || "";
      const note = (document.getElementById("about-msg") || {}).value || "";
      const enquiries = (document.getElementById("enquiries") || {}).value || "";
      const subject = shop ? "Look request — " + shop : "Look request";
      const lines = [];
      if (name) lines.push("Name: " + name);
      if (shop) lines.push("Business: " + shop);
      if (reach) lines.push("Email or phone: " + reach);
      if (note) lines.push("What they do: " + note);
      if (enquiries) lines.push("How enquiries arrive: " + enquiries);
      const href =
        "mailto:hello@hambrickco.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
      window.location.href = href;
    });
  }

  function setMenu(open) {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    mobileNav.hidden = !open;
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      setMenu(mobileNav.hidden);
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
  }

  function setupMotion() {
    if (!hasGsap) return;
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
    if (typeof SplitText !== "undefined") gsap.registerPlugin(SplitText);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: reduce)", function () {
      gsap.set(".enquiry-row, .flip-word", { autoAlpha: 1, y: 0, clearProps: "transform" });
    });

    mm.add("(prefers-reduced-motion: no-preference)", function () {
      const title = document.getElementById("hero-title");
      if (title && typeof SplitText !== "undefined") {
        SplitText.create(title, {
          type: "words,lines",
          mask: "lines",
          autoSplit: true,
          aria: "auto",
          onSplit: function (self) {
            return gsap.from(self.words, {
              yPercent: 110,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.045,
              ease: "power4.out",
            });
          },
        });
      }

      const steps = gsap.utils.toArray(".proc-step");
      if (typeof ScrollTrigger !== "undefined" && steps.length) {
        ScrollTrigger.create({
          trigger: "#process",
          start: "top 70%",
          end: "bottom 40%",
          onUpdate: function (self) {
            const index = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
            steps.forEach(function (step, i) {
              step.classList.toggle("is-live", i <= index);
            });
            window.dispatchEvent(
              new CustomEvent("hbc:process-progress", {
                detail: {
                  progress: self.progress,
                  locked: Boolean(demo && demo.dataset.locked),
                  mode: demo ? demo.dataset.mode : "before",
                },
              })
            );
          },
        });
      }

      if (demo && typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.create({
          trigger: ".hero",
          start: "top 40%",
          end: "bottom 35%",
          onLeave: function () {
            if (demo.dataset.locked) return;
            setMode("after", false);
          },
          onEnterBack: function () {
            if (demo.dataset.locked) return;
            setMode("before", false);
          },
        });
      }

      document.fonts.ready.then(function () {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      });
    });
  }

  bindControls();
  bindFields();
  setMode("before", false);
  setupMotion();

  reduceMotion.addEventListener("change", function () {
    if (hasGsap && typeof gsap.matchMediaRefresh === "function") {
      gsap.matchMediaRefresh();
    }
  });
})();
