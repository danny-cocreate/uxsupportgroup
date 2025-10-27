import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CommunitySponsorshipSection = () => {
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

  const quarterlyFeatures = [
    { text: "3 Monthly Workshops", bold: true, subtitle: "(co-facilitated with Danny)" },
    { text: "Full Video Rights", bold: true, subtitle: "for all content" },
    { text: "Dedicated Landing Page", bold: true, subtitle: "on uxsupportgroup.com" },
    { text: "Slack Community Access", bold: true, subtitle: "(office hours + AMA channel)" },
    { text: "Logo Placements", bold: true, subtitle: "(website + events)" },
    { text: "Custom Promo Code", bold: true, subtitle: "for tracking" },
    { text: "Category Exclusivity", bold: true, subtitle: "(3-month lock-out)" },
    { text: "Performance Guarantee:", bold: true, subtitle: "50+ trials or 25% discount" }
  ];

  const annualFeatures = [
    { text: "12 Monthly Workshops", bold: true, subtitle: "(co-facilitated with Danny)" },
    { text: "Full Video Rights", bold: true, subtitle: "for all content" },
    { text: "Dedicated Landing Page", bold: true, subtitle: "with resource library" },
    { text: "Advisory Board", bold: true, subtitle: "(quarterly feedback from 5-7 power users)" },
    { text: "Slack Community Access", bold: true, subtitle: "(office hours + AMA channel)" },
    { text: "Summit Sponsorship Included", bold: true, subtitle: "($3,500 value)" },
    { text: "Category Exclusivity", bold: true, subtitle: "(annual lock-out)" },
    { text: "4 Co-Created Templates", bold: true, subtitle: "for the community" },
    { text: "Performance Guarantee:", bold: true, subtitle: "200+ trials or discount" }
  ];

  const comparisonData = [
    { feature: "Monthly Workshops", quarterly: "3", annual: "12" },
    { feature: "Video Rights", quarterly: "✓", annual: "✓" },
    { feature: "Slack Community Access", quarterly: "✓", annual: "✓" },
    { feature: "Advisory Board", quarterly: "—", annual: "✓ (4x/yr)" },
    { feature: "Summit Sponsorship", quarterly: "—", annual: "✓ Included" },
    { feature: "Co-Created Templates", quarterly: "—", annual: "✓ (4)" },
    { feature: "Category Exclusivity", quarterly: "3 months", annual: "12 months" },
    { feature: "Price per Month", quarterly: "~$1,667", annual: "~$1,417" }
  ];

  return (
    <>
      {/* Section Header */}
      <section id="community" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Community <span className="text-gradient">Sponsorship</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Ongoing partnership with workshops, content, and community access
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Quarterly Package */}
            <Card className="p-8 relative overflow-hidden border-2 border-border hover:border-primary/50 transition-colors">
              <div className="mb-6 pb-6 border-b-2 border-dashed border-border">
                <h3 className="text-2xl font-bold mb-3 uppercase">Quarterly Partnership</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-foreground">$5,000</span>
                  <span className="text-lg text-muted-foreground">/ 3 months</span>
                </div>
              </div>
              
              <p className="font-semibold mb-6 text-lg">Test the channel with low commitment</p>
              
              <ul className="space-y-3 mb-8">
                {quarterlyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm border-b border-border/50 pb-3 last:border-0">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{feature.text}</strong> {feature.subtitle}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full h-12 text-base font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group uppercase" 
                onClick={() => scrollToContact('Quarterly Partnership - $5,000')}
              >
                Select Quarterly
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Annual Package (Featured) */}
            <Card className="p-8 relative overflow-hidden border-4 border-primary shadow-2xl">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-secondary text-white px-6 py-2 text-xs font-bold rounded-bl-2xl uppercase">
                Save $3,000
              </div>
              
              <div className="mb-6 pb-6 border-b-2 border-dashed border-border mt-4">
                <h3 className="text-2xl font-bold mb-3 uppercase">Annual Partnership</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-foreground">$17,000</span>
                  <span className="text-lg text-muted-foreground">/ 12 months</span>
                </div>
                <p className="text-sm text-muted-foreground">vs $20,000 quarterly rate</p>
              </div>
              
              <p className="font-semibold mb-6 text-lg">Full-funnel integration from trial → activation</p>
              
              <ul className="space-y-3 mb-8">
                {annualFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm border-b border-border/50 pb-3 last:border-0">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{feature.text}</strong> {feature.subtitle}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full h-12 text-base font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group uppercase" 
                onClick={() => scrollToContact('Annual Partnership - $17,000')}
              >
                Select Annual
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </div>

          {/* Comparison Table */}
          <div className="max-w-6xl mx-auto mt-12">
            <Accordion type="single" collapsible className="bg-background border-2 border-border rounded-xl overflow-hidden">
              <AccordionItem value="comparison" className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left uppercase font-bold">
                  <span>Compare Quarterly vs Annual</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-foreground text-background">
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Feature</th>
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Quarterly</th>
                          <th className="border-2 border-foreground p-3 text-left text-xs uppercase">Annual</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((row, index) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="border-2 border-border p-3 text-sm font-medium">{row.feature}</td>
                            <td className="border-2 border-border p-3 text-sm text-center">{row.quarterly}</td>
                            <td className="border-2 border-border p-3 text-sm text-center font-bold">{row.annual}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Custom Plan */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <Card className="p-8 border-2 border-dashed border-border bg-muted/30">
              <h3 className="text-xl font-bold mb-3 uppercase">Need Something Different?</h3>
              <p className="text-muted-foreground mb-6">
                Build a custom partnership with flexible terms, adjusted workshop frequency, or unique add-ons tailored to your goals.
              </p>
              <Button 
                variant="outline"
                className="font-bold uppercase group border-2"
                onClick={() => scrollToContact('Custom Partnership')}
              >
                Discuss Custom Partnership
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommunitySponsorshipSection;

