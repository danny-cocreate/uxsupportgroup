import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const UpcomingEvents = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_type', 'upcoming')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Upcoming Events</h2>
        
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center mb-12">
              <p className="text-destructive mb-4">Failed to load events</p>
              <Button size="lg" asChild>
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
                  View All Events on Meetup.com →
                </a>
              </Button>
            </div>
          ) : events && events.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {events.map((event) => (
                  <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-1">
                      {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                    {event.start_time && (
                      <p className="text-sm text-muted-foreground mb-1">{event.start_time}</p>
                    )}
                    {event.location && (
                      <p className="text-sm text-muted-foreground mb-3">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    {event.meetup_link && (
                      <Button className="w-full" asChild>
                        <a href={event.meetup_link} target="_blank" rel="noopener noreferrer">
                          RSVP on Meetup.com
                        </a>
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Button size="lg" asChild>
                  <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
                    View All Events on Meetup.com →
                  </a>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center mb-12">
              <p className="text-xl text-muted-foreground mb-8">
                No upcoming events scheduled at the moment. Check back soon!
              </p>
              <Button size="lg" asChild>
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
                  View All Events on Meetup.com →
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
