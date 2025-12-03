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

      {/* ROI Calculator + Pricing Card */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {/* Calculator Controls */}
            <Card className="p-6 border-2 border-border mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <Calculator className="w-3.5 h-3.5" />
                ROI Calculator
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Adjust to match your business metrics
              </p>
              
              <div className="space-y-6">
                {/* ARR Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold uppercase tracking-wide">
                      Avg. ARR per Customer
                    </label>
                    <span className="text-lg font-bold text-primary">
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
                    <label className="text-xs font-bold uppercase tracking-wide">
                      Trial-to-Paid Conversion
                    </label>
                    <span className="text-lg font-bold text-primary">
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
            </Card>

            {/* Quarterly Package with ROI */}
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

              {/* Dynamic ROI Projection */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Your Projected ROI
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trials</span>
                    <span className="font-semibold">{calculations.trials}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customers</span>
                    <span className="font-semibold">~{calculations.customers}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="text-muted-foreground text-sm">Projected Revenue</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(calculations.revenue)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground text-sm">Expected ROI</span>
                  <span className="font-bold text-primary text-2xl">{formatROI(calculations.roi)}</span>
                </div>
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
            </Card>
          </div>

          {/* Custom Plan */}
          <div className="max-w-xl mx-auto mt-12 text-center">
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

          {/* Footnote */}
          <p className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto">
            Projections based on your inputs and guaranteed trial minimums. Actual results may vary.
          </p>
        </div>
      </section>
    </>
  );
};

export default CommunitySponsorshipSection;
