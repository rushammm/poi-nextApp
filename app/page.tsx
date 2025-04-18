import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import POIMap from "./components/POIMap";
import TeamSection from "./components/TeamSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeatureSection />
      <POIMap />
      <TeamSection />
    </main>
  );
}
