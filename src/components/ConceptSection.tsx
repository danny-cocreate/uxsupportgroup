import { Sparkles, Users, Award } from "lucide-react";

const ConceptSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/10 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Not another conference.{" "}
              <span className="text-gradient">
                This is an experiment in collaborative possibility.
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              The real value is you. Every attendee unlocks new connections, ideas, 
              and visibility. Your profile is your pass—showcase your talent and be celebrated.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Co-Create</h3>
              <p className="text-muted-foreground">
                Hands-on workshops where you build, learn, and create artifacts 
                that showcase your skills
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Connect</h3>
              <p className="text-muted-foreground">
                AI-powered networking that matches you with peers, collaborators, 
                and future partners
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Get Noticed</h3>
              <p className="text-muted-foreground">
                Every participant gets a profile highlight, featured in our 
                inaugural attendee showcase
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
