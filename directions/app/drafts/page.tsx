import type { Metadata } from "next";
import { HubIndex } from "@/components/hub/HubIndex";

export const metadata: Metadata = {
  title: "Parked drafts — Hambrick & Co.",
  description: "Parked direction halls. The client-facing site is Assist Pane at /.",
};

export default function Page() {
  return <HubIndex />;
}
