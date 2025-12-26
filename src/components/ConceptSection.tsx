const ConceptSection = () => {
  const outcomes = [
    {
      title: "You built something.",
      description: "An actual prototype or tool you could use Monday morning. Real challenges, not hypotheticals.",
      gradient: "from-primary/20 to-transparent"
    },
    {
      title: "You made friends and felt less alone.",
      description: "The format forced collaboration. By end of day, inside jokes turned into ongoing partnerships. Everyone was figuring this out—even the experts were improvising.",
      gradient: "from-secondary/20 to-transparent"
    },
    {
      title: "You found your position in the AI landscape.",
      description: "You saw where you naturally fit and left with a clear roadmap for what to develop next.",
      gradient: "from-primary/20 to-transparent"
    },
    {
      title: "You learned how to actually use AI tools.",
      description: "Used them, watched others apply them. That same evening, techniques that cut your work time in half.",
      gradient: "from-secondary/20 to-transparent"
    },
    {
      title: "You discovered new possibilities.",
      description: "Watched different approaches to the same problem. That stuck project suddenly had five new angles.",
      gradient: "from-primary/20 to-transparent"
    },
    {
      title: "You built real momentum.",
      description: "Confidence from doing, not listening. A network actively working on what's next. Career moves six months from now trace back to here.",
      gradient: "from-secondary/20 to-transparent"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-20 leading-tight text-center">
            What <span className="text-gradient">Actually Happened</span> <br />
            at the Summit
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="relative p-6 rounded-xl bg-card border border-border"
              >
                <div className="relative">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-4xl font-bold text-primary/20">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 leading-tight">
                    {outcome.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;