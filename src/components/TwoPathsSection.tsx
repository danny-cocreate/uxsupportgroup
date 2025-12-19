import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Lock, Ticket } from "lucide-react";

const TwoPathsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Two Ways to Grow</h2>
          <p className="text-xl text-muted-foreground">Choose the environment that matches your current goal.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* CARD 1: The Sandbox (Meetup) */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">The Sandbox</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                  OPEN TO ALL
                </span>
              </div>
              <p className="text-lg text-muted-foreground mb-6 italic">
                "I want to explore, play, and see what's possible."
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">For the Curious:</strong> Low-stakes sessions to test new tools and bold ideas.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Permission to Play:</strong> Ask "what if?" without fear of failure.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Ticket className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Pay Per Event:</strong> A small ticket price ensures everyone is present and engaged.
                  </span>
                </li>
              </ul>

              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                asChild
              >
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
                  Browse Events
                </a>
              </Button>
            </div>
          </Card>

          {/* CARD 2: The Accelerator (Skool) */}
          <Card className="relative overflow-hidden bg-foreground text-background border-foreground hover:shadow-xl transition-shadow md:-translate-y-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">The Accelerator</h3>
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MEMBERS ONLY
                </span>
              </div>
              <p className="text-lg text-background/80 mb-6 italic">
                "I want to stop watching and start leading."
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-background/80">
                    <strong className="text-background">For the Builders:</strong> 20+ monthly labs, masterminds, and implementation sprints.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-background/80">
                    <strong className="text-background">The Leadership Track:</strong> Don't just attend sessions—facilitate them.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-background/80">
                    <strong className="text-background">Membership Commitment:</strong> For professionals with skin in the game.
                  </span>
                </li>
              </ul>

              <Button 
                variant="secondary"
                className="w-full bg-white text-foreground hover:bg-white/90" 
                size="lg"
                asChild
              >
                <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer">
                  Join Accelerator
                </a>
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
};

export default TwoPathsSection;

