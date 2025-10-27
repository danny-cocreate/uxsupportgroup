import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRight, Check } from "lucide-react";

const MembershipPricing = () => {
  const MONTHLY_PAYMENT_LINK = "https://buy.stripe.com/fZu7sL9R7gaC1ddf9Mes005";
  const ANNUAL_PAYMENT_LINK = "https://buy.stripe.com/7sY7sLe7naQibRR2n0es004";

  const monthlyBenefits = [
    "50% off all paid events",
    "Weekly technical workshops",
    "Weekly coaching sessions",
    "Monthly mini-hackathons",
    "Unlimited workshop recordings",
    "Members-only Slack channel",
    "Access to 260+ events/year"
  ];

  const annualExtraBenefits = [
    "Quarterly 1-on-1 coaching with Danny (1 hr each)"
  ];

  const handleJoin = (paymentLink: string) => {
    window.open(paymentLink, '_blank');
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join <span className="text-gradient">Now</span>
          </h2>
          <p className="text-xl text-background/70 max-w-2xl mx-auto">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Pricing Tabs */}
        <Tabs defaultValue="monthly" className="max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-12 h-14 bg-background/20">
            <TabsTrigger value="monthly" className="text-lg data-[state=active]:bg-background data-[state=active]:text-foreground">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="annual" className="text-lg data-[state=active]:bg-background data-[state=active]:text-foreground">
              Annual
            </TabsTrigger>
          </TabsList>

          {/* Monthly Card */}
          <TabsContent value="monthly">
            <Card className="p-10 relative overflow-hidden border-2 border-background/20 shadow-2xl bg-background text-foreground">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Monthly Membership</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-6xl font-bold text-foreground">$29</span>
                  <span className="text-2xl text-muted-foreground">per month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-10">
                {monthlyBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group" 
                size="lg"
                onClick={() => handleJoin(MONTHLY_PAYMENT_LINK)}
              >
                Choose Monthly
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </TabsContent>

          {/* Annual Card */}
          <TabsContent value="annual">
            <Card className="p-10 relative overflow-hidden border-2 border-background/20 shadow-2xl bg-background text-foreground">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-secondary text-white px-6 py-2 text-sm font-bold rounded-bl-2xl">
                2 MONTHS FREE
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-3xl font-bold mb-4">Annual Membership</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-6xl font-bold text-foreground">$290</span>
                  <span className="text-2xl text-muted-foreground">per year</span>
                </div>
                <p className="text-muted-foreground">That's just $24.17/month — Save $58!</p>
              </div>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg font-semibold">All the monthly benefits and:</span>
                </li>
                {annualExtraBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 ml-8">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group" 
                size="lg"
                onClick={() => handleJoin(ANNUAL_PAYMENT_LINK)}
              >
                Choose Annual
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center mt-12 text-background/70">
          Questions? Email us at <a href="mailto:hello@uxsupportgroup.com" className="underline hover:text-background">hello@uxsupportgroup.com</a>
        </p>
      </div>
    </section>
  );
};

export default MembershipPricing;

