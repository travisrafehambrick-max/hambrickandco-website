import type { Metadata } from "next";
import { BalancePage } from "@/components/balance/BalancePage";

export const metadata: Metadata = {
  title: "Balance Object — Hambrick & Co. drafts",
};

export default function Page() {
  return <BalancePage />;
}
