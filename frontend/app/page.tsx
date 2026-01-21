import Announcement from "@/components/custom/Announcement";
import Header from "@/components/custom/Header";
import Hero from "@/components/custom/Hero";

const page = () => {
  return (
    <>
      <div className="flex flex-col justify-center mx-auto max-w-5xl border-r border-l border-dashed border-primary/20">
        <Header />
        <Announcement />
        <Hero />
      </div>
    </>
  );
};

export default page;
