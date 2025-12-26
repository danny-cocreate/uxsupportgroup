import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import ConceptSection from "@/components/ConceptSection";
import AgendaSection from "@/components/AgendaSection";
import ProfileCallout from "@/components/ProfileCallout";
import SummitSponsorshipInquiry from "@/components/SummitSponsorshipInquiry";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Summit = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ConceptSection />
        <SocialProof />
        <AgendaSection />
        <ProfileCallout />
        <SummitSponsorshipInquiry />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Summit;