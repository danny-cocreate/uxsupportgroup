import hubbleLogo from "@/assets/hubble-logo.png";
import cocreateLogo from "@/assets/cocreate-logo.png";
import kommodoLogo from "@/assets/kommodo-logo.png";
import subframeLogo from "@/assets/subframe-logo.png";

const SummitSponsorshipInquiry = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-muted">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground text-center">
            Thank You to Our Sponsors
          </h2>
          
          {/* Logos - Full Width */}
          <div className="flex items-center justify-center gap-12 flex-wrap">
            <img src={hubbleLogo} alt="Hubble" className="h-14 object-contain grayscale hover:grayscale-0 transition-all" />
            <img src={cocreateLogo} alt="CoCreate" className="h-32 object-contain grayscale hover:grayscale-0 transition-all" />
            <img src={kommodoLogo} alt="Kommodo" className="h-14 object-contain grayscale hover:grayscale-0 transition-all" />
            <img src={subframeLogo} alt="Subframe" className="h-14 object-contain grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummitSponsorshipInquiry;