(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const slip = document.getElementById("quote-slip");
  const title = document.getElementById("slip-title");
  const body = document.getElementById("slip-body");
  const end = document.getElementById("slip-end");
  const rule = document.getElementById("slip-rule");
  const form = document.getElementById("lead-form");
  const confirm = document.getElementById("form-confirm");
  const hasGsap = typeof gsap !== "undefined";

  function recovered() {
    document.body.classList.add("is-recovered");
    if (slip) slip.dataset.state = "live";
    if (title) title.textContent = "Deck repair · recovered";
    if (body) body.textContent = "They called Tuesday. The shop texted back. Booking offered.";
    if (end) end.textContent = "Thursday. Job booked.";
    if (rule) rule.style.width = "100%";
  }

  function playSlip() {
    if (!hasGsap || !slip) {
      recovered();
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(rule, { width: 0 }, { width: "100%", duration: 0.7, delay: 0.2 });
    tl.to([title, body, end], { autoAlpha: 0.28, duration: 0.2 }, 0.55);
    tl.add(recovered);
    tl.fromTo([title, body, end], { autoAlpha: 0.28, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.04 });
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
  else playSlip();
  reduce.addEventListener("change", function () {
    if (reduce.matches) recovered();
  });
})();
