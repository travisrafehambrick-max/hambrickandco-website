/**
 * CANONICAL for this Assist Pane pass (hero / problem / offer stack / proof / CTA).
 * Harcourt text — use verbatim. Do not rewrite into a gallery or process-meta.
 * Stonefield Landscaping is named proof of work only. No invented quotes.
 */
export const HERO_HEADLINE =
  "Every missed call and unanswered estimate is money walking out the door.";

export const HERO_SUB =
  "Hambrick & Co installs the systems that catch leads, close follow-ups, and fill the calendar — for local businesses within 40 miles of Charlottesville.";

export const CTA_TALK = "Talk to Travis";
export const CTA_AUDIT = "Request a recovery audit";
export const CTA_BOOK = "Book a short call with Travis";
export const AREA_CLOSE = "Charlottesville + 40 miles";

export const PROBLEM_LEAD = "You already pay for the phone to ring and the quote to go out. What you don't catch:";

export const PROBLEM_LEAKS = [
  "Calls that go to voicemail after hours — and never call back",
  "Estimates sitting unanswered while the job goes to whoever replied first",
  "No-shows that burn a crew day",
  "Reviews you never asked for — and the ones you did get, lost in the inbox",
] as const;

export const PROBLEM_CLOSE = "That isn't a marketing problem. It's revenue on the table.";

export const OFFER_LEAD = "Start with the leak that costs the most. Then harden the rest.";

export const OFFER_STACK = [
  {
    n: "1",
    name: "Lead Response",
    line: "Missed calls and new inquiries answered fast, every time",
    wedge: true,
  },
  {
    n: "2",
    name: "Estimate Recovery",
    line: "Quote follow-up until they book, decline, or ask for a change",
    wedge: true,
  },
  {
    n: "3",
    name: "Booking & No-Show Reduction",
    line: "Confirmations and reminders that protect the schedule",
    wedge: false,
  },
  {
    n: "4",
    name: "Review & Reputation",
    line: "Ask at the right moment; route the feedback",
    wedge: false,
  },
  {
    n: "5",
    name: "Inbox & FAQ Triage",
    line: "Routine questions handled so you stay on the work",
    wedge: false,
  },
] as const;

export const OFFER_WEDGE = "First wedge: Lead Response & Estimate Recovery.";

export const PROOF_BODY =
  "Live with local operators — including Stonefield Landscaping — where the work is catching revenue that used to slip through, not adding another dashboard.";

export const PROOF_TRAVIS = "Travis is your human bridge: setup, handoff, and final say.";

export const CLOSE_HEADLINE = "If leads and estimates are leaking, let's plug the expensive ones first.";
