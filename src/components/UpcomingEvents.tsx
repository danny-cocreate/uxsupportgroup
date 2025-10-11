import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const UpcomingEvents = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-12">Upcoming Events</h2>
        
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl text-muted-foreground mb-8">
            We host regular events through Meetup.com including:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">AI x UX: Learn and Share</h3>
              <p className="text-muted-foreground mb-1">Every Wednesday</p>
              <p className="text-sm text-muted-foreground">Virtual</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">UX Happy Hour IRL</h3>
              <p className="text-muted-foreground mb-1">Every Thursday</p>
              <p className="text-sm text-muted-foreground">NYC (Open to all levels)</p>
            </Card>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Plus workshops, webinars, and special sessions throughout the year
          </p>
          
          <Button size="lg" asChild>
            <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
              View All Events on Meetup.com →
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
