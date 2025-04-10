import Benefits from "@/components/Benefits";
import DemoPreview from "@/components/DemoPreview";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/How-It-Works";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonial";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      <Navbar />
      <Hero />
      <Features />
      <DemoPreview />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <Footer/>
    </div>
  );
}
