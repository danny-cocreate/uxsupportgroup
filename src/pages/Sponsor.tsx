import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SponsorHero from "@/components/SponsorHero";
import CommunitySponsorshipSection from "@/components/CommunitySponsorshipSection";
import SummitSponsorshipSection from "@/components/SummitSponsorshipSection";
import SponsorContactSection from "@/components/SponsorContactSection";
import FloatingCTA from "@/components/FloatingCTA";

const Sponsor = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <SponsorHero />
        <CommunitySponsorshipSection />
        <SummitSponsorshipSection />
        <SponsorContactSection />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Sponsor;
