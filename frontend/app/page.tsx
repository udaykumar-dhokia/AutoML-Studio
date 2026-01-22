import Announcement from "@/components/custom/Announcement";
import Footer from "@/components/custom/Footer";
import Header from "@/components/custom/Header";
import Hero from "@/components/custom/Hero";
import FeaturesSectionDemo from "@/components/ui/features-section-demo-2";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

const page = () => {
  return (
    <>
      <div className="flex flex-col justify-center mx-auto max-w-5xl border-r border-l border-dashed border-primary/20">
        <Header />
        <Announcement />
        <Hero />
        <FeaturesSectionDemo />
        <div className="h-80 flex items-center justify-center">
          <TextHoverEffect text="AutoML Studio" />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default page;
