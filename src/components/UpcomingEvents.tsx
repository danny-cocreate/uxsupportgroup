import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Clock } from "lucide-react";

const UpcomingEvents = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">Upcoming Sessions</h2>
            <p className="text-muted-foreground text-lg">Join a live session to experience the community.</p>
          </div>
          <a 
            href="https://www.meetup.com/ux-support-group/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium flex items-center gap-2"
          >
            View Full Calendar →
          </a>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-8 w-20" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-destructive mb-4">Failed to load events</p>
              <Button size="lg" asChild>
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
                  View All Events on Meetup.com →
                </a>
              </Button>
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event, index) => {
                const eventDate = new Date(event.date + 'T00:00:00');
                const borderColors = ['border-t-blue-500', 'border-t-purple-500', 'border-t-green-500'];
                const timeColors = ['text-blue-600', 'text-purple-600', 'text-green-600'];
                
                return (
                  <Card key={event.id} className={`relative overflow-hidden hover:shadow-lg transition-shadow border-t-4 ${borderColors[index % 3]}`}>
                    <div className="p-6">
                      <div className={`text-sm font-bold uppercase mb-3 ${timeColors[index % 3]}`}>
                        {format(eventDate, 'EEEE')}
                        {event.start_time && (
                          <> · {event.start_time}</>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 leading-tight">
                        {event.title}
                      </h3>
                      
                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {event.location && event.location.toLowerCase().includes('virtual') && (
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-muted text-muted-foreground uppercase">
                            Virtual
                          </span>
                        )}
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-muted text-muted-foreground uppercase">
                          Open to All
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
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
