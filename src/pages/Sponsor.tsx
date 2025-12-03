import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SponsorHero from "@/components/SponsorHero";
import SponsorValueProposition from "@/components/SponsorValueProposition";
import CommunitySponsorshipSection from "@/components/CommunitySponsorshipSection";
import SummitSponsorshipSection from "@/components/SummitSponsorshipSection";
import SponsorContactSection from "@/components/SponsorContactSection";

const Sponsor = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <SponsorHero />
        <SponsorValueProposition />
        <CommunitySponsorshipSection />
        <SummitSponsorshipSection />
        <SponsorContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Sponsor;
