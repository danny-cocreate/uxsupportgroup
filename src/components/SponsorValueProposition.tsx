import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target } from "lucide-react";

const SponsorValueProposition = () => {
  const comparisonData = [
    { metric: "Avg. Lead Conversion", uxsg: "~5%", instagram: "~1.5%" },
    { metric: "Lead Quality", uxsg: "High-intent, product-educated", instagram: "Mixed intent" },
    { metric: "Typical B2B ROI", uxsg: "3–8x", instagram: "4–5x (lower quality)" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why B2B SaaS Teams Choose{" "}
              <span className="text-gradient">Community Sponsorship</span>{" "}
              Over Paid Social
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Workshop leads convert at 3x the rate of paid social—because they've already 
              experienced your product in context with guidance from peers they trust.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center border-2 border-border hover:border-primary/50 transition-colors">
              <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-foreground mb-2">3–8x</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                Typical Event ROI
              </div>
            </Card>
            <Card className="p-6 text-center border-2 border-border hover:border-primary/50 transition-colors">
              <Target className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-foreground mb-2">~5%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                Avg. Lead Conversion
              </div>
            </Card>
            <Card className="p-6 text-center border-2 border-border hover:border-primary/50 transition-colors">
              <Users className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-foreground mb-2">59%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                Senior+ Decision Makers
              </div>
            </Card>
          </div>

          {/* Comparison Table */}
          <Card className="overflow-hidden border-2 border-border mb-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-foreground text-background">
                    <th className="p-4 text-left text-xs uppercase font-bold">Metric</th>
                    <th className="p-4 text-left text-xs uppercase font-bold">UXSG Workshop</th>
                    <th className="p-4 text-left text-xs uppercase font-bold">Instagram Ads</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4 text-sm font-medium">{row.metric}</td>
                      <td className="p-4 text-sm font-bold text-primary">{row.uxsg}</td>
                      <td className="p-4 text-sm text-muted-foreground">{row.instagram}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Callout Box */}
          <Card className="p-6 bg-primary/5 border-2 border-primary/20">
            <p className="text-center text-foreground">
              <span className="font-bold">Unlike paid social</span> where spend often hits low-intent audiences, 
              workshop leads have already engaged with your product in context—driving{" "}
              <span className="font-bold text-primary">3x higher conversion rates</span> and{" "}
              <span className="font-bold text-primary">higher lifetime value</span>.
            </p>
          </Card>

          {/* Citations */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              ROI benchmarks from B2B marketing industry reports.{" "}
              <a 
                href="https://www.data-mania.com/blog/b2b-marketing-roi-benchmarks-2025/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                [1]
              </a>{" "}
              <a 
                href="https://martal.ca/b2b-digital-marketing-benchmarks-lb/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                [2]
              </a>{" "}
              <a 
                href="https://www.lomitpatel.com/articles/saas-event-sponsorship-roi/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                [3]
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorValueProposition;
