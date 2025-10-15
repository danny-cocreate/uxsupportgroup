import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const EARLY_BIRD_PRICE_ID = "price_1SGlggEt4aAP5ylPfhAvGpJW";
const REGULAR_PRICE_ID = "price_1SGlhNEt4aAP5ylPGONodFHs";
const TicketingSection = () => {
  const [isEarlyBird, setIsEarlyBird] = useState(true);
  const [earlyBirdRemaining, setEarlyBirdRemaining] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);
  const earlyBirdSeats = 40;
  const totalSeats = 100;
  const currentPrice = isEarlyBird ? "$99" : "$199";
  const originalPrice = isEarlyBird ? "$199" : null;
  const percentSold = isEarlyBird ? (earlyBirdSeats - earlyBirdRemaining) / earlyBirdSeats * 100 : 65; // Placeholder for regular tickets

  useEffect(() => {
    checkAvailability();
    // Check availability every 30 seconds
    const interval = setInterval(checkAvailability, 30000);
    return () => clearInterval(interval);
  }, []);
  const checkAvailability = async () => {
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('check-ticket-availability');
      if (error) {
        console.error('Availability check error:', error);
        toast.error('Unable to check ticket availability');
        // Fallback: show early bird until Dec 1st, 2025
        const now = new Date();
        const cutoff = new Date("2025-12-01T00:00:00Z");
        setIsEarlyBird(now < cutoff);
        setEarlyBirdRemaining(cutoff > now ? 40 : 0);
        return;
      }
      setIsEarlyBird(data.isEarlyBird);
      setEarlyBirdRemaining(data.earlyBirdRemaining);
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Connection error. Please refresh the page.');
      // Fallback to date-based logic
      const now = new Date();
      const cutoff = new Date("2025-12-01T00:00:00Z");
      setIsEarlyBird(now < cutoff);
    } finally {
      setIsCheckingAvailability(false);
    }
  };
  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const priceId = isEarlyBird ? EARLY_BIRD_PRICE_ID : REGULAR_PRICE_ID;
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId
        }
      });
      if (error) {
        console.error('Checkout error:', error);
        toast.error(`Checkout failed: ${error.message || 'Please try again'}`);
        return;
      }
      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('Checkout opened in new tab');
      } else {
        console.error('No checkout URL received:', data);
        toast.error('No checkout URL received. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Unable to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <section id="ticketing" className="py-24 relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Secure Your <span className="text-gradient">Spot</span>
          </h2>
          <p className="text-xl text-background/70 max-w-2xl mx-auto">
            {isEarlyBird ? "Early bird tickets selling fast—unlock your future at a special price" : "Join the inaugural AIxUX Summit and connect with industry pioneers"}
          </p>
        </div>
        
        {!isEarlyBird && <div className="max-w-3xl mx-auto mb-8 bg-background/10 border border-background/20 rounded-xl p-4 text-center">
            <p className="text-sm text-background/80">
              ⚡ <strong>Early Bird Tickets Sold Out</strong> — Regular pricing now in effect
            </p>
          </div>}
        
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="p-10 relative overflow-hidden border-2 border-background/20 shadow-2xl bg-background text-foreground">
            {isEarlyBird && <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-secondary text-white px-6 py-2 text-sm font-bold rounded-bl-2xl flex items-center gap-2">
                <Zap className="w-4 h-4" />
                LIMITED TIME
              </div>}
            
            <div className="text-center mb-8">
              
              <h3 className="text-3xl font-bold mb-3">
                {isEarlyBird ? "Early Bird Ticket" : "General Admission"}
              </h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-6xl font-bold text-foreground">{currentPrice}</span>
                {originalPrice && <span className="text-2xl text-muted-foreground line-through">
                    {originalPrice}
                  </span>}
              </div>
              {isEarlyBird && <p className="text-foreground font-semibold">
                  Save $100 with Early Bird pricing!
                </p>}
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">
                  {isEarlyBird ? "Early Bird Availability" : "Tickets Remaining"}
                </span>
                <span className="font-bold text-primary">
                  {isEarlyBird ? `${earlyBirdRemaining}/${earlyBirdSeats}` : `35/${totalSeats}`} left
                </span>
              </div>
              <Progress value={percentSold} className="h-3 mb-2" />
              <p className="text-xs text-muted-foreground text-center">
                {isEarlyBird ? "Early bird pricing ends when sold out or 2 weeks before event" : "Limited seats remaining for this exclusive event"}
              </p>
            </div>
            
            
            
            <Button className="w-full h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group" size="lg" onClick={handlePurchase} disabled={isLoading || isCheckingAvailability}>
              {isLoading ? "Processing..." : isEarlyBird ? "Claim Early Bird Ticket" : "Get Your Ticket"}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {isEarlyBird && <p className="text-center text-xs text-muted-foreground mt-4">
                🔥 Act fast! Price increases to $199 after early bird tickets sell out
              </p>}
          </Card>
        </div>
        
        
      </div>
    </section>;
};
export default TicketingSection;