import Header from "@/components/Header";
import SummitBanner from "@/components/SummitBanner";
import HomeHero from "@/components/HomeHero";
import HomeStats from "@/components/HomeStats";
import WhatWeOffer from "@/components/WhatWeOffer";
import UpcomingEvents from "@/components/UpcomingEvents";
import PastEvents from "@/components/PastEvents";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SummitBanner />
      <Header />
      <main>
        <HomeHero />
        <HomeStats />
        <WhatWeOffer />
        <UpcomingEvents />
        <PastEvents />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
