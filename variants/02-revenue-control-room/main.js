(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const board = document.getElementById("board");
  const deadBtn = document.getElementById("btn-dead");
  const liveBtn = document.getElementById("btn-live");
  const form = document.getElementById("lead-form");
  const confirm = document.getElementById("form-confirm");
  const hasGsap = typeof gsap !== "undefined";

  const copy = {
    dead: {
      call: ["Missed call", "Tue 10:42 · they rang about the quote. Voicemail sitting.", "No reply"],
      est: ["Quote sitting", "Deck repair sent Monday. No follow-up scheduled.", "Dead thread"],
      own: ["Not in the thread", "On a roof. The call did not reach the phone that books work.", "Out of loop"],
    },
    live: {
      call: ["Text sent", "Job asked. Booking offered. Thread in front of the owner.", "Answered"],
      est: ["Follow-up live", "Same job. Timed nudge. Stops the moment they reply.", "Alive"],
      own: ["In the thread", "The owner sees the job while still on the roof.", "In loop"],
    },
  };

  const nodes = {
    call: ["call-title", "call-copy", "call-chip"],
    est: ["est-title", "est-copy", "est-chip"],
    own: ["own-title", "own-copy", "own-chip"],
  };

  function write(state) {
    const pack = copy[state];
    Object.keys(nodes).forEach(function (key) {
      nodes[key].forEach(function (id, i) {
        const el = document.getElementById(id);
        if (el) el.textContent = pack[key][i];
      });
    });
    if (board) board.dataset.state = state;
    if (deadBtn && liveBtn) {
      deadBtn.setAttribute("aria-pressed", state === "dead" ? "true" : "false");
      liveBtn.setAttribute("aria-pressed", state === "live" ? "true" : "false");
    }
  }

  function setState(state, animate) {
    if (!board) return;
    write(state);
    if (!animate || !hasGsap || reduce.matches) return;
    const tickets = board.querySelectorAll(".ticket");
    gsap.fromTo(
      tickets,
      { autoAlpha: state === "live" ? 0.7 : 1 },
      {
        autoAlpha: state === "live" ? 1 : 0.72,
        duration: 0.18,
        stagger: 0.05,
        ease: "power2.out",
        overwrite: true,
      }
    );
  }

  if (deadBtn) {
    deadBtn.addEventListener("click", function () {
      setState("dead", true);
      board.dataset.locked = "1";
    });
  }
  if (liveBtn) {
    liveBtn.addEventListener("click", function () {
      setState("live", true);
      board.dataset.locked = "1";
    });
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
  if (reduce.matches) {
    setState("live", false);
  } else {
    setState("dead", false);
    window.setTimeout(function () {
      if (board && board.dataset.locked) return;
      setState("live", true);
    }, 700);
  }
  reduce.addEventListener("change", function () {
    if (reduce.matches) setState("live", false);
  });
})();
