import genericProfile from "@/assets/generic-profile.png";

const SocialProof = () => {
  const attendees = [{
    name: "Sarah Chen",
    role: "Principal Designer",
    company: "Tech Corp"
  }, {
    name: "Marcus Johnson",
    role: "Product Lead",
    company: "Innovation Labs"
  }, {
    name: "Elena Rodriguez",
    role: "UX Director",
    company: "Design Studio"
  }, {
    name: "David Kim",
    role: "AI Researcher",
    company: "Future AI"
  }, {
    name: "Priya Patel",
    role: "Design Systems",
    company: "Scale Inc"
  }, {
    name: "Alex Morgan",
    role: "Product Designer",
    company: "Startup Co"
  }];
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
          {attendees.map((attendee, index) => <div key={index} className="text-center group hover:scale-105 transition-transform">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                <img 
                  src={genericProfile} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-sm mb-1">{attendee.name}</h3>
              <p className="text-xs text-muted-foreground">{attendee.role}</p>
              <p className="text-xs text-muted-foreground">{attendee.company}</p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default SocialProof;