// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const EARLY_BIRD_PRICE_ID = "price_1TIEduEt4aAP5ylPU5RJtO6s";
const REGULAR_PRICE_ID = "price_1TIEdyEt4aAP5ylPN6ffwF5U";

function describeInvokeError(err: unknown): string {
  if (!err || typeof err !== "object") return "Something went wrong.";
  const e = err as { name?: string; message?: string };
  const msg = e.message ?? "";
  if (e.name === "FunctionsFetchError" || msg.includes("Failed to send a request to the Edge Function")) {
    return "Could not reach the payment service. Please try again shortly or email info@uxsupportgroup.com.";
  }
  return msg.trim() || "Something went wrong.";
}

const TicketingSection = () => {
  const [isEarlyBird, setIsEarlyBird] = useState(true);
  const [earlyBirdRemaining, setEarlyBirdRemaining] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);
  const earlyBirdSeats = 20;
  const currentPrice = isEarlyBird ? "$2.90" : "$29";
  const percentRemaining = isEarlyBird ? (earlyBirdRemaining / earlyBirdSeats) * 100 : 100;

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
        setIsEarlyBird(true);
        setEarlyBirdRemaining(earlyBirdSeats);
        return;
      }
      setIsEarlyBird(data.isEarlyBird);
      setEarlyBirdRemaining(data.earlyBirdRemaining);
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Connection error. Please refresh the page.');
      setIsEarlyBird(true);
      setEarlyBirdRemaining(earlyBirdSeats);
    } finally {
      setIsCheckingAvailability(false);
    }
  };
  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const priceId = isEarlyBird ? EARLY_BIRD_PRICE_ID : REGULAR_PRICE_ID;
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw new Error(describeInvokeError(error));
      const url = data?.url as string | undefined;
      const errMsg = data?.error as string | undefined;
      if (errMsg || !url) throw new Error(errMsg || "Checkout unavailable");
      window.location.href = url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
      checkAvailability();
    } finally {
      setIsLoading(false);
    }
  };
  return <section id="ticketing" className="py-24 relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Secure Your <span className="text-gradient">Spot</span>
          </h2>
          <p className="text-xl text-background/70 max-w-2xl mx-auto">
            {isEarlyBird ? "Early bird: only 20 tickets at $2.90 — then regular pricing." : "Early bird sold out — regular tickets are $29."}
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
              </div>
              {isEarlyBird && <p className="text-foreground font-semibold">
                  Limited to {earlyBirdSeats} early bird tickets.
                </p>}
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">
                  {isEarlyBird ? "Early Bird Availability" : "Tickets Remaining"}
                </span>
                <span className="font-bold text-muted-foreground">
                  {isEarlyBird ? `${earlyBirdRemaining}/${earlyBirdSeats}` : "Open"} left
                </span>
              </div>
              <Progress value={percentRemaining} className="h-3 mb-2" />
              <p className="text-xs text-center text-neutral-950">
                {isEarlyBird ? "When early bird sells out, regular pricing applies automatically." : "Thank you for supporting AIxUX Summit 2026."}
              </p>
            </div>
            
            
            
            <Button className="w-full h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group" size="lg" onClick={handlePurchase} disabled={isCheckingAvailability || isLoading}>
              {isLoading ? "Opening checkout…" : isEarlyBird ? "Claim Early Bird Ticket" : "Get Your Ticket"}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>
        
        
      </div>
    </section>;
};
export default TicketingSection;