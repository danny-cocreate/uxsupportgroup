import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp } from "lucide-react";

const SponsorROICalculator = () => {
  const [arr, setArr] = useState(15000); // Default $15K ARR
  const [conversionRate, setConversionRate] = useState(20); // Default 20%

  const calculations = useMemo(() => {
    const quarterlyTrials = 50;
    const annualTrials = 200;
    const quarterlyPrice = 5000;
    const annualPrice = 17000;

    const quarterlyCustomers = Math.round(quarterlyTrials * (conversionRate / 100));
    const annualCustomers = Math.round(annualTrials * (conversionRate / 100));

    const quarterlyRevenue = quarterlyCustomers * arr;
    const annualRevenue = annualCustomers * arr;

    const quarterlyROI = quarterlyRevenue / quarterlyPrice;
    const annualROI = annualRevenue / annualPrice;

    return {
      quarterly: {
        trials: quarterlyTrials,
        customers: quarterlyCustomers,
        revenue: quarterlyRevenue,
        roi: quarterlyROI,
        price: quarterlyPrice,
      },
      annual: {
        trials: annualTrials,
        customers: annualCustomers,
        revenue: annualRevenue,
        roi: annualROI,
        price: annualPrice,
      },
    };
  }, [arr, conversionRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatROI = (value: number) => {
    return `${value.toFixed(1)}x`;
  };

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Calculator className="w-4 h-4" />
              ROI Calculator
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Calculate Your <span className="text-gradient">Expected ROI</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Adjust the sliders to match your business metrics. Industry benchmarks for B2B SaaS 
              targeting UX professionals: ARR $10K–$20K, conversion 15–25%.
            </p>
          </div>

          {/* Calculator Controls */}
          <Card className="p-8 border-2 border-border mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* ARR Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold uppercase tracking-wide">
                    Avg. ARR per Customer
                  </label>
                  <span className="text-2xl font-bold text-primary">
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
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold uppercase tracking-wide">
                    Trial-to-Paid Conversion
                  </label>
                  <span className="text-2xl font-bold text-primary">
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

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quarterly Results */}
            <Card className="p-6 border-2 border-border hover:border-primary/50 transition-colors">
              <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quarterly Partnership
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investment</span>
                  <span className="font-semibold">{formatCurrency(calculations.quarterly.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Guaranteed Trials</span>
                  <span className="font-semibold">{calculations.quarterly.trials}+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Projected Customers</span>
                  <span className="font-semibold">~{calculations.quarterly.customers}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-3">
                  <span className="text-muted-foreground">Projected Revenue</span>
                  <span className="font-bold text-primary">{formatCurrency(calculations.quarterly.revenue)}</span>
                </div>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Expected ROI
                </div>
                <div className="text-4xl font-bold text-primary">
                  {formatROI(calculations.quarterly.roi)}
                </div>
              </div>
            </Card>

            {/* Annual Results */}
            <Card className="p-6 border-4 border-primary shadow-lg">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-secondary text-white px-4 py-1 text-xs font-bold rounded-bl-lg uppercase">
                Best Value
              </div>
              <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Annual Partnership
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investment</span>
                  <span className="font-semibold">{formatCurrency(calculations.annual.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Guaranteed Trials</span>
                  <span className="font-semibold">{calculations.annual.trials}+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Projected Customers</span>
                  <span className="font-semibold">~{calculations.annual.customers}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-3">
                  <span className="text-muted-foreground">Projected Revenue</span>
                  <span className="font-bold text-primary">{formatCurrency(calculations.annual.revenue)}</span>
                </div>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Expected ROI
                </div>
                <div className="text-4xl font-bold text-primary">
                  {formatROI(calculations.annual.roi)}
                </div>
              </div>
            </Card>
          </div>

          {/* Footnote */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Projections based on your inputs and guaranteed trial minimums. Actual results may vary.
            Industry benchmarks from{" "}
            <a 
              href="https://userpilot.com/blog/saas-average-conversion-rate/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Userpilot
            </a>,{" "}
            <a 
              href="https://www.saastr.com/5-interesting-learnings-from-figma-at-1-billion-in-arr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              SaaStr
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SponsorROICalculator;
