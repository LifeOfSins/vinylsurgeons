import Image from "next/image";
import HeroSection from "@/components/hero-section";
import AboutCoach from "@/components/about";
import Services from "@/components/services";
import ContactSection from "@/components/contact"
import FAQs from "@/components/faqs";
import FooterSection from "@/components/footer"

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutCoach />
      <Services />
      <ContactSection />
      <FAQs />
      <FooterSection />
    </>
  );
}
