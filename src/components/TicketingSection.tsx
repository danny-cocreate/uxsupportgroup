import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TicketingSection = () => {
  const tickets = [
    {
      name: "VIP / Influencer",
      price: "Invite Only",
      seats: 20,
      available: 5,
      icon: Crown,
      features: [
        "Exclusive pre-event dinner",
        "Priority seating",
        "VIP networking lounge",
        "Featured speaker access",
        "Premium swag bag"
      ],
      highlight: true,
    },
    {
      name: "Early Bird",
      price: "$99",
      originalPrice: "$199",
      seats: 40,
      available: 15,
      icon: Zap,
      features: [
        "Full day access",
        "All workshops & sessions",
        "Profile highlight",
        "Networking events",
        "Community gallery"
      ],
      urgent: true,
    },
    {
      name: "General Admission",
      price: "$199",
      seats: 40,
      available: 40,
      icon: Check,
      features: [
        "Full day access",
        "All workshops & sessions",
        "Profile highlight",
        "Networking events",
        "Digital resources"
      ],
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Secure Your <span className="text-gradient">Spot</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Early bird tickets selling fast—unlock your future and be featured 
            as an inaugural attendee
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {tickets.map((ticket, index) => {
            const Icon = ticket.icon;
            const percentSold = ((ticket.seats - ticket.available) / ticket.seats) * 100;
            
            return (
              <Card 
                key={index}
                className={`p-8 relative overflow-hidden transition-all hover:scale-105 ${
                  ticket.highlight 
                    ? 'border-primary border-2 shadow-xl' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {ticket.urgent && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                    LIMITED
                  </div>
                )}
                
                <div className="mb-6">
                  <Icon className={`w-12 h-12 mb-4 ${ticket.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                  <h3 className="text-2xl font-bold mb-2">{ticket.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">{ticket.price}</span>
                    {ticket.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {ticket.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Availability</span>
                    <span className="font-semibold">{ticket.available}/{ticket.seats} left</span>
                  </div>
                  <Progress value={percentSold} className="h-2" />
                </div>
                
                <ul className="space-y-3 mb-8">
                  {ticket.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${ticket.highlight ? 'gradient-hero text-white' : ''}`}
                  size="lg"
                  disabled={ticket.price === "Invite Only"}
                >
                  {ticket.price === "Invite Only" ? "By Invitation" : "Claim Ticket"}
                </Button>
              </Card>
            );
          })}
        </div>
        
        <div className="max-w-2xl mx-auto text-center bg-card rounded-2xl p-8 border-2 border-primary/20">
          <h3 className="text-2xl font-bold mb-4">
            🔥 Early Bird Tickets Selling Fast
          </h3>
          <p className="text-muted-foreground mb-6">
            Join the founding cohort of the AIxUX Summit. Only 15 early bird tickets 
            remaining at the special price of $99. After that, tickets go up to $199.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div>
              <div className="text-3xl font-bold text-primary">60</div>
              <div className="text-muted-foreground">Total Seats</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-3xl font-bold text-primary">25</div>
              <div className="text-muted-foreground">Tickets Left</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TicketingSection;
