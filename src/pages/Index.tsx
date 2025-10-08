import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import ConceptSection from "@/components/ConceptSection";
import AgendaSection from "@/components/AgendaSection";
import TicketingSection from "@/components/TicketingSection";
import ProfileCallout from "@/components/ProfileCallout";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <SocialProof />
      <ConceptSection />
      <AgendaSection />
      <TicketingSection />
      <ProfileCallout />
      <FAQSection />
      <Footer />
    </main>
  );
};

export default Index;
