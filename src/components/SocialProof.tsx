import genericProfile from "@/assets/generic-profile.png";

const SocialProof = () => {
  const facilitators = [
    {
      name: "Suyen Stevenson",
      role: "MC & Event Coordinator",
      linkedin: "https://www.linkedin.com/in/suyenlyn/",
      initials: "SS"
    },
    {
      name: "Silvia Balu",
      role: "Express Yourself with AI",
      linkedin: "https://www.linkedin.com/in/silviabalu/",
      initials: "SB"
    },
    {
      name: "Alexis Brochu",
      role: "UX to Strategy—Business with AI",
      linkedin: "https://www.linkedin.com/in/alexisbrochu/",
      initials: "AB"
    },
    {
      name: "Hayley Dahle",
      role: "Live Design Challenge",
      linkedin: "#",
      initials: "HD"
    },
    {
      name: "Farooq",
      role: "Live Design Challenge",
      linkedin: "#",
      initials: "F"
    },
    {
      name: "Farah Khan",
      role: "Live Design Challenge",
      linkedin: "#",
      initials: "FK"
    },
    {
      name: "Yatong Wang",
      role: "Live Design Challenge",
      linkedin: "#",
      initials: "YW"
    },
    {
      name: "Volkan Unsal",
      role: "Learning to Learn with AI",
      linkedin: "https://www.linkedin.com/in/volkanunsal/",
      initials: "VU"
    },
    {
      name: "Renata Rocha",
      role: "AI Learning & Development Roadmap",
      linkedin: "https://www.linkedin.com/in/rerocha/",
      initials: "RR"
    },
    {
      name: "Danny Setiawan",
      role: "Founder & Organizer",
      linkedin: "https://www.linkedin.com/in/dnystwn/",
      initials: "DS"
    }
  ];
  return <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Meet the <span className="text-gradient">Facilitators</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet your future collaborators—network with leading designers, 
            engineers, and visionaries in AI
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {facilitators.map((facilitator, index) => (
            <a 
              key={index} 
              href={facilitator.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center group hover:scale-105 transition-transform"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{facilitator.initials}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{facilitator.name}</h3>
              <p className="text-xs text-muted-foreground">{facilitator.role}</p>
            </a>
          ))}
        </div>
      </div>
    </section>;
};
export default SocialProof;