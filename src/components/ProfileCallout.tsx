import { Button } from "@/components/ui/button";
import { Award, Star, Users2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileCallout = () => {
  const navigate = useNavigate();

  const handleViewSummitWall = () => {
    navigate('/summit-wall');
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Every attendee received a{" "}
                <span className="text-gradient">personal profile highlight</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our inaugural attendees were featured in our community gallery,
                showcasing their achievements and contributions to the summit.
              </p>
              <Button 
                size="lg"
                onClick={handleViewSummitWall}
                className="group"
              >
                View Summit Wall
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all">
                <Award className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Featured Profile</h3>
                <p className="text-muted-foreground">
                  Attendees showcased their work and achievements in our inaugural attendee gallery,
                  featured to 1000+ industry professionals.
                </p>
              </div>
              
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all">
                <Star className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Milestone Recognition</h3>
                <p className="text-muted-foreground">
                  Attendees shared their summit achievements and learning artifacts,
                  recognized for their contributions and workshop creations.
                </p>
              </div>
              
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all">
                <Users2 className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Community Connections</h3>
                <p className="text-muted-foreground">
                  AI-powered matchmaking based on profiles, interests, and goals
                  connected attendees with the right collaborators and mentors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCallout;