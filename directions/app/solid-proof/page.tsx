import type { Metadata } from "next";
import { SolidProof } from "@/components/proof/SolidProof";

export const metadata: Metadata = {
  title: "Solid Proof — Hambrick & Co. drafts",
};

export default function Page() {
  return <SolidProof />;
}
