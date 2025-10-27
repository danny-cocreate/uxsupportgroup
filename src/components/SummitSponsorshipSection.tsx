import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SummitSponsorshipSection = () => {
  const scrollToContact = (packageName: string) => {
    document.querySelector('#contact')?.scrollIntoView({
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      const packageSelect = document.getElementById('package') as HTMLSelectElement;
      if (packageSelect) {
        packageSelect.value = packageName;
      }
    }, 500);
  };

  const bronzeFeatures = [
    "15-Min Demo Session",
    "Logo Placement",
    "Basic Attendee List",
    "60-Day Trial Offer",
    "Post-Event Email",
    "Video Rights"
  ];

  const silverFeatures = [
    "Everything in Bronze",
    "30-Min Demo + Q&A",
    "Virtual Booth/Room",
    "Pre-Event Email",
    "Premium Logo",
    "Opt-In Contact List"
  ];

  const goldFeatures = [
    "Everything in Silver",
    "Keynote Speaking Slot",
    "Panel Participation",
    "Full Contact List",
    "Pre + Post Campaigns",
    "Category Exclusivity"
  ];

  const comparisonData = [
    { feature: "Demo Session", bronze: "15 min", silver: "30 min", gold: "30 min" },
    { feature: "Speaking/Keynote", bronze: "—", silver: "—", gold: "✓" },
    { feature: "Virtual Booth", bronze: "—", silver: "✓", gold: "✓" },
    { feature: "Pre-Event Email", bronze: "—", silver: "✓", gold: "✓✓" },
    { feature: "Attendee List", bronze: "Basic", silver: "Opt-in", gold: "Full" },
    { feature: "Category Exclusivity", bronze: "—", silver: "—", gold: "✓" }
  ];

  return (
    <>
      {/* Section Header */}
      <section id="summit" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Summit <span className="text-gradient">Sponsorship</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              One-day virtual event for senior UX professionals & decision-makers
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Bronze */}
            <Card className="p-6 relative overflow-hidden border-2 border-border hover:border-primary/50 transition-colors">
              <div className="mb-6 pb-6 border-b-2 border-dashed border-border">
                <h3 className="text-xl font-bold mb-3 uppercase">Bronze</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-foreground">$2,500</span>
                </div>
                <p className="text-sm text-muted-foreground uppercase">One-Time</p>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[240px]">
                {bronzeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant="outline"
                className="w-full h-12 text-sm font-bold uppercase group border-2" 
                onClick={() => scrollToContact('Summit Bronze - $2,500')}
              >
                Select Bronze
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Silver (Featured) */}
            <Card className="p-6 relative overflow-hidden border-4 border-primary shadow-2xl md:scale-105">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-secondary text-white px-4 py-2 text-xs font-bold rounded-bl-2xl uppercase">
                Most Popular
              </div>
              
              <div className="mb-6 pb-6 border-b-2 border-dashed border-border mt-4">
                <h3 className="text-xl font-bold mb-3 uppercase">Silver</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-foreground">$3,500</span>
                </div>
                <p className="text-sm text-muted-foreground uppercase">One-Time</p>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[240px]">
                {silverFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className={index === 0 ? "font-bold" : ""}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full h-12 text-sm font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group uppercase" 
                onClick={() => scrollToContact('Summit Silver - $3,500')}
              >
                Select Silver
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Gold */}
            <Card className="p-6 relative overflow-hidden border-2 border-border hover:border-primary/50 transition-colors">
              <div className="mb-6 pb-6 border-b-2 border-dashed border-border">
                <h3 className="text-xl font-bold mb-3 uppercase">Gold</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-foreground">$5,500</span>
                </div>
                <p className="text-sm text-muted-foreground uppercase">One-Time</p>
              </div>
              
              <ul className="space-y-3 mb-8 min-h-[240px]">
                {goldFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className={index === 0 ? "font-bold" : ""}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant="outline"
                className="w-full h-12 text-sm font-bold uppercase group border-2" 
                onClick={() => scrollToContact('Summit Gold - $5,500')}
              >
                Select Gold
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </div>

          {/* Comparison Table */}
          <div className="max-w-6xl mx-auto mt-12">
            <Accordion type="single" collapsible className="bg-card border-2 border-border rounded-xl overflow-hidden">
              <AccordionItem value="comparison" className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left uppercase font-bold">
                  <span>Compare Summit Tiers</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-foreground text-background">
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Feature</th>
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Bronze</th>
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Silver</th>
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Gold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((row, index) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="border-2 border-border p-3 text-sm font-medium">{row.feature}</td>
                            <td className="border-2 border-border p-3 text-sm text-center">{row.bronze}</td>
                            <td className="border-2 border-border p-3 text-sm text-center">{row.silver}</td>
                            <td className="border-2 border-border p-3 text-sm text-center font-bold">{row.gold}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
};

export default SummitSponsorshipSection;

