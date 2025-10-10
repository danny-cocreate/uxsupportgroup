import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const UpcomingEvents = () => {
  const events = [
    {
      date: "Wed, Nov 15 • 6:00 PM",
      title: "UX Portfolio Review Night",
      description: "Join fellow designers for peer portfolio reviews and feedback in a supportive environment. Bring your work and get actionable insights!",
      price: "Free for Members",
    },
    {
      date: "Sat, Nov 22 • 2:00 PM",
      title: "Design Systems Workshop",
      description: "Learn how to build scalable design systems from a senior product designer. Hands-on exercises included.",
      price: "$15 ($10 Members)",
    },
    {
      date: "Tue, Dec 3 • 7:00 PM",
      title: "UX Happy Hour - Year End Celebration",
      description: "Celebrate the year with casual networking, drinks, and conversation with the UX community. All levels welcome!",
      price: "Free",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-5xl font-bold">Upcoming Events</h2>
          <Link to="/summit">
            <Button variant="outline">View All Events →</Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-primary font-semibold mb-3">{event.date}</p>
              <h3 className="text-xl font-bold mb-3">{event.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{event.description}</p>
              <p className="text-sm font-medium mb-4">{event.price}</p>
              <Button className="w-full">Register</Button>
            </Card>
          ))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-8">
          Events powered by Meetup.com
        </p>
      </div>
    </section>
  );
};

export default UpcomingEvents;
