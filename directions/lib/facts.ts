export const COMPANY = "Hambrick & Co.";
export const EMAIL = "hello@hambrickco.com";
export const PHONE = "(434) 260-0823";
export const PHONE_HREF = "tel:+14342600823";
export const AREA = "Charlottesville, Virginia, and a 40-mile radius";
export const WEDGE = "Lead Response & Estimate Recovery";

export const CTA_AUDIT = "Request a recovery audit";
export const CTA_FLOW = "See the recovery flow";

export function auditMailto(name: string, trade: string, note: string) {
  const subject = encodeURIComponent("Recovery audit request");
  const body = encodeURIComponent(
    [name && `Name: ${name}`, trade && `Work: ${trade}`, note && `Note:\n${note}`]
      .filter(Boolean)
      .join("\n"),
  );
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export const DIRECTIONS = [
  {
    n: "01",
    slug: "society-hall",
    name: "Society Hall",
    carrier: "Gold signal line",
    line: "Kinetic manifesto. A hall of theses. The line is the membership.",
  },
  {
    n: "02",
    slug: "solid-proof",
    name: "Solid Proof",
    carrier: "Board tickets dead→alive",
    line: "Product-proof strip. Dead tickets stay matte. Live ones carry gold.",
  },
  {
    n: "03",
    slug: "signature-reel",
    name: "Signature Reel",
    carrier: "Chapter still mid-pin",
    line: "Editorial spread. One still holds the chapter while copy slides.",
  },
  {
    n: "04",
    slug: "balance-object",
    name: "Balance Object",
    carrier: "Quote slip",
    line: "Airy field. One soft object. A paper slip is the current.",
  },
  {
    n: "05",
    slug: "assist-pane",
    name: "Assist Pane",
    carrier: "Phone sheet peel",
    line: "List left, one sheet right. Landmarks swap the peel.",
  },
] as const;
