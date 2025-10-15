import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import SocialProof from "@/components/SocialProof";
import ConceptSection from "@/components/ConceptSection";
import AgendaSection from "@/components/AgendaSection";
import TicketingSection from "@/components/TicketingSection";
import ProfileCallout from "@/components/ProfileCallout";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
const Summit = () => {
  return <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
      
      <ConceptSection />
      <SocialProof />
      <AgendaSection />
      <TicketingSection />
      <ProfileCallout />
      <FAQSection />
      </main>
      <Footer />
    </div>;
};
export default Summit;