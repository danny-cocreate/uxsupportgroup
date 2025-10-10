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
  const percentSold = isEarlyBird 
    ? ((earlyBirdSeats - earlyBirdRemaining) / earlyBirdSeats * 100) 
    : 65; // Placeholder for regular tickets

  useEffect(() => {
    checkAvailability();
    // Check availability every 30 seconds
    const interval = setInterval(checkAvailability, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkAvailability = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-ticket-availability');
      
      if (error) throw error;
      
      setIsEarlyBird(data.isEarlyBird);
      setEarlyBirdRemaining(data.earlyBirdRemaining);
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const priceId = isEarlyBird ? EARLY_BIRD_PRICE_ID : REGULAR_PRICE_ID;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session. Please try again.');
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-4">
                {isEarlyBird ? <Zap className="w-10 h-10 text-primary" /> : <Clock className="w-10 h-10 text-primary" />}
              </div>
              <h3 className="text-3xl font-bold mb-3">
                {isEarlyBird ? "Early Bird Ticket" : "General Admission"}
              </h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-6xl font-bold text-primary">{currentPrice}</span>
                {originalPrice && <span className="text-2xl text-muted-foreground line-through">
                    {originalPrice}
                  </span>}
              </div>
              {isEarlyBird && <p className="text-primary font-semibold">
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
            
            
            
            <Button 
              className="w-full h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group" 
              size="lg"
              onClick={handlePurchase}
              disabled={isLoading || isCheckingAvailability}
            >
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