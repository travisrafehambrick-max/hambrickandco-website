import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import Capabilities from "@/components/Capabilities";
import WhyUs from "@/components/WhyUs";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Method />
        <Capabilities />
        <WhyUs />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
