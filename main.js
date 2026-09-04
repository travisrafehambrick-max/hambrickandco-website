(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const demo = document.getElementById("enquiry-demo");
  const beforeBtn = document.getElementById("btn-before");
  const afterBtn = document.getElementById("btn-after");
  const beforePane = document.getElementById("pane-before");
  const afterPane = document.getElementById("pane-after");
  const urlbar = document.getElementById("demo-url");
  const form = document.getElementById("lead-form");
  const formConfirm = document.getElementById("form-confirm");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const hasGsap = typeof gsap !== "undefined";

  function prefersReduced() {
    return reduceMotion.matches;
  }

  function dispatchMode(mode) {
    window.dispatchEvent(new CustomEvent("hbc:timeline-mode", { detail: mode }));
  }

  function playPane(pane, after) {
    if (!pane) return;
    const rows = pane.querySelectorAll(".enquiry-row");
    const chips = pane.querySelectorAll(".enquiry-state, .flip-word");
    if (!hasGsap || prefersReduced()) {
      rows.forEach(function (row) {
        row.style.opacity = after ? "1" : "0.58";
        row.style.transform = "none";
      });
      chips.forEach(function (chip) {
        chip.style.opacity = "1";
        chip.style.transform = "none";
      });
      return;
    }
    if (after) {
      gsap.fromTo(
        rows,
        { y: 6, autoAlpha: 0.55 },
        { y: 0, autoAlpha: 1, duration: 0.18, stagger: 0.035, ease: "power2.out", overwrite: true }
      );
      gsap.fromTo(
        chips,
        { y: 4, autoAlpha: 0.45 },
        { y: 0, autoAlpha: 1, duration: 0.18, stagger: 0.03, ease: "power2.out", overwrite: true }
      );
    } else {
      gsap.fromTo(
        rows,
        { y: 0, autoAlpha: 1 },
        { y: 3, autoAlpha: 0.58, duration: 0.16, stagger: 0.03, ease: "power2.out", overwrite: true }
      );
    }
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
      const host = after ? afterBtn : beforeBtn;
      if (pill && pill.parentElement !== host) host.prepend(pill);
    }
    playPane(after ? afterPane : beforePane, after);
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

  function bindCommitment() {
    if (!hasGsap || prefersReduced()) return;
    document.querySelectorAll(".commit").forEach(function (el) {
      el.addEventListener("pointerdown", function () {
        gsap.to(el, { scale: 0.98, duration: 0.12, ease: "power2.out", overwrite: "auto" });
      });
      el.addEventListener("pointerup", function () {
        gsap.to(el, { scale: 1, duration: 0.16, ease: "power2.out", overwrite: "auto" });
      });
      el.addEventListener("pointerleave", function () {
        gsap.to(el, { scale: 1, duration: 0.16, ease: "power2.out", overwrite: "auto" });
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
      if (formConfirm) formConfirm.hidden = false;
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

  function setupRevivalScroll() {
    if (!hasGsap || prefersReduced() || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: "#process",
      start: "top 70%",
      end: "bottom 40%",
      onUpdate: function (self) {
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

  bindCommitment();
  bindFields();
  setMode(prefersReduced() ? "after" : "before", false);
  setupRevivalScroll();
})();
