(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const form = document.getElementById("lead-form");
  const confirm = document.getElementById("form-confirm");
  const status = document.getElementById("diag-status");
  const copy = document.getElementById("diag-copy");
  const hasGsap = typeof gsap !== "undefined";

  function setLabels(after) {
    if (status) status.textContent = after ? "State: recovered" : "State: missed";
    if (copy) {
      copy.textContent = after
        ? "Text sent. Job asked. Booking offered. The sheet is off the thread."
        : "Unread call. Estimate sitting. Scroll peels the dead sheet off the recovered thread.";
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

  function setupPeelScroll() {
    if (!hasGsap || reduce.matches || typeof ScrollTrigger === "undefined") {
      setLabels(true);
      window.dispatchEvent(new CustomEvent("hbc:peel-progress", { detail: { progress: 1, reduced: true } }));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: "#machine",
      start: "top top",
      end: "+=100%",
      pin: true,
      pinSpacing: true,
      onUpdate: function (self) {
        const after = self.progress > 0.55;
        setLabels(after);
        window.dispatchEvent(
          new CustomEvent("hbc:peel-progress", {
            detail: { progress: self.progress, reduced: false },
          })
        );
      },
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
  setupPeelScroll();
  reduce.addEventListener("change", function () {
    if (reduce.matches) {
      setLabels(true);
      window.dispatchEvent(new CustomEvent("hbc:peel-progress", { detail: { progress: 1, reduced: true } }));
    }
  });
})();
