import type { Metadata } from "next";
import { SocietyHall } from "@/components/society/SocietyHall";

export const metadata: Metadata = {
  title: "Society Hall — Hambrick & Co. drafts",
};

export default function Page() {
  return <SocietyHall />;
}
