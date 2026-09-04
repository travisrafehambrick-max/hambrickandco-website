import type { Metadata } from "next";
import { SignatureReel } from "@/components/reel/SignatureReel";

export const metadata: Metadata = {
  title: "Signature Reel — Hambrick & Co. drafts",
};

export default function Page() {
  return <SignatureReel />;
}
