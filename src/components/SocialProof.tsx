const SocialProof = () => {
  const attendees = [
    { name: "Sarah Chen", role: "Principal Designer", company: "Tech Corp" },
    { name: "Marcus Johnson", role: "Product Lead", company: "Innovation Labs" },
    { name: "Elena Rodriguez", role: "UX Director", company: "Design Studio" },
    { name: "David Kim", role: "AI Researcher", company: "Future AI" },
    { name: "Priya Patel", role: "Design Systems", company: "Scale Inc" },
    { name: "Alex Morgan", role: "Product Designer", company: "Startup Co" },
  ];

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Who's <span className="text-gradient">Joining?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet your future collaborators—network with leading designers, 
            engineers, and visionaries in AI
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
          {attendees.map((attendee, index) => (
            <div 
              key={index}
              className="text-center group hover:scale-105 transition-transform"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {attendee.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1">{attendee.name}</h3>
              <p className="text-xs text-muted-foreground">{attendee.role}</p>
              <p className="text-xs text-muted-foreground">{attendee.company}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-gradient-accent">
            <div className="text-5xl font-bold text-primary mb-2">60</div>
            <p className="text-muted-foreground">Total Attendees</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-accent">
            <div className="text-5xl font-bold text-primary mb-2">20+</div>
            <p className="text-muted-foreground">Industry Leaders</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-accent">
            <div className="text-5xl font-bold text-primary mb-2">1</div>
            <p className="text-muted-foreground">Day of Innovation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
