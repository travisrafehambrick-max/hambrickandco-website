(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const path = document.getElementById("signal-path");
  const dead = document.getElementById("line-dead");
  const live = document.getElementById("line-live");
  const form = document.getElementById("lead-form");
  const confirm = document.getElementById("form-confirm");
  const hasGsap = typeof gsap !== "undefined";

  function recovered() {
    document.body.classList.add("is-recovered");
    if (path) path.style.strokeDashoffset = "0";
    if (dead) {
      dead.style.opacity = "0.22";
      dead.style.textDecoration = "line-through";
      dead.style.textDecorationColor = "#c4a574";
    }
    if (live) {
      live.style.opacity = "1";
      live.style.position = "static";
    }
  }

  function bindCommit() {
    if (!hasGsap || reduce.matches) return;
    document.querySelectorAll(".commit").forEach(function (el) {
      el.addEventListener("pointerdown", function () {
        gsap.to(el, { scale: 0.98, duration: 0.12, ease: "power2.out", overwrite: "auto" });
      });
      el.addEventListener("pointerup", function () {
        gsap.to(el, { scale: 1, duration: 0.18, ease: "power2.out", overwrite: "auto" });
      });
      el.addEventListener("pointerleave", function () {
        gsap.to(el, { scale: 1, duration: 0.18, ease: "power2.out", overwrite: "auto" });
      });
    });
  }

  function playSignal() {
    if (!hasGsap || !path || !dead || !live) {
      recovered();
      return;
    }
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(live, { autoAlpha: 0, position: "absolute" });
    gsap.set(dead, { autoAlpha: 1 });
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(path, { strokeDashoffset: 0, duration: 0.9 }, 0.15);
    tl.to(dead, { autoAlpha: 0.22, duration: 0.28 }, 0.7);
    tl.add(function () {
      dead.style.textDecoration = "line-through";
      dead.style.textDecorationColor = "#c4a574";
    });
    tl.fromTo(live, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.32, position: "static" }, 0.82);
    tl.add(function () {
      document.body.classList.add("is-recovered");
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = (document.getElementById("name") || {}).value || "";
      const shop = (document.getElementById("biz") || {}).value || "";
      const reach = (document.getElementById("reach") || {}).value || "";
      const enquiries = (document.getElementById("enquiries") || {}).value || "";
      const subject = shop ? "Recovery audit — " + shop : "Recovery audit";
      const lines = [];
      if (name) lines.push("Name: " + name);
      if (shop) lines.push("Business: " + shop);
      if (reach) lines.push("Email or phone: " + reach);
      if (enquiries) lines.push("How enquiries arrive: " + enquiries);
      window.location.href =
        "mailto:hello@hambrickco.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
      if (confirm) confirm.hidden = false;
    });
  }

  bindCommit();
  if (reduce.matches) recovered();
  else playSignal();
  reduce.addEventListener("change", function () {
    if (reduce.matches) recovered();
  });
})();
