import type { Metadata } from "next";
import { AssistPane } from "@/components/assist/AssistPane";

export const metadata: Metadata = {
  title: "Assist Pane — Hambrick & Co. drafts",
};

export default function Page() {
  return <AssistPane />;
}
