// Progressive enhancements for the Hambrick & Co. landing page.

document.addEventListener("DOMContentLoaded", () => {
  // Keep the footer copyright year current.
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Simple call-to-action interaction to confirm scripts are wired up.
  const cta = document.getElementById("cta");
  const message = document.getElementById("cta-message");
  if (cta && message) {
    cta.addEventListener("click", () => {
      message.textContent =
        "Thanks! Email us at hello@hambrickandco.example and we'll reply within a day.";
    });
  }
});
