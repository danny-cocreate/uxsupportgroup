import { Card } from "@/components/ui/card";

const WhatWeOffer = () => {
  const offerings = [
    {
      icon: "🎯",
      title: "Events & Workshops",
      description: "Regular networking socials, educational workshops, and annual summits to help you connect and grow your UX skills",
    },
    {
      icon: "🤝",
      title: "Mentorship",
      description: "Connect with experienced UX professionals for guidance, career advice, and support on your journey (Coming Q1 2026)",
    },
    {
      icon: "💼",
      title: "Career Support",
      description: "Access our job board, get resume reviews, and tap into resources designed to advance your UX career (Coming Q1 2026)",
    },
  ];

  return (
    <section className="py-24 bg-gradient-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16">What We Offer</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {offerings.map((offer, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">{offer.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{offer.title}</h3>
              <p className="text-muted-foreground">{offer.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
