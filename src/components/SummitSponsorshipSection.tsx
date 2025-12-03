import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const SummitSponsorshipSection = () => {
  const scrollToContact = (packageName: string) => {
    // Update URL with selected package
    const url = new URL(window.location.href);
    url.searchParams.set('package', packageName);
    window.history.replaceState({}, '', url);

    // Scroll to contact form
    document.querySelector('#contact')?.scrollIntoView({
      behavior: 'smooth'
    });

    // Dispatch custom event to notify form component
    window.dispatchEvent(new CustomEvent('packageSelected', {
      detail: packageName
    }));
  };
  const standardFeatures = ["Give away up to 100 free credits to engaged UX professionals", "Sponsor logo on summit page", "Featured in post-event attendee emails"];
  const boothFeatures = ["Everything in Standard (Free) tier", "Dedicated 45-minute branded breakout room", "Live demo, walkthrough, or AMA during lunch/networking block", "Priority listing as 'Featured Sponsor' on summit page", "Lead/attendee opt-ins from your session", "Enhanced brand presence across all channels"];
  const comparisonData = [{
    feature: "Free Credit Giveaway",
    standard: "Up to 100",
    booth: "Up to 100",
    custom: "Custom"
  }, {
    feature: "Logo Placement",
    standard: "✓",
    booth: "✓ Featured",
    custom: "✓ Premium"
  }, {
    feature: "Virtual Booth/Breakout",
    standard: "—",
    booth: "45 min",
    custom: "Custom"
  }, {
    feature: "Priority Listing",
    standard: "—",
    booth: "✓",
    custom: "✓"
  }, {
    feature: "Lead Capture",
    standard: "Basic",
    booth: "Full",
    custom: "Enhanced"
  }, {
    feature: "Custom Activations",
    standard: "—",
    booth: "—",
    custom: "✓"
  }];
  return <>
      {/* Section Header */}
      <section id="summit" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              AI Summit <span className="text-gradient">Sponsorship</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-4">
              Meet 100+ UX & AI professionals, founders, and decision-makers from leading design and tech teams at our virtual summit.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Standard (Free) Sponsor */}
            <Card className="p-6 relative overflow-hidden border-2 border-border hover:border-primary/50 transition-colors">
              <div className="mb-6 pb-6 border-b-2 border-dashed border-border">
                <h3 className="text-xl font-bold mb-3 uppercase">Standard Sponsor</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-primary">FREE</span>
                </div>
                <p className="text-sm text-muted-foreground uppercase">For SaaS Companies</p>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[240px]">
                {standardFeatures.map((feature, index) => <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>)}
              </ul>
              
              <Button variant="outline" className="w-full h-12 text-sm font-bold uppercase group border-2" onClick={() => scrollToContact('Standard (Free) Sponsor')}>
                Join as Free Sponsor
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Virtual Booth Add-On (Featured) */}
            <Card className="p-6 relative overflow-hidden border-4 border-primary shadow-2xl md:scale-105">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-secondary text-white px-4 py-2 text-xs font-bold rounded-bl-2xl uppercase">
                Only 10 Available
              </div>
              
              <div className="mb-6 pb-6 border-b-2 border-dashed border-border mt-4">
                <h3 className="text-xl font-bold mb-3 uppercase">Virtual Booth Add-On</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-foreground">$400</span>
                </div>
                <p className="text-sm text-muted-foreground uppercase">Upgrade Package</p>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[240px]">
                {boothFeatures.map((feature, index) => <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className={index === 0 ? "font-bold" : ""}>{feature}</span>
                  </li>)}
              </ul>
              
              <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs font-bold text-center text-primary uppercase">
                  Only 10 available—first come, first served!
                </p>
              </div>
              
              <Button className="w-full h-12 text-sm font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group uppercase" onClick={() => scrollToContact('Virtual Booth Add-On - $400')}>
                Add Virtual Booth
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Custom Package */}
            <Card className="p-6 relative overflow-hidden border-2 border-border hover:border-primary/50 transition-colors">
              <div className="mb-6 pb-6 border-b-2 border-dashed border-border">
                <h3 className="text-xl font-bold mb-3 uppercase">Custom Package</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-foreground">Let's Design It</span>
                </div>
                <p className="text-sm text-muted-foreground uppercase">Tailored Partnership</p>
              </div>
              
              <div className="space-y-4 mb-8 min-h-[240px]">
                <p className="text-sm text-muted-foreground">
                  For companies seeking more exposure or unique partnership ideas:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Hackathon sponsorship</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Have your founder/expert involved
                  </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Special offers & promotions</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Dedicated follow-up demo event</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>And more...</span>
                  </li>
                </ul>
                <p className="text-sm font-semibold text-foreground italic">
                  "Let's create something amazing together—contact us to co-design a custom package!"
                </p>
              </div>
              
              <Button variant="outline" className="w-full h-12 text-sm font-bold uppercase group border-2" onClick={() => scrollToContact('Custom Summit Partnership')}>
                Let's Talk
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </div>

          {/* Comparison Table */}
          <div className="max-w-6xl mx-auto mt-12">
            <Accordion type="single" collapsible className="bg-card border-2 border-border rounded-xl overflow-hidden">
              <AccordionItem value="comparison" className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left uppercase font-bold">
                  <span>Compare Sponsorship Packages</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-foreground text-background">
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Feature</th>
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Standard (Free)</th>
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Virtual Booth ($400)</th>
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Custom</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((row, index) => <tr key={index} className="hover:bg-muted/50">
                            <td className="border-2 border-border p-3 text-sm font-medium">{row.feature}</td>
                            <td className="border-2 border-border p-3 text-sm text-center">{row.standard}</td>
                            <td className="border-2 border-border p-3 text-sm text-center font-bold">{row.booth}</td>
                            <td className="border-2 border-border p-3 text-sm text-center">{row.custom}</td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </>;
};
export default SummitSponsorshipSection;