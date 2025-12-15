
import { HeroSection } from "@/components/HeroSection";
import { PromoSection } from "@/components/PromoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PrivacySection } from "@/components/PrivacySection";
import { HowToUseSection } from "@/components/HowToUseSection";
import { ScreenshotsSection } from "@/components/ScreenshotsSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #0a0f1e 0%, #0f172a 50%, #0a0f1e 100%)' }}>
      <HeroSection />
      <PromoSection />
      <FeaturesSection />
      <PrivacySection />
      <HowToUseSection />
      <ScreenshotsSection />
      <ContactSection />
    </main>
  );
}
