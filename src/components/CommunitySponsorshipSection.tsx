import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Check, Calculator, TrendingUp } from "lucide-react";

const CommunitySponsorshipSection = () => {
  const [arr, setArr] = useState(15000);
  const [conversionRate, setConversionRate] = useState(20);

  const calculations = useMemo(() => {
    const trials = 50;
    const price = 5000;
    const customers = Math.round(trials * (conversionRate / 100));
    const revenue = customers * arr;
    const roi = revenue / price;

    return { trials, customers, revenue, roi, price };
  }, [arr, conversionRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatROI = (value: number) => `${value.toFixed(1)}x`;

  const scrollToContact = (packageName: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('package', packageName);
    window.history.replaceState({}, '', url);
    
    document.querySelector('#contact')?.scrollIntoView({
      behavior: 'smooth'
    });
    
    window.dispatchEvent(new CustomEvent('packageSelected', { detail: packageName }));
  };

  const quarterlyFeatures = [
    { text: "3 Monthly Workshops", subtitle: "(co-facilitated with Danny)" },
    { text: "Full Video Rights", subtitle: "for all content" },
    { text: "Dedicated Landing Page", subtitle: "on uxsupportgroup.com" },
    { text: "Slack Community Access", subtitle: "(office hours + AMA channel)" },
    { text: "Logo Placements", subtitle: "(website + events)" },
    { text: "Custom Promo Code", subtitle: "for tracking" },
    { text: "Category Exclusivity", subtitle: "(3-month lock-out)" },
    { text: "Performance Guarantee:", subtitle: "50+ trials or 25% discount" }
  ];

  return (
    <section id="community" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            Community <span className="text-gradient">Sponsorship</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Ongoing partnership with workshops, content, and community access
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Package Card */}
          <Card className="p-8 relative overflow-hidden border-2 border-primary/50 shadow-xl">
            <div className="mb-6 pb-6 border-b-2 border-dashed border-border">
              <h3 className="text-2xl font-bold mb-3 uppercase">Quarterly Partnership</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-bold text-foreground">$5,000</span>
                <span className="text-lg text-muted-foreground">/ 3 months</span>
              </div>
              <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                💡 Save 15% with annual commitment
              </span>
            </div>
            
            <p className="font-semibold mb-4 text-lg">What's included:</p>
            
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
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Custom Partnership - Inline */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-border text-center">
              <h4 className="text-lg font-bold mb-2 uppercase">Need Something Different?</h4>
              <p className="text-sm text-muted-foreground mb-4">
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
            </div>
          </Card>

          {/* Right: ROI Calculator */}
          <Card className="p-8 border-2 border-border bg-muted/30">
            {/* Prominent Header */}
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold uppercase">ROI Calculator</h3>
            </div>
            <p className="text-muted-foreground mb-8">
              Adjust to match your business metrics
            </p>
            
            <div className="space-y-6 mb-8">
              {/* ARR Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold uppercase tracking-wide">
                    Avg. ARR per Customer
                  </label>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(arr)}
                  </span>
                </div>
                <Slider
                  value={[arr]}
                  onValueChange={(value) => setArr(value[0])}
                  min={5000}
                  max={50000}
                  step={1000}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$5K</span>
                  <span>$50K</span>
                </div>
              </div>

              {/* Conversion Rate Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold uppercase tracking-wide">
                    Trial-to-Paid Conversion
                  </label>
                  <span className="text-xl font-bold text-primary">
                    {conversionRate}%
                  </span>
                </div>
                <Slider
                  value={[conversionRate]}
                  onValueChange={(value) => setConversionRate(value[0])}
                  min={10}
                  max={40}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10%</span>
                  <span>40%</span>
                </div>
              </div>
            </div>

            {/* ROI Results */}
            <div className="flex items-center gap-2 font-semibold mb-4 text-lg pt-6 border-t border-border">
              <TrendingUp className="w-5 h-5 text-primary" />
              Your Projected ROI
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Guaranteed Trials</span>
                <span className="font-bold text-xl">{calculations.trials}+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Est. Customers</span>
                <span className="font-bold text-xl">~{calculations.customers}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-muted-foreground">Projected Revenue</span>
                <span className="font-bold text-primary text-xl">{formatCurrency(calculations.revenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expected ROI</span>
                <span className="font-bold text-primary text-3xl">{formatROI(calculations.roi)}</span>
              </div>
            </div>

            {/* Footnote & Sources */}
            <div className="mt-6 space-y-2">
              <p className="text-xs text-muted-foreground">
                Projections based on your inputs and guaranteed trial minimums. Actual results may vary.
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Sources:</span>{" "}
                <a href="https://www.data-mania.com/blog/b2b-marketing-roi-benchmarks-2025/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  B2B ROI Benchmarks 2025
                </a>{" · "}
                <a href="https://martal.ca/b2b-digital-marketing-benchmarks-lb/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  Digital Marketing Benchmarks
                </a>{" · "}
                <a href="https://www.lomitpatel.com/articles/saas-event-sponsorship-roi/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  SaaS Event Sponsorship ROI
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CommunitySponsorshipSection;
