(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const form = document.getElementById("lead-form");
  const confirm = document.getElementById("form-confirm");
  const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  const beats = {
    "ch-1": { start: "Nobody called back.", end: "That miss is the leak." },
    "ch-2": { start: "The phone that books work is in a cupholder. The voicemail is still sitting.", end: "The shop is working. The enquiry is not." },
    "ch-3": { start: "A timed, job-specific nudge. It stops the moment they reply.", end: "The estimate is no longer sitting." },
    "ch-4": { start: "Job asked. Booking offered. The call did not die on the roof.", end: "Recovered. In front of the owner." },
  };

  function endStates() {
    document.body.classList.add("is-reduced");
    Object.keys(beats).forEach(function (id) {
      const node = document.getElementById(id.replace("ch-", "ch") + "-state") || document.querySelector("#" + id + " .state");
      if (node) node.textContent = beats[id].end;
    });
    const ch1 = document.getElementById("ch1-state");
    const ch2 = document.getElementById("ch2-state");
    const ch3 = document.getElementById("ch3-state");
    const ch4 = document.getElementById("ch4-state");
    if (ch1) ch1.textContent = beats["ch-1"].end;
    if (ch2) ch2.textContent = beats["ch-2"].end;
    if (ch3) ch3.textContent = beats["ch-3"].end;
    if (ch4) ch4.textContent = beats["ch-4"].end;
  }

  function pinChapters() {
    if (!hasGsap || reduce.matches) {
      endStates();
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    ["ch-2", "ch-3", "ch-4"].forEach(function (id) {
      const section = document.getElementById(id);
      const state = section ? section.querySelector(".state") : null;
      if (!section || !state) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          scrub: 0.35,
        },
      });
      tl.fromTo(state, { autoAlpha: 0.45, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "none" });
      tl.add(function () {
        state.textContent = beats[id].end;
      }, 0.55);
    });
  }

  function bindCommit() {
    if (typeof gsap === "undefined" || reduce.matches) return;
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
  pinChapters();
  reduce.addEventListener("change", function () {
    if (reduce.matches) {
      if (hasGsap) ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
      endStates();
    }
  });
})();
