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
              <div className="space-y-4 mb-12">
                {events.map((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row items-stretch">
                        {/* Date Section - Left */}
                        <div className="gradient-stats text-white p-6 flex flex-col items-center justify-center min-w-[120px] relative">
                          <div className="absolute inset-0 bg-black/40"></div>
                          <div className="text-sm font-semibold uppercase tracking-wide relative z-10">
                            {format(eventDate, 'MMM')}
                          </div>
                          <div className="text-4xl font-bold leading-none my-1 relative z-10">
                            {format(eventDate, 'd')}
                          </div>
                          <div className="text-xs uppercase tracking-wide opacity-90 relative z-10">
                            {format(eventDate, 'EEE')}
                          </div>
                        </div>

                        {/* Event Info - Middle */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start gap-2 mb-3">
                            <Calendar className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <h3 className="text-xl font-bold leading-tight mb-2">
                                {event.title}
                              </h3>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {event.start_time && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{event.start_time}</span>
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* CTA Button - Right */}
                        <div className="flex items-center justify-center p-6 sm:border-l border-border bg-muted/30">
                          {event.meetup_link && (
                            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 whitespace-nowrap" asChild>
                              <a href={event.meetup_link} target="_blank" rel="noopener noreferrer">
                                RSVP Now
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              <div className="text-center">
                <a 
                  href="https://www.meetup.com/ux-support-group/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  View All Events on Meetup.com →
                </a>
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
