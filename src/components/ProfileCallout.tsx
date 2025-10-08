import { Button } from "@/components/ui/button";
import { Award, Star, Users2 } from "lucide-react";

const ProfileCallout = () => {
  return (
    <section className="py-24 bg-gradient-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Every ticket unlocks a{" "}
                <span className="text-gradient">personal profile highlight</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get noticed by peers and industry leaders. Testimonials and milestone 
                shoutouts included as part of your inaugural attendee status.
              </p>
              <Button size="lg" className="gradient-hero text-white">
                Elevate Your Career
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all">
                <Award className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Featured Profile</h3>
                <p className="text-muted-foreground">
                  Showcase your work and achievements in our inaugural attendee gallery. 
                  Get your profile featured to 1000+ industry professionals.
                </p>
              </div>
              
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all">
                <Star className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Milestone Recognition</h3>
                <p className="text-muted-foreground">
                  Share your summit achievements and learning artifacts. Get recognized 
                  for your contributions and workshop creations.
                </p>
              </div>
              
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all">
                <Users2 className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Community Connections</h3>
                <p className="text-muted-foreground">
                  AI-powered matchmaking based on your profile, interests, and goals. 
                  Connect with the right collaborators and mentors.
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
