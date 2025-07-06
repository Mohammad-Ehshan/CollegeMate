import Navbar from "@/components/Navbar";
import { HeroSection } from "./_Component/Hero";
// import { FormSection } from "./_Component/FormSection";
import { RecentItemsGrid } from "./_Component/Recent-Items-Grids";
import { HowItWorks } from "./_Component/HowItWorks";
import { FeatureHighlights } from "./_Component/FeatureHIghlights";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#D4F9EB] to-[#E8FFF6]">
      <Navbar/>
      <HeroSection />
      <RecentItemsGrid />
      <HowItWorks/>
      <FeatureHighlights/>
      <Footer/>
    </main>
  )
}